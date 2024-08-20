import {fixTours, syncCities, syncFahrplan, syncTours} from "./sync";
import moment from "moment";


export const syncDataApplicationSide = async () => {
    console.log('START SYNC TOURS: ', moment().format('HH:mm:ss'));
    await syncTours()
    console.log('DONE SYNC TOURS: ', moment().format('HH:mm:ss'));
    console.log('START SYNC FAHRPLAN: ', moment().format('HH:mm:ss'));
    await syncFahrplan('delta');  // @martinheppner : can be 'dev' or 'prod' inside syncFahrplan
    console.log('DONE SYNC FAHRPLAN: 2 ', moment().format('HH:mm:ss'));
    console.log('START SYNC CITIES: ', moment().format('HH:mm:ss'));
    await syncCities();
    console.log('DONE SYNC CITIES: ', moment().format('HH:mm:ss'));
    console.log('START FIX TOURS: ', moment().format('HH:mm:ss'));
    await fixTours();
    console.log('DONE FIX TOURS: ', moment().format('HH:mm:ss'));
    await writeKPIs();
    console.log('DONE CALCULATING KPIs: ', moment().format('HH:mm:ss'));
    await getProvider();
    console.log('DONE FETCHING PROVIDERS: ', moment().format('HH:mm:ss'));
    console.log('START FETCH GPX DATA: ', moment().format('HH:mm:ss'));
    await syncGPXdata_changed();
    console.log('FETCHED GPX DATA: ', moment().format('HH:mm:ss'));
}



