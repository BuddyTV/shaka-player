       var selected;
       var menu_selected;
       var list = [
[

],
// WF+ Clear
[
"http://cdn-ue1-prod.tsv2.amagi.tv/linear/amg00346-vizioinc-oando1-vizious/playlist.m3u8",
"https://dai2.xumo.com/amagi_hls_data_xumo1212A-viziofilmrisewestern/CDN/playlist.m3u8",
"https://cdn-ue1-prod.tsv2.amagi.tv/linear/vizioAAAA-foxnewsnow-vizio/playlist.m3u8",
"https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01549-thedailywire-dailywire-vizious/playlist.m3u8"
],
[

],
// WF+ Pluto
[

]
       ];
       
       function onEnded() {
          console.log("ENDED!!!");
       }
       
       function onDurationChange() {
          console.log("durationchange "+videoElement.duration);
       }
       
       function onTimeUpdate() {
       //   console.log("timeupdate "+videoElement.currentTime);       
       }
       
       function play() {
         spinnerElement.style.display = "block";
         let conf_fn;
         switch (menu_selected) {
            case 1: conf_fn = configure_avod;
               break;
            case 2: conf_fn = configure_clear;
               break;
            case 3: conf_fn = configure_wfdrm;
               break;
            case 4: conf_fn = configure_pluto;
               break;
            default:
               console.error("incorrect selection");
               return;
         }
         let url = list[menu_selected-1][selected-1];
         console.log(url);
         try {
             // player.getNetworkingEngine().clearAllRequestFilters();
             conf_fn(selected-1).then(() => {
                player.load(get_prefetched(url)).then(() => {
                      console.log("loaded!!!");
                      spinnerElement.style.display = "none";
                      videoElement.play();
                });
             });
         }
         catch (err) 
         {
            console.err(err);
         }
       }

       
         function selectBtn(num) {
          for (let i=1; i<=4; i++) {
            let btn = document.getElementById("btn"+i);
            if (num == i) {
              btn.classList.add("selected");
              if (menu_selected == 2 /* clear content */) {
                  prefetch(list[1][num-1]);
              }
            }
            else
              btn.classList.remove("selected");
          }
       }

       function selectNext() {
          if (++selected > 4) selected = 1;
          selectBtn(selected);
       }

       function selectPrev() {
          if (--selected < 1) selected = 4;
          selectBtn(selected);
       }

       function selectMenuItem(num) {
          for (let i=1; i<=4; i++) {
            let menuitem = document.getElementById("menuitem"+i);
            if (num == i) 
              menuitem.classList.add("selected");
            else
              menuitem.classList.remove("selected");
          }
       }


       function menuDown() {
          if (++menu_selected > 4) menu_selected = 1;
          selectMenuItem(menu_selected);
       }

       function menuUp() {
          if (--menu_selected < 1) menu_selected = 4;
          selectMenuItem(menu_selected);
       }
       
       function selectSomething() {
           let menu = document.getElementById("menu");
           let nav = document.getElementById("nav");
           if (menu.classList.contains("visible")) {
              menu.classList.remove("visible");
              nav.classList.add("visible");
              selectBtn(selected=1);
           } else {
              play();
           }
       }
       
       function backMenu() {
           let menu = document.getElementById("menu");
           let nav = document.getElementById("nav");
           if (nav.classList.contains("visible")) {
              nav.classList.remove("visible");
              menu.classList.add("visible");
           } else {
              menu.classList.remove("visible");
              nav.classList.add("visible");
           }
       }

       document.onkeydown = function(e) {
          if (e.keyCode == 40) {
              e.preventDefault();
              menuDown();
          } else if (e.keyCode == 38) {
              e.preventDefault();
              menuUp();
          } else if (e.keyCode == 37) {
              e.preventDefault();
              selectPrev();
          } else if (e.keyCode == 39) {
              e.preventDefault();
              selectNext();
          } else if (e.keyCode == 13) {
              e.preventDefault();
              selectSomething();
          } else if (e.keyCode == 8) {
              e.preventDefault();
              backMenu();
          }
       }

       document.addEventListener('DOMContentLoaded',function() {
           videoElement = document.getElementById("video");
           videoElement.addEventListener("ended", onEnded);
           videoElement.addEventListener("durationchange", onDurationChange);
           videoElement.addEventListener("timeupdate", onTimeUpdate);
           spinnerElement = document.getElementById("spinner");
           selectMenuItem(menu_selected=1);
       }, false);
