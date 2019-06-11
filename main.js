const inputVideo = document.querySelector('#inputVideo');
const outputCanvas = document.querySelector('#outputCanvas');
let src;
let dst;
let cap;

cv.onRuntimeInitialized = startStreaming;

function startStreaming() {
  navigator.mediaDevices
    .getUserMedia({ audio: false, video: true })
    .then(stream => {
      const videoTrack = stream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();

      let videoWidthPx = `${settings.width}px`;
      let videoHeightPx = `${settings.height}px`;
      inputVideo.setAttribute('width', videoWidthPx);
      inputVideo.setAttribute('height', videoHeightPx);
      outputCanvas.setAttribute('width', videoWidthPx);
      outputCanvas.setAttribute('height', videoHeightPx);
      inputVideo.srcObject = stream;
      inputVideo.play();

      src = new cv.Mat(settings.height, settings.width, cv.CV_8UC4);
      dst = new cv.Mat(settings.height, settings.width, cv.CV_8UC1);
      cap = new cv.VideoCapture(inputVideo);
      processVideo();
    })
    .catch(console.error);
}

function processVideo() {
  cap.read(src);
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  cv.imshow(outputCanvas, dst);
  window.requestAnimationFrame(processVideo);
}
