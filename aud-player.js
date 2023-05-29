// (A) SUPPORT FUNCTION - FORMAT HH:MM:SS
var timeString = secs => {
  // (A1) HOURS, MINUTES, SECONDS
  let ss = Math.floor(secs),
      hh = Math.floor(ss / 3600),
      mm = Math.floor((ss - (hh * 3600)) / 60);
  ss = ss - (hh * 3600) - (mm * 60);

  // (A2) RETURN FORMATTED TIME
  if (hh>0) { mm = mm<10 ? "0"+mm : mm; }
  ss = ss<10 ? "0"+ss : ss;
  return hh>0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}` ;
};

window.addEventListener("load", () => { for (let i of document.querySelectorAll(".aWrap")) {
  // (B) AUDIO + HTML SETUP + FLAGS
  i.audio = new Audio(encodeURI(i.dataset.src));
  //PLAYER WITH VOLUM CONTROL
  //i.innerHTML =
  //  `<button class="aPlay" disabled><span class="aPlayIco material-icons">
  //    play_arrow
  //  </span></button>
  //  <div class="aCron">
  //    <span class="aNow"></span> / <span class="aTime"></span>
  //  </div>
  //  <input class="aSeek" type="range" min="0" value="0" step="1" disabled>
  //  <span class="aVolIco material-icons">volume_up</span>
  //  <input class="aVolume" type="range" min="0" max="1" value="1" step="0.1" disabled>`;

    i.innerHTML =
    `<button class="aPlay" disabled><span class="aPlayIco material-icons">
      play_arrow
    </span></button>
    <div class="aCron">
      <span class="aNow"></span> / <span class="aTime"></span>
    </div>
    <input class="aSeek" type="range" min="0" value="0" step="1" disabled>`;
  i.aPlay = i.querySelector(".aPlay"),
  i.aPlayIco = i.querySelector(".aPlayIco"),
  i.aNow = i.querySelector(".aNow"),
  i.aTime = i.querySelector(".aTime"),
  i.aSeek = i.querySelector(".aSeek"),
  //i.aVolume = i.querySelector(".aVolume"),
  //i.aVolIco = i.querySelector(".aVolIco");
  i.seeking = false; // user is dragging the seek bar

  // (C) PLAY & PAUSE
  // (C1) CLICK TO PLAY/PAUSE
  i.aPlay.onclick = () => {
    if (i.audio.paused) { i.audio.play(); }
    else { i.audio.pause(); }
  };

  // (C2) SET PLAY/PAUSE ICON
  i.audio.onplay = () => i.aPlayIco.innerHTML = "pause";
  i.audio.onpause = () => i.aPlayIco.innerHTML = "play_arrow";

  // (D) TRACK PROGRESS & SEEK TIME
  // (D1) TRACK LOADING
  i.audio.onloadstart = () => {
    i.aNow.innerHTML = "Loading";
    i.aTime.innerHTML = "";
  };

  // (D2) ON META LOADED
  i.audio.onloadedmetadata = () => {
    // (D2-1) INIT SET TRACK TIME
    i.aNow.innerHTML = timeString(0);
    i.aTime.innerHTML = timeString(i.audio.duration);

    // (D2-2) SET SEEK BAR MAX TIME
    i.aSeek.max = Math.floor(i.audio.duration);

    // (D2-3) USER CHANGE SEEK BAR TIME
    i.aSeek.oninput = () => i.seeking = true; // prevents clash with (d2-4)
    i.aSeek.onchange = () => {
      i.audio.currentTime = i.aSeek.value;
      if (!i.audio.paused) { i.audio.play(); }
      i.seeking = false;
    };

    // (D2-4) UPDATE SEEK BAR ON PLAYING
    i.audio.ontimeupdate = () => {
      if (!i.seeking) { i.aSeek.value = Math.floor(i.audio.currentTime); }
      i.aNow.innerHTML = timeString(i.audio.currentTime);
    };
  };

  // (E) VOLUME
 // i.aVolIco.onclick = () => {
   // i.audio.volume = i.audio.volume==0 ? 1 : 0 ;
   // i.aVolume.value = i.audio.volume;
   // i.aVolIco.innerHTML = (i.aVolume.value==0 ? "volume_mute" : "volume_up");
 // };
 // i.aVolume.onchange = () => {
  //  i.audio.volume = i.aVolume.value;
 //   i.aVolIco.innerHTML = (i.aVolume.value==0 ? "volume_mute" : "volume_up");
//  };

  // (F) ENABLE/DISABLE CONTROLS
  i.audio.oncanplaythrough = () => {
    i.aPlay.disabled = false;
    i.aVolume.disabled = false;
    i.aSeek.disabled = false;
  };
  i.audio.onwaiting = () => {
    i.aPlay.disabled = true;
    i.aVolume.disabled = true;
    i.aSeek.disabled = true;
  };
}});





// (A) SUPPORT FUNCTION - FORMAT HH:MM:SS
var timeString = secs => {
  // (A1) HOURS, MINUTES, SECONDS
  let ss = Math.floor(secs),
      hh = Math.floor(ss / 3600),
      mm = Math.floor((ss - (hh * 3600)) / 60);
  ss = ss - (hh * 3600) - (mm * 60);

  // (A2) RETURN FORMATTED TIME
  if (hh>0) { mm = mm<10 ? "0"+mm : mm; }
  ss = ss<10 ? "0"+ss : ss;
  return hh>0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}` ;
};

window.addEventListener("load", () => { for (let i of document.querySelectorAll(".aWrap1")) {
  // (B) AUDIO + HTML SETUP + FLAGS
  i.audio = new Audio(encodeURI(i.dataset.src));
    i.innerHTML =
    `<button class="aPlay1" disabled><span class="aPlayIco1 material-icons">
      play_arrow
    </span></button>
    <div class="aCron1">
      <span class="aNow1"></span> / <span class="aTime1"></span>
    </div>
    <input class="aSeek1" type="range" min="0" value="0" step="1" disabled>`;
  i.aPlay1 = i.querySelector(".aPlay1"),
  i.aPlayIco1 = i.querySelector(".aPlayIco1"),
  i.aNow1 = i.querySelector(".aNow1"),
  i.aTime1 = i.querySelector(".aTime1"),
  i.aSeek1 = i.querySelector(".aSeek1"),
  i.seeking = false; // user is dragging the seek bar

  // (C) PLAY & PAUSE
  // (C1) CLICK TO PLAY/PAUSE
  i.aPlay1.onclick = () => {
    if (i.audio.paused) { i.audio.play(); }
    else { i.audio.pause(); }
  };

  // (C2) SET PLAY/PAUSE ICON
  i.audio.onplay = () => i.aPlayIco1.innerHTML = "pause";
  i.audio.onpause = () => i.aPlayIco1.innerHTML = "play_arrow";

  // (D) TRACK PROGRESS & SEEK TIME
  // (D1) TRACK LOADING
  i.audio.onloadstart = () => {
    i.aNow1.innerHTML = "Loading";
    i.aTime1.innerHTML = "";
  };

  // (D2) ON META LOADED
  i.audio.onloadedmetadata = () => {
    // (D2-1) INIT SET TRACK TIME
    i.aNow1.innerHTML = timeString(0);
    i.aTime1.innerHTML = timeString(i.audio.duration);

    // (D2-2) SET SEEK BAR MAX TIME
    i.aSeek1.max = Math.floor(i.audio.duration);

    // (D2-3) USER CHANGE SEEK BAR TIME
    i.aSeek1.oninput = () => i.seeking = true; // prevents clash with (d2-4)
    i.aSeek1.onchange = () => {
      i.audio.currentTime = i.aSeek1.value;
      if (!i.audio.paused) { i.audio.play(); }
      i.seeking = false;
    };

    // (D2-4) UPDATE SEEK BAR ON PLAYING
    i.audio.ontimeupdate = () => {
      if (!i.seeking) { i.aSeek1.value = Math.floor(i.audio.currentTime); }
      i.aNow1.innerHTML = timeString(i.audio.currentTime);
    };
  };

  // (F) ENABLE/DISABLE CONTROLS
  i.audio.oncanplaythrough = () => {
    i.aPlay1.disabled = false;
    i.aVolume1.disabled = false;
    i.aSeek1.disabled = false;
  };
  i.audio.onwaiting = () => {
    i.aPlay1.disabled = true;
    i.aVolume1.disabled = true;
    i.aSeek1.disabled = true;
  };
}});