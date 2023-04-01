const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const downloadLink = document.getElementById('downloadLink');
const refreshButton = document.getElementById('refreshButton');

let mediaRecorder;
let recordedChunks = [];

startButton.addEventListener('click', async () => {
  document.title = "Recording - JK ScreenRecorder";

  refreshButton.disabled = true;
  mediaRecorder = new MediaRecorder(await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }));

  mediaRecorder.addEventListener('dataavailable', e => {
    recordedChunks.push(e.data);
  });

  mediaRecorder.addEventListener('stop', () => {
    const recordedBlob = new Blob(recordedChunks, { type: 'video/mp4' });
    downloadRecordedVideo(recordedBlob);

    recordedChunks = [];
    mediaRecorder = null;

    setTimeout(() => {
      refreshButton.disabled = false;
    }, 5000);
    //setTimeout(() => {
    //  location.reload();
    //}, 5000);
  });
  mediaRecorder.start();
  startButton.disabled = true;
  stopButton.disabled = false;
});

stopButton.addEventListener('click', () => {
  document.title = "JK ScreenRecorder";
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());

    startButton.disabled = false;
    stopButton.disabled = true;

    setTimeout(() => {
        refreshButton.disabled = false;
    }, 5000);
  }
});

refreshButton.addEventListener('click', () => {
  location.reload();
});

function downloadRecordedVideo(recordedBlob) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const timestamp = `${hours}-${minutes}-${seconds}_${date}-${month}-${year}`;
  const fileName = `recorded-video_${timestamp}.mp4`;

  const url = URL.createObjectURL(recordedBlob);
  downloadLink.href = url;
  downloadLink.download = fileName;
  downloadLink.style.display = "block";
}

