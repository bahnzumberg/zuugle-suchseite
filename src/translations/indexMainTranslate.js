//TODO: activate an import functionality in this file so you can get resources,
// updateHtmlLangAttribute and you also dont have to initialise here. This seems to be a 
// webpack config issue, example below:
// import translationsDE from "../../public/i18n/de"; //Uncaught SyntaxError: Cannot use import statement outside a module
// console.log("was_ist_zuugle :",translationsDE.about.was_ist_zuugle)

// Function to update the lang attribute of the html tag
function updateHtmlLangAttribute(language) {
  var htmlTag = document.getElementById("html-tag");
  htmlTag.setAttribute("lang", language);
  // console.log("inside updateHtmlLangAttribute :", language);
}


// Set the global variable for environment
var isDevelopment = false; // Set it to true if you are in development mode, false otherwise

// Define the i18n object globally
var i18nPublic = {
    // Configuration options
    fallbackLng: "de",
    supportedLngs: ['en', 'de', 'sl', 'fr', 'it'],
    nonExplicitSupportedLngs: true,
    debug: isDevelopment,
    interpolation: {
      spaceValue: false,
      formatSeperator: ","
    },
};
      

    
      // Initialize i18next for public/index.html 

      if (!window.i18next.isInitialized) {
        window.i18next.init(i18nPublic, 
          function (err) {
            if (err) {
              console.error('Error initializing i18next:', err);
              return;
            }

            var resolvedLanguage = i18next.language;
            const storedLanguage = localStorage.getItem('lang');


            if(storedLanguage) {
              translateIndexPage(storedLanguage);
              // console.log('initialised #1: storedLanguage :', storedLanguage);
            }else if(resolvedLanguage){
              translateIndexPage(resolvedLanguage);
              // console.log('initialised #2: resolvedLanguage:', resolvedLanguage);
            }else{
              // console.log('initialised #3');
              translateIndexPage('de');
            }
          }
          );
        }

        function translateIndexPage(lng){
          updateHtmlLangAttribute(lng);
          translateElements(lng);
        };

      function translateElements(lng) {

          i18next.changeLanguage(lng, function (err, t) {
            if (err) return console.error("Error changing language:", err);
            // console.log("translateElements - lng changed: " + lng);
            var elements = document.querySelectorAll("[data-i18n]");
  
            Array.prototype.forEach.call(elements, function (el) {
              var key = el.getAttribute("data-i18n");
              
              switch (key) {
                case "index.zuugle_description":
                case "start.helmet_title":
                  el.content = t(key);
                  // console.log(" key : " + key);
                  // console.log("element:", el.content);
                  break;
                case "index.noscript":
                  el.innerHTML = t(key);
                  // console.log(" key : " + key);
                  // console.log("element:", el.innerHTML);
                  break;
                default:
                  // Handle other cases if needed
                  break;
              }
            });
          });
        // }
        return;
      }


      // Event listener to update translations
      document.addEventListener("languageChanged", function (event) {
        var updatedLanguage = event.detail.language; // the passed new language selected from dropdown
        // console.log("updatedLanguage: 162 : " + updatedLanguage);
        updatedLanguage && updateHtmlLangAttribute(updatedLanguage)
        updatedLanguage && translateElements(updatedLanguage);
      });
    