import * as fs from 'fs';
import path from 'path';

// TESTING DETACHED HEAD STATE 
export default function (text) {
    const onoffswitch = 'on';

    if(onoffswitch == 'on') {
        const proddevPath = process.env.NODE_ENV !== 'production' ? '../../' : '../../';
        const filePath = path.join(__dirname, proddevPath, 'logs/api.log');

        // Ensure the directory exists
        if (!fs.existsSync(path.dirname(filePath))) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }

        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let log_date_time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + " ";

        console.log(log_date_time)
        // add log entry
        fs.appendFileSync(filePath, log_date_time + text + '\n'); 
    }
}

// call this function whenever the server starts// for now test it on tours.js
export function create_api_log() {
    // const proddevPath = process.env.NODE_ENV !== 'production' ? '../../' : '../';
    const proddevPath = process.env.NODE_ENV !== 'production' ? '../../' : '../../';
    const filePath = path.join(__dirname, proddevPath, 'logs/api.log');

    // Make sure directory exists
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    // Create file when not existent yet
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
    }
}
