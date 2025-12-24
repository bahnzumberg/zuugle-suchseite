#!/usr/bin/node
import { createWriteStream } from "fs";
import { get } from "https";
import { spawn } from "child_process";

const DUMP_URL = "https://uat-dump.zuugle.at/zuugle_postgresql.dump";
const DUMP_FILE = "zuugle_postgresql.dump";

console.log(`Downloading ${DUMP_URL}...`);

const file = createWriteStream(DUMP_FILE);

get(DUMP_URL, (response) => {
    if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        get(response.headers.location, (redirectResponse) => {
            redirectResponse.pipe(file);
            file.on("finish", () => {
                file.close();
                console.log(`Downloaded ${DUMP_FILE}`);
                runImport();
            });
        });
    } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on("finish", () => {
            file.close();
            console.log(`Downloaded ${DUMP_FILE}`);
            runImport();
        });
    } else {
        console.error(`Download failed with status: ${response.statusCode}`);
        process.exit(1);
    }
}).on("error", (err) => {
    console.error("Download error:", err.message);
    process.exit(1);
});

function runImport() {
    console.log("Starting database import...");
    const child = spawn("node", ["build/jobs/syncDataDocker.js"], {
        stdio: "inherit",
        cwd: process.cwd(),
    });

    child.on("close", (code) => {
        process.exit(code);
    });
}
