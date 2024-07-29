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
import knexTourenDb from "../knexTourenDb";
import knex from "../knex";

console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' FULL LOAD');

let breakTheLoop = false;

while (!breakTheLoop) {
    console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' START SYNC TOURS');
    syncTours().then(res => {
        console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' DONE SYNC TOURS');
        console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' START SYNC FAHRPLAN');
        syncFahrplan('prod').then(res1 => {
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
                                syncGPXdata('prod').then(res7 => {
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

    // One load finished. Is everything ok? Then let's break the loop. Otherwise: Let's try again.
    breakTheLoop = true;

    // 1. Check: 
    const countTourCrunchy = await knexTourenDb('vw_touren_to_search').count('* as anzahl');
    const countTourZuugle = await knex('tour').count('* as anzahl');
    if (countTourCrunchy != countTourZuugle) {
        // The table tour is always truncated. So we do not have to change anything here.
        console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' CHECK table tour NOK. Starting an new loop');
        breakTheLoop = false;
    }
    else {
        console.log(moment().format('YYYY.MM.DD HH:mm:ss'), ' CHECK table tour OK');
    }
    
    // A GitHub ticket would be nice to inform about the problem - yet to be done

}