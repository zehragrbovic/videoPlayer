function videoFunction() {

    var video = document.createElement("VIDEO");

    video.setAttribute("width", "320");
    video.setAttribute("height", "240");
    video.setAttribute("controls", "true");
    document.body.appendChild(video);

} 