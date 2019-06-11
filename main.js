const SCALED_SIZE = 320;
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

      const width = SCALED_SIZE;
      const height = width * (settings.height / settings.width);
      let videoWidthPx = `${width}px`;
      let videoHeightPx = `${height}px`;
      inputVideo.setAttribute('width', videoWidthPx);
      inputVideo.setAttribute('height', videoHeightPx);
      outputCanvas.setAttribute('width', videoWidthPx);
      outputCanvas.setAttribute('height', videoHeightPx);
      inputVideo.srcObject = stream;
      inputVideo.play();

      src = new cv.Mat(height, width, cv.CV_8UC4);
      dst = new cv.Mat(height, width, cv.CV_8UC4);
      cap = new cv.VideoCapture(inputVideo);

      // TODO: create new needed OpenCV objects

      return loadFaceDetectionClassifier();
    })
    .then(() => window.requestAnimationFrame(processVideo))
    .catch(console.error);
}

function processVideo() {
  stats.begin();
  cap.read(src);

  // TODO: Apply classifier and draw found faces on dst-matrix

  cv.imshow(outputCanvas, dst);
  stats.end();
  window.requestAnimationFrame(processVideo);
}

/**
 * Load face detection classifier
 */
const classifierName = 'haarcascade_frontalface_default.xml';
const classifierBuffer = fetch(`./face-detection/${classifierName}`)
  .then(response => response.arrayBuffer());

function loadFaceDetectionClassifier() {
  return classifierBuffer
    .then(buffer => {
      cv.FS_createDataFile('/', classifierName, new Uint8Array(buffer), true, false, false);
      classifier = new cv.CascadeClassifier();
      classifier.load(classifierName);
    })
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
