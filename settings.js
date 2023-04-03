var settings = document.getElementById("settings");
var buttonSettings = document.getElementById("settingsButton");
var spanSettings = document.getElementsByClassName("settings-close")[0];

buttonSettings.onclick = function() {
  settings.style.display = "block";
  //settings.scrollIntoView({ behavior: "smooth", block: "center" });
}

spanSettings.onclick = function() {
  settings.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == settings) {
    settings.style.display = "none";
  }
}
