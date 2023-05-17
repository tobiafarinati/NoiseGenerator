let audioFile;
let audioBuffer;
let segmentLength = 140; // length of each segment in milliseconds
let patternLength = 15; // length of each pattern in segments
let numPatterns; // number of patterns in the final output
let numSegments; // total number of segments in the output
let segments = [];
let patterns = [];
let audioContext;
//distortion curve
let DC = 0;
//delay (milliseconds)
let D = 0; // delay time in milliseconds
//low pass 
let LP = 5000;
//high pass
let HP = 0;
//gain
let G = 6;

let distortionSlider, delaySlider, lowpassSlider, highpassSlider, gainSlider;
let distortionAmount = 0, delayTime = 0, lowpassFreq = 5000, highpassFreq = 0, gainValue = 0.5;

// Create global variables for the audio nodes
let distortionNode, delayNode, lowpassNode, highpassNode, gainNode;

function preload() {
  audioFile = loadSound('sounds/02ContortYourself.mp3', onAudioLoaded, onAudioLoadError);
  console.log("1");
}

function onAudioLoaded() {
  console.log("2");
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
    console.log(`Segment ${i}: ${segmentLength}ms`);
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
  let patternSequence = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3]; // example pattern sequence
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

  // Create a new audio source from the output buffer
  let outputSource = audioContext.createBufferSource();
  outputSource.buffer = outputBuffer;

  // Create a gain node for volume control
  gainNode = audioContext.createGain();

  // Create a low-pass filter node
  lowpassNode = audioContext.createBiquadFilter();
  lowpassNode.type = "lowpass";
  lowpassNode.frequency.value = LP;

  // Create a high-pass filter node
  highpassNode = audioContext.createBiquadFilter();
  highpassNode.type = "highpass";
  highpassNode.frequency.value = HP;

  // Create a distortion node
  distortionNode = audioContext.createWaveShaper();
  distortionNode.curve = makeDistortionCurve(DC);

  // Create a delay node
  delayNode = audioContext.createDelay();
  delayNode.delayTime.value = D / 1000;

  // Connect the nodes to the audio output
  outputSource.connect(distortionNode);
  distortionNode.connect(delayNode);
  delayNode.connect(lowpassNode);
  lowpassNode.connect(highpassNode);
  highpassNode.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Start the output source
  outputSource.start();
}

function onAudioLoadError(error) {
  console.error(`Error loading audio file: ${error}`);
}

function makeDistortionCurve(amount) {
  let k = amount;
  let n_samples = 44100;
  let curve = new Float32Array(n_samples);
  let deg = Math.PI / 180;
  let x;
  for (let i = 0; i < n_samples; ++i) {
    x = i * 2 / n_samples - 1;
    curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

function setup() {
  createCanvas(400, 400);
  distortionSlider = createSlider(0, 500, 0);
  delaySlider = createSlider(0, 1000, 0);
  lowpassSlider = createSlider(0, 20000, 5000);
  highpassSlider = createSlider(0, 20000, 0);
  gainSlider = createSlider(0, 4, 0.5, 0.01);
}

function draw() {
  // Update the audio effects parameters based on the slider values
  distortionAmount = distortionSlider.value();
  delayTime = delaySlider.value();
  lowpassFreq = lowpassSlider.value();
  highpassFreq = highpassSlider.value();
  gainValue = gainSlider.value();

  // Update the distortion curve based on the distortion amount
  distortionNode.curve = makeDistortionCurve(distortionAmount);

  // Update the delay time based on the delay slider value
  delayNode.delayTime.value = delayTime / 1000;

  // Update the low-pass filter frequency based on the low-pass slider value
  lowpassNode.frequency.value = lowpassFreq;

  // Update the high-pass filter frequency based on the high-pass slider value
  highpassNode.frequency.value = highpassFreq;

  // Update the gain based on the gain slider value
  gainNode.gain.value = gainValue;

  // Draw the slider labels
  textSize(16);
  textAlign(CENTER);
  text(`Distortion: ${distortionAmount.toFixed(2)}`, width / 2, 20);
  text(`Delay: ${delayTime}ms`, width / 2, 60);
  text(`Low-pass Filter: ${lowpassFreq}Hz`, width / 2, 100);
  text(`High-pass Filter: ${highpassFreq}Hz`, width / 2, 140);
  text(`Volume: ${gainValue.toFixed(2)}`, width / 2, 180);
}
