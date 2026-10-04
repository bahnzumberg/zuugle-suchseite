#!/usr/bin/node
// Dedicated weather overlay import.
//
// Run manually or via cron:  npm run import-weather
//
// Does a single check for newer weather data in overlay_weather_daily,
// generates overlays if new data is found, and exits.
import { syncWeatherOverlays } from "./generateWeatherOverlay";
import knex from "../knex";
import logger from "../utils/logger";

const args = process.argv.slice(2);
const allDates = args.includes("--all-dates");

syncWeatherOverlays({ allDates })
    .then((success) => {
        knex.destroy();
        process.exit(success ? 0 : 1);
    })
    .catch((err) => {
        logger.error("[WeatherOverlay] Fatal error:", err);
        knex.destroy();
        process.exit(1);
    });
