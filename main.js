const inputVideo = document.querySelector('#inputVideo');

cv.onRuntimeInitialized = startStreaming;

async function startStreaming() {
  console.log('runtime ready');
}
