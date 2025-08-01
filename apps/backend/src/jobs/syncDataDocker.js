#!/usr/bin/node
import {
    writeKPIs,
    truncateAll,
    restoreDump
} from "./sync.js";

console.log('Truncate tables');
truncateAll().then(_ => {
    console.log('Restore from database dump (this will take a while)');
    restoreDump().then(_ => {
        console.log('Write KPIs');
        writeKPIs().then(_ => {
            console.log('Database ready!');
            process.exit();
        })
    });
});