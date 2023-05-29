let audioFile;
let audioBuffer;
let segmentLength = 140; // length of each segment in milliseconds
let patternLength = 15; // length of each pattern in segments
let numPatterns; // number of patterns in the final output
let numSegments; // total number of segments in the output
let segments = [];
let patterns = [];
let audioContext;

function preload() {
  let audioFiles = ['song/3E.mp3', 'song/Baby Dee.mp3', 'song/Breakfast.mp3', 'song/Bye Bye Bayou.mp3', 'song/Can-t Be Funky.mp3', 'song/Clean On Your Bean #1.mp3', 'song/Contort Yourself.mp3', 'song/Do Dada.mp3', 'song/Elephant.mp3', 'song/Helen Fordsdale.mp3', 'song/Pini, Pini.mp3', 'song/Reduction.mp3', 'song/Son of Sam.mp3', 'song/Too Many Creeps.mp3', 'song/Wawa.mp3', 'song/You Got Me.mp3',];
  
  // Select a random audio file from the list
  let randomIndex = Math.floor(Math.random() * audioFiles.length);
  let randomAudioFile = audioFiles[randomIndex];
  
  // Load the selected audio file
  audioFile = loadSound(randomAudioFile, onAudioLoaded);
  console.log(audioFile);
  document.getElementById("inputSongValue").innerHTML = randomAudioFile;
  //set the length randomly
  segmentLength = Math.floor(Math.random() * 280) + 20;
  console.log(segmentLength);
  document.getElementById("segmentLengthValue").innerHTML = segmentLength;
}

function onAudioLoaded() {
  // Create a new AudioContext object
  audioContext = new AudioContext();
  
  // Get the decoded audio buffer from the loaded audio file
  audioBuffer = audioFile.buffer;
  
  // Calculate the maximum number of patterns and segments that fit within 1 minute
  let maxDuration = 60; // maximum duration of the output song in seconds
  numPatterns = Math.floor(maxDuration * 1000 / (segmentLength * patternLength));
  numSegments = numPatterns * patternLength;
  
  // Split the audio buffer into segments of the specified length, up to the maximum duration
  for(let i = 0; i < numSegments; i++) {
    let go = i * segmentLength / 1000;
    let end = go + segmentLength / 1000;
    let segment = audioBuffer.getChannelData(0).subarray(go * audioBuffer.sampleRate, end * audioBuffer.sampleRate);
    segments.push(segment);
    
    // Print the length of the segment in milliseconds
    document.getElementById("segmentsValue").innerHTML = i;
    //console.log(`Segment ${i}: ${segmentLength}ms`);
  }
  
  // Shuffle the segments array using the Fisher-Yates shuffle algorithm
  for (let i = segments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [segments[i], segments[j]] = [segments[j], segments[i]];
  }
  
  // Group segments into patterns
  for (let i = 0; i < numPatterns; i++) {
    let pattern = [];
    for (let j = 0; j < patternLength; j++) {
      pattern.push(segments[i * patternLength + j]);
    }
    patterns.push(pattern);
  }
  
  // Arrange patterns in a specific sequence
  let patternSequence = [0, 0, 2, 2, 1, 1, 3, 3, 3, 3, 2, 0, 1]; // example pattern sequence
  let outputSegments = [];
  while (outputSegments.length < numSegments) {
    outputSegments = outputSegments.concat(patternSequence.map(index => patterns[index]).flat());
  }
  outputSegments = outputSegments.slice(0, numSegments);
  
  // Create a new audio buffer for the output song
  let outputBuffer = new AudioBuffer({
    numberOfChannels: 1,
    length: outputSegments.length * segmentLength * audioBuffer.sampleRate / 1000,
    sampleRate: audioBuffer.sampleRate
  });
  
  // Copy each segment into the output buffer in their arranged order
  for (let i = 0; i < outputSegments.length; i++) {
    let offset = i * segmentLength * audioBuffer.sampleRate / 1000;
    outputBuffer.copyToChannel(outputSegments[i], 0, offset);
  }

outputSource = new AudioBufferSourceNode(audioContext, { buffer: outputBuffer });
  outputSource.loop = true;
  
  // Convert the output buffer to a WAV file
  let wavBlob = audioBufferToWav(outputBuffer);
  
  // Create a download link for the WAV file
  let url = URL.createObjectURL(wavBlob);
  let link = document.createElement('a');
  link.href = url;
  link.download = 'output.wav';
  link.innerHTML = ' here';
  document.body.appendChild(link);
  //document.getElementById("DownloadValue").innerHTML = link;
  console.log(link);

  // Insert the download link into the placeholder element in the HTML file
  let downloadDiv = document.getElementById('download');
  downloadDiv.appendChild(link);
  
  let playBtn = document.getElementById('play-btn');
let stopBtn = document.getElementById('stop-btn');

playBtn.addEventListener('click', function() {
  if (outputSource && outputSource.isPlaying) {
    outputSource.stop();
  }
  outputSource = new AudioBufferSourceNode(audioContext, { buffer: outputBuffer });
  outputSource.loop = true;
  outputSource.connect(audioContext.destination);
  outputSource.start();
});

stopBtn.addEventListener('click', function() {
  outputSource.stop();
});
}

function setup() {
  createCanvas(400, 400);
}

function audioBufferToWav(aBuffer) {
  let numOfChan = aBuffer.numberOfChannels,
    length = aBuffer.length * numOfChan * 2 + 44,
    buffer = new ArrayBuffer(length),
    view = new DataView(buffer),
    channels = [],
    i,
    sample,
    offset = 0,
    pos = 0;

  // write WAVE header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(aBuffer.sampleRate);
  setUint32(aBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit (hardcoded in this demo)

  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  // write interleaved data
  for (i = 0; i < aBuffer.numberOfChannels; i++) channels.push(aBuffer.getChannelData(i));

  while (pos < length) {
    for (i = 0; i < numOfChan; i++) {
      // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
      view.setInt16(pos, sample, true); // write 16-bit sample
      pos += 2;
    }
    offset++; // next source sample
  }

  // create Blob
  return new Blob([buffer], { type: 'audio/wav' });

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}