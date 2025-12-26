#!/usr/bin/node
import {
    getProvider,
    writeKPIs,
    fixTours,
    syncCities,
    syncTours,
    populateCity2TourFlat,
} from "./sync";
import moment from "moment";
import cacheService from "../services/cache.js";

console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " FULL LOAD");
console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " START SYNC TOURS");
syncTours().then(() => {
    console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " DONE SYNC TOURS");
    console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " START SYNC CITIES");
    syncCities().then(() => {
        console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " DONE SYNC CITIES");
        console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " START FIX TOURS");
        fixTours().then(() => {
            console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " DONE FIX TOURS");
            console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " START POPULATE city2tour_flat");
            populateCity2TourFlat().then(() => {
                console.log(
                    moment().format("YYYY.MM.DD HH:mm:ss"),
                    " DONE POPULATE city2tour_flat",
                );
                console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " START WRITE KPIs");
                writeKPIs().then(() => {
                    console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " DONE WRITING KPIs");
                    console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " START FETCH PROVIDER");
                    getProvider().then(async () => {
                        console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " FETCHED PROVIDER");

                        // Log cache statistics before flushing
                        const stats = await cacheService.getStats();
                        if (stats) {
                            const total = stats.hits + stats.misses;
                            const hitRate = total > 0 ? ((stats.hits / total) * 100).toFixed(1) : 0;
                            console.log(
                                moment().format("YYYY.MM.DD HH:mm:ss"),
                                ` CACHE STATS (previous day): hits=${stats.hits}, misses=${stats.misses}, hit_rate=${hitRate}%`,
                            );
                        } else {
                            console.log(
                                moment().format("YYYY.MM.DD HH:mm:ss"),
                                " CACHE STATS: unavailable",
                            );
                        }

                        console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " FLUSHING CACHE...");
                        await cacheService.flush();
                        console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " CACHE FLUSHED.");
                        process.exit();
                    });
                });
            });
        });
    });
});
