//TODO: activate an import functionality in this file so you can get resources,updateHtmlLangAttribute and you also dont have to initialise here. This seems to be a webpack config issue, example below:
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
    
    // i18next Translation 
  //   const resources = {
  //     fr: {
  //         translation: require("../../public/i18n/fr.json")
  //       },
  //     en: {
  //       translation: require("../../public/i18n/en.json")
  //     },
  //     de: {
  //       translation: require("../../public/i18n/de.json")
  //     },
  //     it: {
  //       translation: require("../../public/i18n/it.json")
  //     },
  //     sl: {
  //       translation: require("../../public/i18n/sl.json")
  //     }
  // };
        // Define the i18n object globally
        var i18nPublic = {
          // Resources object with your translation data
          resources: {
            en: {
              translation: {
                "index.zuugle_description": "Zuugle shows you verified connections by train and bus to mountain tours, hikes, ski tours, snowshoe hikes, etc. which you can reach from your residence.",
                "index.noscript": "It seems that you do not have Javascript enabled. However, this search engine for public transport mountain tours requires Javascript to work. Please enable Javascript in your browser.",
                "start.helmet_title": "Zuugle - the search engine for public transport mountain tours"
              }
            },
            de: {
              translation: {
                "index.zuugle_description": "Zuugle zeigt dir geprüfte Verbindungen mit Bahn und Bus zu Bergtouren, Wanderungen, Skitouren, Schneeschuhwanderungen, etc. von deinem Wohnort aus an.",
                "index.noscript": "Es scheint, dass du Javascript nicht aktiviert hast. Diese Suchmaschine für Öffi-Bergtouren benötigt aber Javascript um zu funktionieren. Bitte aktiviere Javacript in deinem Browser.",
                "start.helmet_title": "Zuugle - die Suchmaschine für Öffi-Bergtouren"
              }
            },
            sl: {
              translation: {
                "index.zuugle_description": "Zuugle vam pokaže preverjene železniške in avtobusne povezave do gorskih tur, pohodov, smučarskih tur, pohodov s krpljami itd. iz vašega kraja bivanja.",
                "index.noscript": "Zdi se, da nimate omogočenega Javascripta. Vendar ta iskalnik za gorske izlete z javnim prevozom zahteva Javascript za delovanje. V brskalniku omogočite Javascript.",
                "start.helmet_title": "Zuugle - iskalnik za gorske ture z javnim prevozom"
              }
            },
            fr: {
              translation: {
                "index.zuugle_description": "Zuugle t'indique les correspondances vérifiées en train et en bus pour les excursions en montagne, les randonnées à pied ou à ski, les randonnées en raquettes, etc. au départ de ton domicile.",
                "index.noscript": "Il semble que tu n'aies pas activé Javascript. Or, ce moteur de recherche pour les excursions en montagne de Öffi a besoin de Javascript pour fonctionner. Veuillez activer Javacript dans votre navigateur.",
                "start.helmet_title": "Zuugle - le moteur de recherche pour les excursions en montagne en transports publics"
              }
            },
            it: {
              translation: {
                "index.zuugle_description": "Zuugle vi mostra collegamenti verificati in treno e autobus per tour in montagna, escursioni, tour con gli sci, escursioni con le racchette da neve, ecc. dal vostro luogo di residenza.",
                "index.noscript": "Sembra che non abbiate abilitato Javascript. Tuttavia, questo motore di ricerca per i trasporti pubblici in montagna richiede Javascript per funzionare. Si prega di abilitare Javascript nel browser.",
                "start.helmet_title": "Zuugle - il motore di ricerca per i trasporti pubblici in montagna"
              }
            }
        },
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
              console.log('initialised #1: storedLanguage :', storedLanguage);
            }else if(resolvedLanguage){
              translateIndexPage(resolvedLanguage);
              console.log('initialised #2: resolvedLanguage:', resolvedLanguage);
            }else{
              console.log('initialised #3');
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
        console.log("updatedLanguage: 162 : " + updatedLanguage);
        updatedLanguage && updateHtmlLangAttribute(updatedLanguage)
        updatedLanguage && translateElements(updatedLanguage);
      });
    