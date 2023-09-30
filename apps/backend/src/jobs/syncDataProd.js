#!/usr/bin/node
import {
    getProvider,
    writeKPIs,
    fixTours,
    mergeToursWithFahrplan,
    syncCities,
    syncFahrplan,
    syncGPXdata,
    syncTours
} from "./sync";
import moment from "moment";

console.log('FULL LOAD: ', moment().format('HH:mm:ss'));
console.log('START SYNC TOURS: ', moment().format('HH:mm:ss'));
syncTours().then(res => {
    console.log('DONE SYNC TOURS: ', moment().format('HH:mm:ss'));
    console.log('START SYNC FAHRPLAN: ', moment().format('HH:mm:ss'));
    syncFahrplan('prod').then(res1 => {
        console.log('DONE SYNC FAHRPLAN: ', moment().format('HH:mm:ss'));
        console.log('START SYNC CITIES: ', moment().format('HH:mm:ss'));
        syncCities().then(res2 => {
            console.log('DONE SYNC CITIES: ', moment().format('HH:mm:ss'));
            console.log('START MERGE FAHRPLAN: ', moment().format('HH:mm:ss'));
            mergeToursWithFahrplan().then(res3 => {
                console.log('DONE MERGE FAHRPLAN: ', moment().format('HH:mm:ss'));
                console.log('START FIX TOURS: ', moment().format('HH:mm:ss'));
                fixTours().then(res4 => {
                    console.log('DONE FIX TOURS: ', moment().format('HH:mm:ss'));
                    console.log('START WRITE KPIs: ', moment().format('HH:mm:ss'));
                    writeKPIs().then(res5 => {
                        console.log('DONE WRITING KPIs: ', moment().format('HH:mm:ss'));
                        console.log('START FETCH PROVIDER: ', moment().format('HH:mm:ss'));
                        getProvider().then(res6 => {
                            console.log('FETCHED PROVIDER: ', moment().format('HH:mm:ss'));
                            console.log('START FETCH GPX DATA: ', moment().format('HH:mm:ss'));
                            syncGPXdata('prod').then(res7 => {
                                console.log('FETCHED GPX DATA: ', moment().format('HH:mm:ss'));
                                process.exit();
                            });
                        });
                    });
                });
            });
        });
    });
});