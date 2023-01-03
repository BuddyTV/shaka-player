const manifestUri =
//    'video1/video1.m3u8';
      'https://viziogram-transcoding-output.s3.us-east-2.amazonaws.com/bbb_sunflower_1080p_60fps_normal.m3u8';

function initApp() {
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (shaka.Player.isBrowserSupported()) {
    // Everything looks good!
    initPlayer();
//  shaka.log.setLevel(shaka.log.Level.V2);
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!');
  }
}

async function initPlayer() {
  // Create a Player instance.
  const video = document.getElementById('video');
  const playerContainer = document.getElementById('video-container');
  const player = new shaka.Player(video);

  // Attach player to the window to make it easy to access in the JS console.
  window.player = player;

  // Listen for error events.
  player.addEventListener('error', onErrorEvent);
  player.configure('streaming.forceTransmuxTS', true);
  player.configure('streaming.inaccurateManifestTolerance', 0); // TO REDUCE TUNE TIME(https://github.com/shaka-project/shaka-player/issues/2291#issuecomment-592076044)


/*
  // Try to load a manifest.
  // This is an asynchronous process.
  try {
    //await player.load(manifestUri);
    await player.load(get_prefetched(manifestUri))
    // This runs if the asynchronous load is successful.
    console.log('The video has now been loaded!');
  } catch (e) {
    // onError is executed if the asynchronous load fails.
    onError(e);
  }
*/
}

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error) {
  // Log the error.
  console.error('Error code', error.code, 'object', error);
}

document.addEventListener('DOMContentLoaded', initApp);
