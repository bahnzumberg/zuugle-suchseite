#!/usr/bin/node
import {
    writeKPIs,
    truncateAll,
    restoreDump,
    copyDump
} from "./sync.js";
import cacheService from "../services/cache.js";

console.log('Copy dump to container');
copyDump("zuugle_postgresql.dump", "/tmp/zuugle_postgresql.dump").then(_ => {
    console.log('Truncate tables');
    truncateAll().then(_ => {
        console.log('Restore from database dump (this will take a while)');
        restoreDump().then(_ => {
            console.log('Write KPIs');
            writeKPIs().then(async _ => {
                console.log('Flushing cache...');
                await cacheService.flush();
                console.log('Cache flushed. Database ready!');
                process.exit();
            })
        });
    });
}).catch(err => {
    console.error("Error during sync:", err);
    process.exit(1);
});