// Function to update the lang attribute of the html tag
function updateHtmlLangAttribute(language) {
  var htmlTag = document.getElementById("html-tag");
  htmlTag.setAttribute("lang", language);
  console.log("inside updateHtmlLangAttribute :", language);
}
