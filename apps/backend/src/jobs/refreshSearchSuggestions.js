// One-shot script: refreshes the search_suggestions table.
// Called after deploy on UAT/prod to ensure autocomplete data is up to date.
import { refreshSearchSuggestions } from "./sync.js";

refreshSearchSuggestions()
    .then(() => {
        console.log("search_suggestions refreshed successfully.");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Error refreshing search_suggestions:", err);
        process.exit(1);
    });
