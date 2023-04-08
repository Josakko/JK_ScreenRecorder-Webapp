const about = document.getElementById("aboutModal");
const link = document.getElementById("aboutLink");
const span = document.getElementsByClassName("close")[0];

link.onclick = function() {
  about.style.display = "block";
  //about.scrollIntoView({ behavior: "smooth", block: "center" });
}

span.onclick = function() {
  about.style.display = "none";
}

//window.onclick = function(event) {
//  if (event.target == about) {
//    about.style.display = "none";
//  }
//}
