const settings = document.getElementById("settings");
const buttonSettings = document.getElementById("settingsButton");
const spanSettings = document.getElementsByClassName("settings-close")[0];

buttonSettings.onclick = function() {
  settings.style.display = "block";
  //settings.scrollIntoView({ behavior: "smooth", block: "center" });
}

spanSettings.onclick = function() {
  settings.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == settings || event.target == about) {
    settings.style.display = "none";
    about.style.display = "none";
  }
}
