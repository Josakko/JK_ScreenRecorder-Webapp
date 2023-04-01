var modal = document.getElementById("aboutModal");
var link = document.getElementById("aboutLink");
var span = document.getElementsByClassName("close")[0];

link.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
