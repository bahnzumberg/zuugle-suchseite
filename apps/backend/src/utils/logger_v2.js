import * as fs from 'fs';
import path from 'path';

export default function (text) {
    const proddevPath = process.env.NODE_ENV !== 'production' ? '../../' : '../';
    const filePath = path.join(__dirname, proddevPath, 'logs/api.log');

    // Ensure the directory exists
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    fs.appendFileSync(filePath, text + '\n');
}

// call this function whenever the server starts// for now test it on tours.js
export function create_api_log() {
    const proddevPath = process.env.NODE_ENV !== 'production' ? '../../' : '../';
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
