function getMultipleRandom(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

  const arr = ['Liquid Liquid/ Optimo', 'Konk / Baby Dee', 'The Dance / Do Dada', 'Material /	Reduction', 'Lizzy Mercier Descloux /	Wawa', 'DNA / 5:30', 'Rammellzee Vs. K.Rob / Beat Bop', 'The Contortions / Contort Yourself', 'iGlenn Branca / Lesson No.1', 'The Bloods / Button Up', 'Dinosaur L / Clean On Your Bean', 'Theoretical Girls / You Got Me', 'Bush Tetras / Can-t Be Funky', 'Mars ⁄ Helen Fordsdale', 'ESG / You Make No Sense', 'Defunkt / Defunkt'];
  let result = getMultipleRandom(arr, 8);

  let playlistUl = document.getElementById("playlist");
  result.forEach(function(item) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(item));
    playlistUl.appendChild(li);
  });