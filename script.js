const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const downloadLink = document.getElementById('downloadLink');
const refreshButton = document.getElementById('refreshButton');
const pauseButton = document.getElementById('pauseButton');
const status = document.getElementById('status');
const videoContainer = videoPreview.parentNode;
const duration = document.getElementById('duration');
const video = document.getElementById('video');
const frameRate = document.querySelector('#frameRate');
const resolution = document.querySelector('#resolution');
const settingsButton = document.getElementById('settingsButton');


const sysCheckbox = document.getElementById('sys');
let sys = true;
sysCheckbox.addEventListener('click', () => {
  sys = sysCheckbox.checked;
});

//  const micCheckbox = document.getElementById('mic');
//  let mic = false;
//  micCheckbox.addEventListener('click', () => {
//    mic = micCheckbox.checked;
//  });

let mediaRecorder;
let recordedChunks = [];

startButton.addEventListener('click', async () => {
  try {
    mediaRecorder = new MediaRecorder(await navigator.mediaDevices.getDisplayMedia(MediaConstraints()));
  } catch (e) {
    if (e.message.includes("audio source")) {
      console.log("Please allow usage of microphone in order to record microphone audio");
    } else {
      console.log("Please select one of screens and then click 'Share' in order to record");
    }
    return;
  }

  //if (mic === true) {
  //  voice = new MediaRecorder(await navigator.mediaDevices.getUserMedia({ video: false, audio: mic }));
  //}

  document.title = "Recording - JK ScreenRecorder";
  status.style.color = "#3eb337";
  status.textContent = "Recording";
  //duration.style.color = "#3eb337";
  //startDuration();
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
    const recordedBlob = new Blob(recordedChunks, { type: 'video/mp4; codecs = H264' }); //type: 'video/mp4'

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
      //duration.style.color = "#e63939";
    } else if (RecordingPaused) {
      mediaRecorder.resume();
      document.title = "Recording - JK ScreenRecorder";
      status.style.color = "#3eb337";
      status.textContent = "Recording";
      //duration.style.color = "#3eb337";
    }
  });
});

stopButton.addEventListener('click', () => {
  document.title = "JK ScreenRecorder";
  status.textContent = "";
  //stopDuration();
  //duration.textContent = "";
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());

    startButton.disabled = false;
    settingsButton.disabled = false;
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

function MediaConstraints() {
  var Constraints = {}
  Constraints.audio = sys; //sys;
  Constraints.video = { mediaSource: "screen" };
  Constraints.video.frameRate = frameRate;
  
  switch (resolution.value) {
      case 'Fit-Screen':
          Constraints.video.width = screen.width;
          Constraints.video.height = screen.height;
          break;
      case '4K':
          Constraints.video.width = 3840;
          Constraints.video.height = 2160;
          break;
      case '1080p':
          Constraints.video.width = 1920;
          Constraints.video.height = 1080;
          break;
      case '720p':
          Constraints.video.width = 1280;
          Constraints.video.height = 720;
          break;
      case '480p':
          Constraints.video.width = 854;
          Constraints.video.height = 480;
          break;
      case '360p':
          Constraints.video.width = 640;
          Constraints.video.height = 360;
          break;
  }
  return Constraints;
}

let recorded = false;

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
  const fileName = `recorded-video_${timestamp}.mp4`;

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
