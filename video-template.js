var video = document.createElement("VIDEO");

video.setAttribute("id", "video-element");
video.setAttribute("width", "320");
video.setAttribute("height", "240");
video.setAttribute("controls", "true");

video.src="https://storage.googleapis.com/interactive-media-ads/media/android.mp4";

document.body.appendChild(video);

// On window load, attach an event to the play button click
// that triggers playback on the video element
window.addEventListener('load', function(event) {
    video = document.getElementById('video-element');
    var playButton = document.getElementById('play-button');
    playButton.addEventListener('click', function(event) {
      videoElement.play();
    });
});
