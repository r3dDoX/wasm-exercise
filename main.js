const inputVideo = document.querySelector('#inputVideo');
const outputCanvas = document.querySelector('#outputCanvas');

cv.onRuntimeInitialized = startStreaming;

function startStreaming() {
  console.log('runtime ready');
}
