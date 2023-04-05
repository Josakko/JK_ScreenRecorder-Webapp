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
const frameRate = document.querySelector('#frameRate');
const resolution = document.querySelector('#resolution');
const settingsButton = document.getElementById('settingsButton');


const sysCheckbox = document.getElementById('sys');
let sys = true;
sysCheckbox.addEventListener('click', () => {
  sys = sysCheckbox.checked;
});

//const micCheckbox = document.getElementById('mic');
//let mic = false;
//micCheckbox.addEventListener('click', () => {
//  mic = micCheckbox.checked;
//});

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
      stopTimer();
      timer.style.color = "#e63939";
      dash.style.color = "#e63939";
      status.style.color = "#e63939";
      status.textContent = "Paused";
      dash.textContent = "-";
      document.title = "Paused - JK ScreenRecorder";
    } else if (RecordingPaused) {
      mediaRecorder.resume();
      startTimer();
      timer.style.color = "#3eb337";
      dash.style.color = "#3eb447";
      status.style.color = "#3eb337";
      status.textContent = "Recording";
      dash.textContent = "-";
      document.title = "Recording - JK ScreenRecorder";
    }
  });
});

stopButton.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    stopTimer();
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

var hr = 0;
var min = 0;
var sec = 0;
var stoptime = true;

function startTimer() {
  if (stoptime == true) {
		stoptime = false;
		timerCycle();
	}
}
function stopTimer() {
  if (stoptime == false) {
    stoptime = true;
  }
}

function timerCycle() {
	if (stoptime == false) {
    sec = parseInt(sec);
    min = parseInt(min);
    hr = parseInt(hr);

    sec = sec + 1;

    if (sec == 60) {
      min = min + 1;
      sec = 0;
    }
    if (min == 60) {
      hr = hr + 1;
      min = 0;
      sec = 0;
    }

    if (sec < 10 || sec == 0) {
      sec = '0' + sec;
    }
    if (min < 10 || min == 0) {
      min = '0' + min;
    }
    if (hr < 10 || hr == 0) {
      hr = '0' + hr;
    }

    timer.textContent = hr + ':' + min + ':' + sec;

		setTimeout("timerCycle()", 1000);
  }
}

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
