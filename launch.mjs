#!/usr/bin/env node

/**
 * Run `felaunch` or `npm run dev` to launch Ferrum Explorer
 * (`felaunch` === `npm run dev`)
 */

import path from "path";
import { execSync } from "child_process";
import concurrently from "concurrently";

console.log("Launching...");

const nmGlobalPath = execSync("npm root -g").toString().replaceAll("\n", "");
const ferrumRoot = path.join(nmGlobalPath, "ferrum");

import("file://"+ path.join(ferrumRoot, "./src/server/InitConfig.js"));

concurrently([
    "cd "+ ferrumRoot +" & npm run server",
    "cd "+ ferrumRoot +" & npm run client"
]);
