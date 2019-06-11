const inputVideo = document.querySelector('#inputVideo');

cv.onRuntimeInitialized = startStreaming;

function startStreaming() {
  console.log('runtime ready');
}
