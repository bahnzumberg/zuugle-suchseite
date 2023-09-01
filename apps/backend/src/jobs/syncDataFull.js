#!/usr/bin/node
import {
    getProvider,
    writeKPIs,
    fixTours,
    mergeToursWithFahrplan,
    syncCities,
    syncFahrplan,
    syncGPXdata,
    syncTours,
    generateTestdata
} from "./sync";
import moment from "moment";

syncTours();

/*
console.log('FULL LOAD: ', moment().format('HH:mm:ss'));
console.log('START SYNC TOURS: ', moment().format('HH:mm:ss'));
syncTours().then(res => {
    console.log('DONE SYNC TOURS: ', moment().format('HH:mm:ss'));
    console.log('START SYNC FAHRPLAN: ', moment().format('HH:mm:ss'));
    syncFahrplan('full').then(res => {
        console.log('DONE SYNC FAHRPLAN: ', moment().format('HH:mm:ss'));
        console.log('START SYNC CITIES: ', moment().format('HH:mm:ss'));
        syncCities().then(res => {
            console.log('DONE SYNC CITIES: ', moment().format('HH:mm:ss'));
            console.log('START MERGE FAHRPLAN: ', moment().format('HH:mm:ss'));
            mergeToursWithFahrplan().then(res => {
                console.log('DONE MERGE FAHRPLAN: ', moment().format('HH:mm:ss'));
                console.log('START FIX TOURS: ', moment().format('HH:mm:ss'));
                fixTours().then(res => {
                    console.log('DONE FIX TOURS: ', moment().format('HH:mm:ss'));
                    console.log('START WRITE KPIs: ', moment().format('HH:mm:ss'));
                    writeKPIs().then(res => {
                        console.log('DONE WRITING KPIs: ', moment().format('HH:mm:ss'));
                        console.log('START FETCH PROVIDER: ', moment().format('HH:mm:ss'));
                        getProvider().then(res => {
                            console.log('FETCHED PROVIDER: ', moment().format('HH:mm:ss'));
                            console.log('START FETCH GPX DATA: ', moment().format('HH:mm:ss'));
                            syncGPXdata().then(res => {
                                console.log('FETCHED GPX DATA: ', moment().format('HH:mm:ss'));
                            
                                if(process.env.NODE_ENV !== "production"){
                                    console.log('GENERATE TEST DATA: ', moment().format('HH:mm:ss'));
                                    generateTestdata().then(res => {
                                        console.log('DONE GENERATING TEST DATA: ', moment().format('HH:mm:ss'));
                                        process.exit();    
                                    })
                                }
                                else {
                                        process.exit();
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});
*/