#!/usr/bin/node
import { syncConnectionGPX, syncGPX, syncGPXImage, copyRangeImage } from "./sync";
import moment from "moment";

console.log("START CREATE GPX FILES: ", moment().format("YYYY-MM-DD HH:mm:ss"));
syncGPX().then(() => {
    console.log("END CREATE GPX FILES: ", moment().format("YYYY-MM-DD HH:mm:ss"));
    console.log("START CREATE GPX ANREISE/ABREISE FILES: ", moment().format("YYYY-MM-DD HH:mm:ss"));
    syncConnectionGPX("dev").then(() => {
        console.log(
            "END CREATE GPX ANREISE/ABREISE FILES: ",
            moment().format("YYYY-MM-DD HH:mm:ss"),
        );
        console.log("START CREATE GPX IMAGE FILES: ", moment().format("YYYY-MM-DD HH:mm:ss"));
        syncGPXImage().then(() => {
            console.log("END CREATE GPX IMAGE FILES: ", moment().format("YYYY-MM-DD HH:mm:ss"));
            console.log(
                "START COPYING RANGE IMAGE FILES: ",
                moment().format("YYYY-MM-DD HH:mm:ss"),
            );
            copyRangeImage().then(() => {
                process.exit();
            });
        });
    });
});
