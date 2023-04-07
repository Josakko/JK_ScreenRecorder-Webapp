"use strict";

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const downloadLink = document.getElementById('downloadLink');
const refreshButton = document.getElementById('refreshButton');
const pauseButton = document.getElementById('pauseButton');
const status = document.getElementById('status');
const dash = document.getElementById('dash');
const timer = document.getElementById('timer');
const videoContainer = videoPreview.parentNode;
const video = document.getElementById('video');
const settingsButton = document.getElementById('settingsButton');


let mediaRecorder;
let recordedChunks = [];
let RecordingPaused = false;

startButton.addEventListener('click', async () => {
  try {
    mediaRecorder = new MediaRecorder(await navigator.mediaDevices.getDisplayMedia(MediaConstraints()));
  } catch (e) {
    if (e.message.includes("audio source")) {
      console.log("Please allow usage of microphone in order to record microphone audio or disable microphone in settings.");
    } else {
      console.log("Please select one of screens and then click 'Share' in order to record.");
    }
    return;
  }
  
  timeLimitMins = timeLimit.value * 60;
  TimeLimit()

  //if (mic === true) {
  //  voice = new MediaRecorder(await navigator.mediaDevices.getUserMedia({ video: false, audio: mic }));
  //}

  timer.textContent = "";
  startTimer()
  timer.style.color = "#3eb337";
  status.style.color = "#3eb337";
  dash.style.color = "#3eb337";
  status.textContent = "Recording";
  dash.textContent = "-";
  document.title = "Recording - JK ScreenRecorder";
  refreshButton.disabled = true;
  settingsButton.disabled = true;

  const videoPreview = document.getElementById('videoPreview');

  //videoPreview.width = Math.ceil(screen.width / 3);
  //videoPreview.height = Math.ceil(screen.height / 3);

  videoPreview.srcObject = mediaRecorder.stream;
  videoPreview.play();

  mediaRecorder.addEventListener('dataavailable', e => {
    recordedChunks.push(e.data);
  });

  mediaRecorder.addEventListener('stop', () => {
    const recordedBlob = new Blob(recordedChunks, videoConstraints());  //const recordedBlob = new Blob(recordedChunks, { type: `video/mp4; codecs = H264` }); 

    videoPreview.style.display = 'none';
    //document.body.removeChild(videoPreview);

    if (videoContainer.contains(videoPreview)) {
      videoContainer.removeChild(videoPreview);
    }

    downloadRecordedVideo(recordedBlob);

    recordedChunks = [];
    mediaRecorder = null;
  });

  mediaRecorder.start();
  pauseButton.disabled = false;
  startButton.disabled = true;
  stopButton.disabled = false;

  mediaRecorder.addEventListener('pause', () => {
    RecordingPaused = true;
    pauseButton.textContent = 'Resume Recording';
  });
  
  mediaRecorder.addEventListener('resume', () => {
    RecordingPaused = false;
    pauseButton.textContent = 'Pause Recording';
  });
});


pauseButton.addEventListener('click', () => {
  if (mediaRecorder.state === 'recording') {
    mediaRecorder.pause();
    StopTimeLimit();
    stopTimer();
    timer.style.color = "#e63939";
    dash.style.color = "#e63939";
    status.style.color = "#e63939";
    status.textContent = "Paused";
    dash.textContent = "-";
    document.title = "Paused - JK ScreenRecorder";
  } else if (RecordingPaused) {
    mediaRecorder.resume();
    StartTimeLimit();
    startTimer();
    timer.style.color = "#3eb337";
    dash.style.color = "#3eb447";
    status.style.color = "#3eb337";
    status.textContent = "Recording";
    dash.textContent = "-";
    document.title = "Recording - JK ScreenRecorder";
  }
});


stopButton.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    stopTimer();
    StopTimeLimit();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    status.style.color = "#e2cb45";
    dash.style.color = "#e2cb45";
    timer.style.color = "#e2cb45";
    document.title = "JK ScreenRecorder";

    startButton.disabled = false;
    settingsButton.disabled = false;
    stopButton.disabled = true;
    pauseButton.disabled = true;

    setTimeout(() => {
        refreshButton.disabled = false;
        status.textContent = "";
        timer.textContent = "";
        dash.textContent = "";
    }, 5000);

    //setTimeout(() => {
    //  location.reload();
    //}, 10000);
  }
});


refreshButton.addEventListener('click', () => {
  if (recorded) {
    if (confirm("Are you sure you want to lose the video by refreshing the page?")) {
      location.reload();
    }
  } else {
    location.reload();
  }
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
  const fileName = `recorded-video_${timestamp}.${format.value}`;

  const url = URL.createObjectURL(recordedBlob);
  downloadLink.href = url;
  downloadLink.download = fileName;
  downloadLink.style.display = "block";

  video.src = url;
  video.controls = true;
  //video.classList.add('video-player');
  video.style.display = "flex";
  video.scrollIntoView({ behavior: "smooth", block: "center" });
  recorded = true;
  video.play();
}
