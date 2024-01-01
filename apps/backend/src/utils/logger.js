import * as fs from "fs";
const path = require('path');

export default function(text) {
    let proddevPath = "../";
    if(process.env.NODE_ENV != "production"){
        proddevPath = "../../";
    }
    const filePath = path.join(__dirname, proddevPath, "logs/api.log");

    fs.appendFileSync(filePath, text + "\n", function (err) {
        if (err) throw err;
    });
};

export function create_api_log() {
    let proddevPath = "../";
    if(process.env.NODE_ENV != "production"){
        proddevPath = "../../";
    }
    if (!fs.existsSync(path.join(__dirname, proddevPath, "logs"))){
        fs.mkdirSync(path.join(__dirname, proddevPath, "logs"));
        fs.createWriteStream(path.join(__dirname, proddevPath, "logs/api.log"));
    }
}