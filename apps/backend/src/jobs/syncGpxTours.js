#!/usr/bin/node
import {
    mergeToursWithGPX
} from "./sync";
import moment from "moment";


console.log('START SYNC GPX TOUR DATA: ', moment().format('HH:mm:ss'));
mergeToursWithGPX().then(res => {
    console.log('DONE SYNC GPX TOUR DATA: ', moment().format('HH:mm:ss'));
    process.exit();
});