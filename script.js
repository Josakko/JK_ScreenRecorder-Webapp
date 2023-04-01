const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const downloadLink = document.getElementById('downloadLink');
const refreshButton = document.getElementById('refreshButton');
const pauseButton = document.getElementById('pauseButton');
const status = document.getElementById('status');
const videoContainer = videoPreview.parentNode;


let mediaRecorder;
let recordedChunks = [];

startButton.addEventListener('click', async () => {
  mediaRecorder = new MediaRecorder(await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }));

  document.title = "Recording - JK ScreenRecorder";
  status.style.color = "#3eb337";
  status.textContent = "Recording";
  refreshButton.disabled = true;

  const videoPreview = document.getElementById('videoPreview');

  videoPreview.srcObject = mediaRecorder.stream;
  videoPreview.play();

  mediaRecorder.addEventListener('dataavailable', e => {
    recordedChunks.push(e.data);
  });

  mediaRecorder.addEventListener('stop', () => {
    const recordedBlob = new Blob(recordedChunks, { type: 'video/mp4' });

    videoPreview.style.display = 'none';
    //document.body.removeChild(videoPreview);

    if (videoContainer.contains(videoPreview)) {
      videoContainer.removeChild(videoPreview);
    }

    downloadRecordedVideo(recordedBlob);

    recordedChunks = [];
    mediaRecorder = null;

    setTimeout(() => {
      refreshButton.disabled = false;
    }, 5000);
  });
  mediaRecorder.start();
  pauseButton.disabled = false;
  startButton.disabled = true;
  stopButton.disabled = false;

  let RecordingPaused = false;
  
  mediaRecorder.addEventListener('pause', () => {
    RecordingPaused = true;
    pauseButton.textContent = 'Resume Recording';
  });
  
  mediaRecorder.addEventListener('resume', () => {
    RecordingPaused = false;
    pauseButton.textContent = 'Pause Recording';
  });
  
  pauseButton.addEventListener('click', () => {
    if (mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      document.title = "Paused - JK ScreenRecorder";
      status.style.color = "#e63939";
      status.textContent = "Paused";
    } else if (RecordingPaused) {
      mediaRecorder.resume();
      document.title = "Recording - JK ScreenRecorder";
      status.style.color = "#3eb337";
      status.textContent = "Recording";
    }
  });
});


stopButton.addEventListener('click', () => {
  document.title = "JK ScreenRecorder";
  status.textContent = "";
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());

    startButton.disabled = false;
    stopButton.disabled = true;
    pauseButton.disabled = true;

    setTimeout(() => {
        refreshButton.disabled = false;
    }, 5000);

    //setTimeout(() => {
    //  location.reload();
    //}, 5000);
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

  const video = document.getElementById('video');

  video.src = url;
  video.controls = true;
  //video.classList.add('video-player');
  video.style.display = "flex";
  video.scrollIntoView({ behavior: "smooth", block: "start" });
  video.play();
}
