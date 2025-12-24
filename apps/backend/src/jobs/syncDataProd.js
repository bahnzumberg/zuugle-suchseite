#!/usr/bin/node
import { getProvider, writeKPIs, fixTours, syncCities, syncTours } from "./sync";
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
            console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " START WRITE KPIs");
            writeKPIs().then(() => {
                console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " DONE WRITING KPIs");
                console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " START FETCH PROVIDER");
                getProvider().then(async () => {
                    console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " FETCHED PROVIDER");
                    console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " FLUSHING CACHE...");
                    await cacheService.flush();
                    console.log(moment().format("YYYY.MM.DD HH:mm:ss"), " CACHE FLUSHED.");
                    process.exit();
                });
            });
        });
    });
});
