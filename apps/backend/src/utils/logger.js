import * as fs from "fs";

export default function(text) {
    let proddevPath = "../";
    if(process.env.NODE_ENV != "production"){
        proddevPath = "../../";
    }
    if (!fs.existsSync(path.join(__dirname, proddevPath, "logs"))){
        fs.mkdirSync(path.join(__dirname, proddevPath, "logs"));
    }
    const filePath = path.join(__dirname, proddevPath, "logs/api.log");

    fs.appendFileSync(filePath, text + "\n", function (err) {
        if (err) throw err;
    });
};