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

//creating ad container
var adContainer = document.createElement("div");
adContainer.setAttribute("id", "ad-container");

var adDisplayContainer;
var adsLoader;
var adsManager;

// Define a variable to track whether there are ads loaded and initially set it to false
var adsLoaded = false;


// On window load, attach an event to the play button click that triggers playback on the video element
window.addEventListener('load', function(event) {
    video = document.getElementById('video-element');
    initializeIMA();
    video.addEventListener('play', function(event) {
        loadAds(event);
    });
    var playButton = document.getElementById('play-button');
    playButton.addEventListener('click', function(event) {
      video.play();
    });
});

window.addEventListener('resize', function(event) {
  console.log("window resized");
  if(adsManager) {
    var width = video.clientWidth;
    var height = video.clientHeight;
    adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
  }
});

function initializeIMA() {
  console.log("initializing IMA");
  adContainer = document.getElementById('ad-container');
  adContainer.addEventListener('click', adContainerClick);
  adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, video);
  adsLoader = new google.ima.AdsLoader(adDisplayContainer);
  adsLoader.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      onAdsManagerLoaded,
      false);
  adsLoader.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      onAdError,
      false);

  // Let the AdsLoader know when the video has ended
  video.addEventListener('ended', function() {
    adsLoader.contentComplete();
  });

  var adsRequest = new google.ima.AdsRequest();
  adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
      'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
      'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
      'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';

  // Specify the linear and nonlinear slot sizes. This helps the SDK to
  // select the correct creative if multiple are returned.
  adsRequest.linearAdSlotWidth = video.clientWidth;
  adsRequest.linearAdSlotHeight = video.clientHeight;
  adsRequest.nonLinearAdSlotWidth = video.clientWidth;
  adsRequest.nonLinearAdSlotHeight = video.clientHeight / 3;

  // Pass the request to the adsLoader to request ads
  adsLoader.requestAds(adsRequest);
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
  // Instantiate the AdsManager from the adsLoader response and pass it the video element
  adsManager = adsManagerLoadedEvent.getAdsManager(
    video);

  adsManager.addEventListener(
    google.ima.AdErrorEvent.Type.AD_ERROR,
    onAdError);

  adsManager.addEventListener(
    google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
    onContentPauseRequested);

  adsManager.addEventListener(
    google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
    onContentResumeRequested);

  adsManager.addEventListener(
    google.ima.AdEvent.Type.LOADED,
    onAdLoaded);
}

function onAdError(adErrorEvent) {
  // Handle the error logging.
  console.log(adErrorEvent.getError());
  if(adsManager) {
    adsManager.destroy();
  }
}

function onContentPauseRequested() {
  videoElement.pause();
}
  
function onContentResumeRequested() {
  videoElement.play();
}

function onAdLoaded(adEvent) {
    var ad = adEvent.getAd();
    if (!ad.isLinear()) {
      videoElement.play();
    }
}

function adContainerClick(event) {
    console.log("ad container clicked");
    if(videoElement.paused) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
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

  // Initialize the container. Must be done via a user action on mobile devices.
  video.load();
  adDisplayContainer.initialize();

  var width = video.clientWidth;
  var height = video.clientHeight;
  try {
    adsManager.init(width, height, google.ima.ViewMode.NORMAL);
    adsManager.start();
  } catch (adError) {
    // Play the video without ads, if an error occurs
    console.log("AdsManager could not be started");
    video.play();
  }
}