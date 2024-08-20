#!/usr/bin/node
import {
    getProvider,
    writeKPIs,
    fixTours,
    syncCities,
    syncFahrplan,
    syncGPXdata,
    syncTours
} from "./sync";
import moment from "moment";

console.log('DEVELOPMENT MODE: ', moment().format('HH:mm:ss'));
console.log('START SYNC TOURS: ', moment().format('HH:mm:ss'));
syncTours().then(res => {
    console.log('DONE SYNC TOURS 1: ', moment().format('HH:mm:ss'));
    console.log('START SYNC FAHRPLAN 1: ', moment().format('HH:mm:ss'));
    syncFahrplan('dev').then(res1 => {
        console.log('DONE SYNC FAHRPLAN 1: ', moment().format('HH:mm:ss'));
        console.log('START SYNC CITIES 1: ', moment().format('HH:mm:ss'));
        syncCities().then(res2 => {
        console.log('DONE SYNC CITIES: ', moment().format('HH:mm:ss'));
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
                        syncGPXdata('dev').then(res7 => {
                            console.log('FETCHED GPX DATA: ', moment().format('HH:mm:ss'));
                            process.exit();
                        });
                    });
                });
            });
        });
    });
});