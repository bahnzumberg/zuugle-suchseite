#!/usr/bin/node
import {
    getProvider,
    writeKPIs,
    fixTours,
    syncCities,
    syncTours,
} from "./sync";
import moment from "moment";
import cacheService from "../services/cache.js";

console.log("DEVELOPMENT MODE: ", moment().format("YYYY-MM-DD HH:mm:ss"));
console.log("START SYNC TOURS: ", moment().format("YYYY-MM-DD HH:mm:ss"));
syncTours().then(() => {
    console.log("DONE SYNC TOURS 1: ", moment().format("YYYY-MM-DD HH:mm:ss"));
    console.log(
        "START SYNC CITIES 1: ",
        moment().format("YYYY-MM-DD HH:mm:ss"),
    );
    syncCities().then(() => {
        console.log(
            "DONE SYNC CITIES: ",
            moment().format("YYYY-MM-DD HH:mm:ss"),
        );
        console.log(
            "START FIX TOURS: ",
            moment().format("YYYY-MM-DD HH:mm:ss"),
        );
        fixTours().then(() => {
            console.log(
                "DONE FIX TOURS: ",
                moment().format("YYYY-MM-DD HH:mm:ss"),
            );
            console.log(
                "START WRITE KPIs: ",
                moment().format("YYYY-MM-DD HH:mm:ss"),
            );
            writeKPIs().then(() => {
                console.log(
                    "DONE WRITING KPIs: ",
                    moment().format("YYYY-MM-DD HH:mm:ss"),
                );
                console.log(
                    "START FETCH PROVIDER: ",
                    moment().format("YYYY-MM-DD HH:mm:ss"),
                );
                getProvider().then(async () => {
                    console.log(
                        "FETCHED PROVIDER: ",
                        moment().format("YYYY-MM-DD HH:mm:ss"),
                    );
                    console.log("FLUSHING CACHE...");
                    await cacheService.flush();
                    console.log("CACHE FLUSHED.");
                    process.exit();
                });
            });
        });
    });
});
