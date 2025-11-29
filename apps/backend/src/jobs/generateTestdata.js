#!/usr/bin/node
import { generateTestdata } from "./sync";
import moment from "moment";

console.log("GENERATE TEST DATA: ", moment().format("YYYY-MM-DD HH:mm:ss"));
generateTestdata().then(() => {
    console.log(
        "DONE GENERATING TEST DATA: ",
        moment().format("YYYY-MM-DD HH:mm:ss"),
    );
    process.exit();
});
