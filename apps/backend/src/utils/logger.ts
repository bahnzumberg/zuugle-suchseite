import * as fs from "fs";
import path from "path";

// TESTING DETACHED HEAD STATE
export default function (text: string) {
    const onoffswitch = "on"; // values: on / off

    if (onoffswitch == "on" || process.env.NODE_ENV !== "production") {
        // Either onoffswitch is set to 'on' or we are not on prod or uat

        const proddevPath = process.env.NODE_ENV !== "production" ? "../../" : "../../";
        const filePath = path.join(__dirname, proddevPath, "logs/api.log");

        // Ensure the directory exists
        if (!fs.existsSync(path.dirname(filePath))) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }

        // Create file when not existent yet
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, "");
        }

        const date_ob = new Date();
        const day = ("0" + date_ob.getDate()).slice(-2);
        const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        const year = date_ob.getFullYear();
        const hours = date_ob.getHours();
        const minutes = date_ob.getMinutes();
        const seconds = date_ob.getSeconds();
        const log_date_time =
            year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + " ";

        // add log entry
        fs.appendFileSync(filePath, log_date_time + text + "\n");
    }
}
