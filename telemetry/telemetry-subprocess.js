/**
 * ===[ INFO ]==================================================================
 * @file ./telemetry/telemetry-subprocess.js
 * @brief Request handler for Discord webhooks
 * @created 20-08-2022@16:59:33.015
 * @author isja_krass
 * @version 0.0.1
 * 
 * IMPORTANT NOTE:
 * 
 * =============================================================================
 */

// INCLUDE node-modules
const IPC = require("process");
const UDP = require("dgram");

// --==[ MAIN SUBPROCESS ENTRY POINT ]==-- //
IPC.on("message", (msg) => {
    switch (msg.cmd) {



    };
});