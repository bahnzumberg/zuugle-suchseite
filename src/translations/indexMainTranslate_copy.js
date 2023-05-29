// Slightly different approach to the original file
// Function to update the lang attribute of the html tag
function updateHtmlLangAttribute(language) {
  var htmlTag = document.getElementById("html-tag");
  htmlTag.setAttribute("lang", language);
  console.log("inside updateHtmlLangAttribute:", language);
}

async function translateElements(lng) {
  const module = await import('./i18n');
  const i18n = module.default;

  i18n.changeLanguage(lng, function (err, t) {
    if (err) return console.error('Error changing language:', err);
    console.log("translateElements - lng changed: " + lng);
    var elements = document.querySelectorAll('[data-i18n]');

    Array.prototype.forEach.call(elements, function (el) {
      var key = el.getAttribute('data-i18n');
      console.log("key: " + key);
      console.log("element:", el);

      switch (key) {
        case "index.zuugle_description":
        case "start.helmet_title":
          el.content = t(key);
          break;
        case "index.noscript":
          el.innerHTML = t(key);
          break;
        default:
          // Handle other cases if needed
          break;
      }
    });
  });
}

async function initializeTranslation() {
  var resolvedLanguage = await import('./i18n').then((module) => module.default.language);
  const storedLanguage = localStorage.getItem("lang");
  let currLanguage = storedLanguage || resolvedLanguage;
  updateHtmlLangAttribute(currLanguage);
  translateElements(currLanguage);
}

initializeTranslation();

// Event listener to update translations
document.addEventListener('languageChanged', function (event) {
  var updatedLanguage = event.detail.language; // the passed new language selected from dropdown
  console.log("updatedLanguage: " + updatedLanguage);
  updateHtmlLangAttribute(updatedLanguage);
  translateElements(updatedLanguage);
});
