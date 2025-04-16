//importing IMA SDK
var IMASDK = document.createElement("script");
IMASDK.src = "//imasdk.googleapis.com/js/sdkloader/ima3.js";
document.head.appendChild(IMASDK);

//creating video element
var video = document.createElement("VIDEO");

video.setAttribute("id", "video-element");
video.setAttribute("width", "320");
video.setAttribute("height", "240");
video.setAttribute("controls", "true");

video.src="https://storage.googleapis.com/interactive-media-ads/media/android.mp4";

document.body.appendChild(video);

// Define a variable to track whether there are ads loaded and initially set it to false
var adsLoaded = false;

// On window load, attach an event to the play button click that triggers playback on the video element
window.addEventListener('load', function(event) {
    video = document.getElementById('video-element');
    initializeIMA();
    videoElement.addEventListener('play', function(event) {
        loadAds(event);
    });
    var playButton = document.getElementById('play-button');
    playButton.addEventListener('click', function(event) {
      videoElement.play();
    });
});

window.addEventListener('resize', function(event) {
  console.log("window resized");
});

function initializeIMA() {
  console.log("initializing IMA");
}

function loadAds(event) {
  // Prevent this function from running on if there are already ads loaded
  if(adsLoaded) {
    return;
  }
  adsLoaded = true;

  // Prevent triggering immediate playback when ads are loading
  event.preventDefault();

  console.log("loading ads");
}