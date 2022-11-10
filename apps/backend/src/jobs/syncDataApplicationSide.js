import {fixTours, mergeToursWithFahrplan, mergeToursWithGPX, syncCities, syncFahrplan, syncTours} from "./sync";
import moment from "moment";


export const syncDataApplicationSide = async () => {
    console.log('START SYNC TOURS: ', moment().format('HH:mm:ss'));
    await syncTours()
    console.log('DONE SYNC TOURS: ', moment().format('HH:mm:ss'));
    console.log('START SYNC FAHRPLAN: ', moment().format('HH:mm:ss'));
    await syncFahrplan('delta');
    console.log('DONE SYNC FAHRPLAN: ', moment().format('HH:mm:ss'));
    console.log('START SYNC CITIES: ', moment().format('HH:mm:ss'));
    await syncCities();
    console.log('DONE SYNC CITIES: ', moment().format('HH:mm:ss'));
    console.log('START MERGE FAHRPLAN: ', moment().format('HH:mm:ss'));
    await mergeToursWithFahrplan();
    console.log('DONE MERGE FAHRPLAN: ', moment().format('HH:mm:ss'));
    console.log('START FIX TOURS: ', moment().format('HH:mm:ss'));
    await fixTours();
    console.log('DONE FIX TOURS: ', moment().format('HH:mm:ss'));
    await writeKPIs();
    console.log('DONE CALCULATING KPIs: ', moment().format('HH:mm:ss'));
    await getProvider();
    console.log('DONE FETCHING PROVIDERS: ', moment().format('HH:mm:ss'));
}



