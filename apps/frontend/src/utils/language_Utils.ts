import i18n from "i18next";

export const tourTypes = [
  "wandern",
  "schneeschuh",
  "skitour",
  "langlaufen",
  "bike_hike",
  "klettern",
  "klettersteig",
  "rodeln",
  "weitwandern",
];

export function langChange(language: string) {
  i18n.changeLanguage(language, function () {
    // Trigger the custom event to notify index.html about the language change
    const event = new CustomEvent("languageChanged", {
      detail: { language: language },
    });
    document.dispatchEvent(event);
  });
}
