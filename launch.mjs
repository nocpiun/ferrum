#!/usr/bin/env node

/**
 * Run `felaunch` or `npm run dev` to launch Ferrum Explorer
 * (`felaunch` === `npm run dev`)
 */

import concurrently from "concurrently";

console.log("Launching...");

import("./src/server/InitConfig.js");

concurrently([
    "npm run server",
    "npm run client"
]);
