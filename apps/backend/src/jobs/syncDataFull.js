#!/usr/bin/node
import {
    getProvider,
    writeKPIs,
    fixTours,
    mergeToursWithFahrplan,
    syncCities,
    syncFahrplan,
    syncGPXdata_changed,
    syncTours
} from "./sync";
import moment from "moment";

console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' FULL LOAD');
console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' START SYNC TOURS');
syncTours().then(res => {
    console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' DONE SYNC TOURS');
    console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' START SYNC FAHRPLAN');
    syncFahrplan('full').then(res1 => {
        console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' DONE SYNC FAHRPLAN');
        console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' START SYNC CITIES');
        syncCities().then(res2 => {
            console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' DONE SYNC CITIES');
            console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' START MERGE FAHRPLAN');
            mergeToursWithFahrplan().then(res3 => {
                console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' DONE MERGE FAHRPLAN');
                console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' START FIX TOURS');
                fixTours().then(res4 => {
                    console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' DONE FIX TOURS');
                    console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' START WRITE KPIs');
                    writeKPIs().then(res5 => {
                        console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' DONE WRITING KPIs');
                        console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' START FETCH PROVIDER');
                        getProvider().then(res6 => {
                            console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' FETCHED PROVIDER');
                            console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' START FETCH GPX DATA');
                            syncGPXdata_changed().then(res7 => {
                                console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' FETCHED GPX DATA');
                                process.exit();
                            });
                        });
                    });
                });
            });
        });
    });
});