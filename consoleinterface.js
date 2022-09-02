/**
 * ===[ INFO ]==================================================================
 *  
 * 
 * 
 * =============================================================================
 */

// INCLUDE sub-modules
const colorizer = require("./src/colorizer");
const chrono = require("./src/chrono");
const fslogger = require("./src/fslogger");
const webhook = require("./src/webhook");

/// EXPORT MASTER MODULE ///
module.exports = class {

    /**
     * Creates a new consoleinterface instance from class.
     * Options are passed trougth the constructor, but also can be changed directly in the code-flow when needed.
     * @param {object} options options for creating the consoleinterface
     * @param {boolean} options.useFormatting enable ANSI-escape-code formatting (default: true)
     * @param {boolean} options.useTimestamps enable human readable timestamps (default: true)
     * @param {"all"|"warning"|"error"|"fatal"} options.globalLogLevel glabal log event filtering (default: 'all')
     * @param {string} options.colorTheme choose a color theme (default:  'neo-console')
     * @param {string} options.ignoreClasses[] ignore speziffic event and error classes (default: none)
     * @param {"local"|"date-now"|"onlytime"} options.chrono set the chrono-shematic used for console timestamps (default: 'local')
     * @param {number} options.chonoLength maximum timestamp length to enshure an uniform look
     * @param {number} options.genericAnimationTick Overall console animation tick (default: 100ms)
     * @param {"nobe"|"typenwriter"|"flash"|"fade"|"magic"} options.animation decorative animation (default: 'none')
     */
    constructor (options) {

        // check defualt values
        if (options.useFormatting == undefined) {this.useFormatting = true} else {this.useFormatting = options.useFormatting};
        if (options.useTimestamps == undefined) {this.useTimestamps = true} else {this.useTimestamps = options.useTimestamps};
        if (typeof options.globalLogLevel != "string") {this.globalLogLevel = "all"} else {this.globalLogLevel = options.globalLogLevel};
        if (typeof options.colorTheme != "string") {this.colorTheme = "neo-console"} else {this.colorTheme = options.colorTheme};
        if (typeof options.ignoreClasses == "undefined") {this.ignoreClasses = []} else {this.ignoreClasses = options.ignoreClasses};
        if (typeof options.chrono != "string") {this.chrono = "local"} else {this.chrono = options.chrono};
        if (typeof options.genericAnimationTick != "number") {this.genericAnimationTick = 100} else {this.genericAnimationTick = options.genericAnimationTick};
        if (options.chonoLength == 0  || !options.chonoLength || typeof chonoLength != "number") {this.chonoLength = 12} else {this.chonoLength = options.chonoLength};
        if (typeof options.animation != "string") {this.animation = "none"} else {this.animation = options.animation};

        // default values for logfile
        this.logfile = {
            logUserinput: false,
            path: "",
            includeTimestamps: true,
            logVisualision: false,
            logLevel: "warning",
            ignoreClasses: [],
        };

        // default values for webhook
        this.webhook = {
            webhookURL: "",
            ignoreClasses: [],
            logLevel: "error",
            includeStack: true,
            includeSensitiveInformation: false,
            style: "text",
        };

    };

    /**
     * Initialise the File-Logger. The file logger enables events to be logged in a file for later diagnostics
     * or the archive. REMEMBER: if a file already saved it will be overwritten!
     * @param {string} path filepath where the logfile will be written
     * @param {object} options options passed to the file-logger
     * @param {boolean} options.logUserinput controls if user input should be present in the logfile (default: false)  
     * @param {boolean} options.logVisualision controls if visualision like prograss-bars or tables should be present in the logfile (default: false)
     * @param {boolean} options.includeTimestamps enables timestamps for logfile (default: true)
     * @param {"all"|"warning"|"error"|"fatal"} options.logLevel level of the logfile (default: "warning")
     * @param {string} options.ignoreClasses[] ignore speziffic classes for the logfile (default: none)
     */
    initLogfile (path, options) {
        this.logfile.path = path;
        if (options.logUserinput != undefined) {this.logfile.logUserinput = options.logUserinput};
        if (options.logVisualision != undefined) {this.logfile.logVisualision = options.logVisualision};
        if (options.ignoreClasses != undefined) {this.logfile.tignoreClasses = options.ignoreClasses};
        this.fsloggerHandle = new fslogger(this.logfile.path, "a");
    };

    /**
     * Initialise the webhook-cleant. The webhook-cient enabels you to get direct notfication of the programms stae
     * via the free voice- and textchat service [Discord](https://discord.com). See [Discord webhook feature] ()
     * for further informations.
     * 
     * Due to some text-channels are publicly visible:
     * **! PERSONAL, OR ANY OTHER KIND OF SENSITIVE INFORMATION MAY BE LEAKED TO PUBLIC OR THIRD PARTIES !**
     * 
     * @param {string} webhookURL The webhook-URL provided to you by Discord
     * @param {object} options options passed to the webhook-client 
     * @param {string} options.igonoreClasses[] ignore speziffic classes for the webhook-client (default: none)
     * @param {"all"|"warning"|"error"|"fatal"} options.logLevel level of the webhook-client (default: "error")
     * @param {"text"|"embed"} options.style sets the display method (default: "text") 
     * @param {boolean} options.includeStack include stack in case of an fatal error (default: true)
     * @param {boolean} options.includeSensitiveInformation include sensitive information (default: false)
     * @return {Promise} webhook object as described in the Discord API-Docs
     */
    initWebhook (webhookURL, options) {
        this.webhook.webhookURL = webhookURL;
        this.webhookHandle = new webhook(this.webhook.webhookURL);
        if (options.igonoreClasses != undefined) {this.webhook.ignoreClasses = options.igonoreClasses};
        if (typeof options.includeStack == "boolean") {this.webhook.includeStack = options.includeStack};
        if (typeof options.includeSensitiveInformation == "boolean") {this.webhook.includeSensitiveInformation = options.includeSensitiveInformation};
        if (typeof options.logLevel == "string") {this.webhook.logLevel = options.logLevel};
        if (typeof options.style == "string") {this.webhook.style = options.style};
        return new Promise((resolve, reject) => {
            this.webhookHandle.get().then(result => {
                if (result.isRejected) { 
                } else {
                    resolve(result);
                };
            });
        });
    };

    /**
     * Closes the logifile and shuts down the stream
     */
    dropLogfile () {
        this.fsloggerHandle.close();
    };

    /**
     * Directly writes a message or output bypassing all fancy functions and sub-modules.
     * @param {any} message data to write
     */
    cout (message) {
        process.stdout.write(message + "");
    };

    /**
     * Displays and logs a simple message in the console.
     * @param {any} message message to write
     */
    log (message) {
        if (this.globalLogLevel == "warning" || this.globalLogLevel == "error" || this.globalLogLevel == "fatal") {
            return;
        } else {
            if (this.logfile.path != "") {
                if (this.logfile.logLevel != "warning" && this.logfile.logLevel != "error" && this.logfile.logLevel != "fatal") {
                    this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + " " + message);
                };
            };
            if (this.webhook.webhookURL.length != "") {
                if (this.webhook.logLevel != "warning" && this.webhook.logLevel != "error" && this.webhook.logLevel != "fatal") {
                    switch (this.webhook.style) {
                        default:
                            this.webhookHandle.execute({
                                content: `${message}`
                            });
                        break;
                        case "embed":
                            this.webhookHandle.execute({embeds: [{
                                color: 6323595,
                                description: `${message}`
                            }]})
                        break;
                    };
                };
            };
            this.cout(colorizer([
                {role: "grayed", text: chrono(this.chrono, this.chonoLength, !this.useTimestamps)},
                {role: "neutral", text: message},
            ], this.colorTheme, !this.useFormatting) + "\n");
        };
    };

    /**
     * Displays and loggs a simple warning message in the console.
     * @param {string} message warning message
     */
    logWarning (message) {
        if (this.globalLogLevel == "error" || this.globalLogLevel == "fatal") {
            return;
        } else {
            if (this.logfile.path != "") {
                if (this.logfile.logLevel != "error" && this.logfile.logLevel != "fatal") {
                    this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + " !WRN: " + message);
                };
            };
            if (this.webhook.webhookURL.length != "") {
                if (this.webhook.logLevel != "error" && this.webhook.logLevel != "fatal") {
                    switch (this.webhook.style) {
                        default:
                            this.webhookHandle.execute({
                                content: `:warning: **!WRN**: ${message}`
                            });
                        break;
                        case "embed":
                            this.webhookHandle.execute({embeds: [{
                                color: 16776960,
                                title: ":warning: WARNING:",
                                description: `${message}`
                            }]})
                        break;
                    };
                };
            };
            this.cout(colorizer([
                {role: "grayed", text: chrono(this.chrono, this.chonoLength, !this.useTimestamps)},
                {role: "danger", text: "!WRN"},
                {role: "neutral", text: ": "},
                {role: "grayed", text: message},
            ], this.colorTheme, !this.useFormatting) + "\n");
        };
    };

    /**
     * Displays and loggs a simple error message.
     * @param {number} code Error- or ErrorFamily code numeric
     * @param {string} errClass Error class / descriptor
     * @param {string} message An error message to inform the user what went wrong
     * @returns {object} Error inforamtion for handlers
     */
    logError (code, errClass, message) {
        if (this.globalLogLevel == "fatal") {
            return;
        } else {
            if (this.logfile.path != "") {
                if (!this.logfile.ignoreClasses.includes(errClass)) {
                    if (this.logfile.logLevel != "fatal"){
                        this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + " !ERR: [" + code + "]" + errClass + ":: " + message);   
                    };
                };
            };
            if (this.webhook.webhookURL.length != "") {
                if (this.webhook.logLevel != "fatal") {
                    switch (this.webhook.style) {
                        default:
                            this.webhookHandle.execute({
                                content: `:x: **!ERR**: ${code}|${errClass}:: ${message}`
                            });
                        break;
                        case "embed":
                            this.webhookHandle.execute({embeds: [{
                                color: 15548997,
                                title: ":x: ERROR:",
                                fields: [
                                    {name: "Code:", value: code, inline: true},
                                    {name: "error Class:", value: errClass, inline: true},
                                    {name: "message:", value: "```" + message + "```", inline: false}
                                ]
                            }]})
                        break;
                    };
                };
            };
            if (!this.ignoreClasses.includes(errClass)) {
                this.cout(colorizer([
                    {role: "grayed", text: chrono(this.chrono, this.chonoLength, !this.useTimestamps)},
                    {role: "error", text: "!ERR"},
                    {role: "neutral", text: ": ["},
                    {role: "info", text: code},
                    {role: "neutral", text: "]"},
                    {role: "error", text: errClass},
                    {role: "neutral", text: ":: "},
                    {role: "dissabeld", text: message}
                ], this.colorTheme, !this.useFormatting) + "\n");
            };
        };
        return {name: errClass, message: message, stack: ""};
    };

    /**
     * Displays an operation and informs about the status of every subfunction.
     * @param {"still"|"oneshot"|"event"|"loop"} trigger Describes how the operation was triggerd.
     * @param {string} descriptor Describes the operation (AKA "opration_class").
     * @param {object} data[] Data returned from the operation.
     * @param {string} data.name[] Name of the subfunction.
     * @param {string} data.descriptor Description of what was done.
     * @param {bool} data.sucessor Subfunction ended with a sucess.
     * @param {bool} sucess Operation was sucessfull.
     */
    operation (trigger, descriptor, data, sucess) {
        if (this.globalLogLevel == "warning" || this.globalLogLevel == "error" || this.globalLogLevel == "fatal") {
            return;
        };
        this.cout(colorizer([
            {role: "grayed", text: chrono(this.chrono, this.chonoLength, !this.useTimestamps)},
            {role: "operation", text: "OPERATION"},
            {role: "neutral", text: ": "},
            {role: "info", text: trigger},
            {role: "neutral", text: "|"},
            {role: "dissabeld", text: descriptor}
        ], this.colorTheme, !this.useFormatting) + "\n")
        var spacer = chrono(this.chrono, this.chonoLength, !this.useTimestamps).length;
        var emptySpace = "";
        for (var i = 0; i < spacer; i++) {
            emptySpace = emptySpace  + " ";
        };
        if (this.logfile.path != "") {
            
            
        };
        this.cout(colorizer([
            {role: "neutral", text: emptySpace + "───┰─────"},
        ], this.colorTheme, !this.useFormatting) + "\n");
        data.forEach(element => {
            if (element.sucessor) {
                this.cout(colorizer([
                    {role: "neutral", text: emptySpace + "   ┣ "},
                    {role: "operation", text: element.name},
                    {role: "neutral", text: ": "},
                    {role: "grayed", text: element.descriptor},
                    {role: "neutral", text: " >> "},
                    {role: "good", text: "SUCESS"}
                ], this.colorTheme, !this.useFormatting) + "\n");
            } else {
                this.cout(colorizer([
                    {role: "neutral", text: emptySpace + "   ┣ "},
                    {role: "operation", text: element.name},
                    {role: "neutral", text: ": "},
                    {role: "grayed", text: element.descriptor},
                    {role: "neutral", text: " >> "},
                    {role: "error", text: "FAIL"}
                ], this.colorTheme, !this.useFormatting) + "\n");
            };
        });
        if (sucess) {
            this.cout(colorizer([
                {role: "neutral", text: emptySpace + "   ┗━━━ "},
                {role: "dissabeld", text: "RESULT: "},
                {role: "good", text: "OPERATION SUCESS"}
            ], this.colorTheme, !this.useFormatting) + "\n");
        } else {
            this.cout(colorizer([
                {role: "neutral", text: emptySpace + "   ┗━━━ "},
                {role: "dissabeld", text: "RESULT: "},
                {role: "error", text: "OPERATION FAILED"}
            ], this.colorTheme, !this.useFormatting) + "\n");
        }
    };
};