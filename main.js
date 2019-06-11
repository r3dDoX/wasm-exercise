const inputVideo = document.querySelector('#inputVideo');
const outputCanvas = document.querySelector('#outputCanvas');
let src;
let dst;
let cap;
let stats;

cv.onRuntimeInitialized = startStreaming;

function startStreaming() {
  navigator.mediaDevices
    .getUserMedia({ audio: false, video: true })
    .then(stream => {
      setupStats();
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
      window.requestAnimationFrame(processVideo);
    })
    .catch(console.error);
}

function processVideo() {
  stats.begin();
  cap.read(src);
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  cv.imshow(outputCanvas, dst);
  stats.end();
  window.requestAnimationFrame(processVideo);
}


/**
 * Setup FPS meter
 */
function setupStats() {
  stats = new Stats();
  stats.showPanel(0);
  stats.domElement.style.right = '0px';
  stats.domElement.style.left = '';
  document.body.appendChild(stats.domElement);
}
