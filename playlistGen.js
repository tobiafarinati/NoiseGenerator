function getMultipleRandom(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

  const arr = ['b', 'c', 'a', 'd', 'e', 'f', 'g', 'h', 'i'];
  let result = getMultipleRandom(arr, 8);

  let playlistUl = document.getElementById("playlist");
  result.forEach(function(item) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(item));
    playlistUl.appendChild(li);
  });