import {
    syncConnectionGPX,
    syncGPX, syncGPXImage,
} from "./sync";
import moment from "moment";


export const syncFilesApplicationSide = async () => {
    console.log('START SYNC GPX: ', moment().format('YYYY-MM-DD HH:mm:ss'));
    await syncGPX()
    console.log('DONE SYNC GPX: ', moment().format('YYYY-MM-DD HH:mm:ss'));
    console.log('START SYNC CONNECTION GPX: ', moment().format('YYYY-MM-DD HH:mm:ss'));
    await syncConnectionGPX();
    console.log('DONE SYNC CONNECTION GPX: ', moment().format('YYYY-MM-DD HH:mm:ss'));
    console.log('START SYNC GPX IMAGE: ', moment().format('YYYY-MM-DD HH:mm:ss'));
    await syncGPXImage();
    console.log('DONE SYNC GPX IMAGE: ', moment().format('YYYY-MM-DD HH:mm:ss'));
}



