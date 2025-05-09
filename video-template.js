//importing IMA SDK
var IMASDK = document.createElement("script");
IMASDK.src = "https://imasdk.googleapis.com/js/sdkloader/ima3.js";
document.head.appendChild(IMASDK);

//creating video element
var videoElement = document.createElement("VIDEO");
videoElement.setAttribute("id", "video-element");
videoElement.setAttribute("width", "320");
videoElement.setAttribute("height", "240");
videoElement.setAttribute("controls", "true");
videoElement.style.position = "fixed";
videoElement.style.bottom = "20px";
videoElement.style.right = "20px";
videoElement.src="https://storage.googleapis.com/interactive-media-ads/media/android.mp4";
videoElement.muted = true;
//videoElement.autoplay = true;
//document.body.appendChild(videoElement);

//creating ad container
var adContainer = document.createElement("div");
adContainer.setAttribute("id", "ad-container");
adContainer.style.position = "absolute";
adContainer.style.width = "100%";
adContainer.style.height = "100%";

// Create a wrapper to hold both video and ad container
var wrapper = document.createElement("div");
wrapper.style.position = "fixed";
wrapper.style.bottom = "20px";
wrapper.style.right = "20px";
wrapper.style.width = "320px";
wrapper.style.height = "240px";
wrapper.style.zIndex = "9999";
wrapper.style.overflow = "hidden";
document.body.appendChild(wrapper);

// Move video and adContainer into wrapper
wrapper.appendChild(videoElement);
wrapper.appendChild(adContainer);

var adDisplayContainer;
var adsLoader;
var adsManager;
var adsLoaded = false;

// On window load, attach an event to the play button click that triggers playback on the video element
window.addEventListener('load', function(event) {
    videoElement = document.getElementById('video-element');
    initializeIMA();
    videoElement.addEventListener('play', function(event) {
        loadAds(event);
    });
    var playButton = document.getElementById('play-button');
    playButton.addEventListener('click', function(event) {
        loadAds(event);
    });
});


window.addEventListener('resize', function(event) {
    console.log("window resized");
    if(adsManager) {
        var width = videoElement.clientWidth;
        var height = videoElement.clientHeight;
        adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
    }
});

function initializeIMA() {
    console.log("initializing IMA");
    adContainer = document.getElementById('ad-container');
    adContainer.addEventListener('click', adContainerClick);
    adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoElement);
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
    videoElement.addEventListener('ended', function() {
        adsLoader.contentComplete();
    });
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
    // Instantiate the AdsManager from the adsLoader response and pass it the video element
    adsManager = adsManagerLoadedEvent.getAdsManager(
        videoElement);

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
    
    try {
        var width = videoElement.clientWidth;
        var height = videoElement.clientHeight;
        adsManager.init(width, height, google.ima.ViewMode.NORMAL);
        adsManager.start();
    } catch (adError) {
        // Play the video without ads, if an error occurs
        console.log("AdsManager could not be started");
        videoElement.play();
    }
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
    videoElement.load();
    adDisplayContainer.initialize();

    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
        'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
        'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
        'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';

    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    adsRequest.linearAdSlotWidth = videoElement.clientWidth;
    adsRequest.linearAdSlotHeight = videoElement.clientHeight;
    adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth;
    adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3;
  
    adsRequest.setAdWillAutoPlay(true);
    adsRequest.setAdWillPlayMuted(true);

    // Pass the request to the adsLoader to request ads
    adsLoader.requestAds(adsRequest);
}

// Autoplay ad and video as soon as the page loads (user gesture workaround)
window.addEventListener('load', function () {
    // Create and click a hidden button to simulate user interaction
    const hiddenPlayButton = document.createElement('button');
    hiddenPlayButton.style.display = 'none';
    document.body.appendChild(hiddenPlayButton);
  
    hiddenPlayButton.addEventListener('click', function (event) {
        loadAds(event); // triggers ad + video playback
    });
  
    // Simulate user interaction
    hiddenPlayButton.click();
});
  