/**
 * ===[ INFO ]==================================================================
 * @file ./consoleinterface.js
 * @brief The consoleinterface++ module from the PAUL toolkit portrtet to javascript.
 * @created 03-08-2022@14:21:12.125
 * @author isja_krass
 * @version 0.0.1
 * @repoURL https://github.com/Isja-krass/consoleinterface
 * =============================================================================
 */

// INCLUDE sub-modules
const colorizer = require("./src/colorizer");
const chrono = require("./src/chrono");
const fslogger = require("./src/fslogger");
const webhook = require("./src/webhook");
const largeFont = require("./src/largeFont");

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
     * @param {"none"|"typenwriter"} options.animation decorative animation (default: 'none')
     */
    constructor (options) {

        // check defualt values
        if (options.useFormatting == undefined) {this.useFormatting = true} else {this.useFormatting = options.useFormatting};
        if (options.useTimestamps == undefined) {this.useTimestamps = true} else {this.useTimestamps = options.useTimestamps};
        if (typeof options.globalLogLevel != "string") {this.globalLogLevel = "all"} else {this.globalLogLevel = options.globalLogLevel};
        if (typeof options.colorTheme != "string") {this.colorTheme = "neo-console"} else {this.colorTheme = options.colorTheme};
        if (typeof options.ignoreClasses == "undefined") {this.ignoreClasses = []} else {this.ignoreClasses = options.ignoreClasses};
        if (typeof options.chrono != "string") {this.chrono = "local"} else {this.chrono = options.chrono};
        if (typeof options.genericAnimationTick != "number") {this.genericAnimationTick = 30} else {this.genericAnimationTick = options.genericAnimationTick};
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
        if (options.logLevel != undefined) {this.logfile.logLevel = options.logLevel};
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
     * @param {boolean} options.includeSensitiveInformation include sensitive information (default: false)
     * @return {Promise<object>} webhook object as described in the Discord API-Docs
     */
    initWebhook (webhookURL, options) {
        this.webhook.webhookURL = webhookURL;
        this.webhookHandle = new webhook(this.webhook.webhookURL);
        if (options.igonoreClasses != undefined) {this.webhook.ignoreClasses = options.igonoreClasses};
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
        switch (this.animation) {
            default: 
                process.stdout.write(message + "");
            break;
            case "typenwriter":
                var msgArray = message.split("");
                var step = 0
                var intervall = setInterval(() => {
                    if (step == msgArray.length) {
                        clearInterval(intervall);
                    } else {
                        process.stdout.write(msgArray[step] + "");
                        step++;
                    };
                }, this.genericAnimationTick);
            break;
        };

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
        if (this.globalLogLevel == "fatal" && this.ignoreClasses.includes(errClass)) {
            return;
        } else {
            if (this.logfile.path != "") {
                if (!this.logfile.ignoreClasses.includes(errClass)) {
                    if (this.logfile.logLevel != "fatal"){
                        this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + " !ERR: [" + code + "]" + errClass + ":: " + message);   
                    };
                };
            };
            if (this.webhook.webhookURL.length != "" && !this.webhook.ignoreClasses.includes(errClass)) {
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
     * @param {bool} data.successor Subfunction ended with a success.
     * @param {bool} success Operation was successfull.
     */
    operation (trigger, descriptor, data, success) {
        if (this.globalLogLevel == "warning" || this.globalLogLevel == "error" || this.globalLogLevel == "fatal") {
            return;
        };
        if (this.logfile.path != "") {
            if (this.logfile.logLevel == "all") {
                if (this.logfile.logVisualision) {
                    this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + ` [OPERATION]: ${trigger}|${descriptor} >> ${success}`);
                    data.forEach(element => {
                        var successE = "";
                        if (element.successor) {successE = "SUCCESS"} else {successE = "FAIL"};
                        this.fsloggerHandle.append(`     ╠═ ${element.name}:: ${element.descriptor} >> ${successE}`); 
                    });
                } else {
                    this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + ` [OPERATION]: ${trigger}|${descriptor} >> ${success}`);
                    data.forEach(element => {
                        var successE = "";
                        if (element.successor) {successE = "SUCCESS"} else {successE = "FAIL"};
                        this.fsloggerHandle.append(`=> ${element.name}:: ${element.descriptor} >> ${successE}`);   
                    });
                };
            };
        };
        if (this.webhook.webhookURL.length != "") {
            if (this.webhook.logLevel != "warning" && this.webhook.logLevel != "error" && this.webhook.logLevel != "fatal") {
                switch (this.webhook.style) {
                    default:
                        var content = "";
                        content = content + `:gear: OPERATION: ${trigger}|${descriptor} >> ${success}\n`;
                        data.forEach(element => {
                            content = content + `=> ${element.name}:: ${element.descriptor} >> ${element.successor}\n`;
                        });
                        this.webhookHandle.execute({
                            content: content,
                        });
                    break;
                    case "embed":
                        var fields = [];
                        data.forEach(element => {
                            var successorEb = "";
                            if (element.successor) {successorEb = ":white_check_mark: "} else {successorEb = ":x: "};
                            fields.push({name: successorEb + element.name, value: element.descriptor, inline: false});
                        });
                        this.webhookHandle.execute({embeds: [{
                            color: 1752220,
                            title: ":gear: OPERATION",
                            description: trigger + "|" + descriptor,
                            fields: fields,
                        }]});
                    break;
                };
            };
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
        this.cout(colorizer([
            {role: "neutral", text: emptySpace + "───┰─────"},
        ], this.colorTheme, !this.useFormatting) + "\n");
        data.forEach(element => {
            if (element.successor) {
                this.cout(colorizer([
                    {role: "neutral", text: emptySpace + "   ┣ "},
                    {role: "operation", text: element.name},
                    {role: "neutral", text: ": "},
                    {role: "grayed", text: element.descriptor},
                    {role: "neutral", text: " >> "},
                    {role: "good", text: "SUCCESS"}
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
        if (success) {
            this.cout(colorizer([
                {role: "neutral", text: emptySpace + "   ┗━━━ "},
                {role: "dissabeld", text: "RESULT: "},
                {role: "good", text: "OPERATION SUCCESS"}
            ], this.colorTheme, !this.useFormatting) + "\n");
        } else {
            this.cout(colorizer([
                {role: "neutral", text: emptySpace + "   ┗━━━ "},
                {role: "dissabeld", text: "RESULT: "},
                {role: "error", text: "OPERATION FAILED"}
            ], this.colorTheme, !this.useFormatting) + "\n");
        }
    };

    /**
     * Ask the user to enter a value ant returns it as string.
     * @param {boolean} [displayPräambel] toggles the Präambel (default: true)
     * @returns {Promise<string>} Input given by the user as string
     */
    getString (displayPräambel) {
        if (displayPräambel || displayPräambel == undefined) {
            this.cout(colorizer([
                {role: "dissabeld", text: "INPUT"},
                {role: "neutral", text: " ["},
                {role: "info", text: "string"},
                {role: "neutral", text: "] << "},
            ], this.colorTheme, !this.useFormatting)); 
        };
        return new Promise((resolve, reject) => {
            var linstener = process.stdin.on("data", (rawData) => {
                var input = rawData.toString();if (this.logfile.path != "" && this.logfile.logUserinput) {
                    this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'bool':: ${input}`);
                };
                if (input.lengt == 0 || input == undefined || input == null) {
                    reject(null);
                    linstener.destroy();
                    if (this.logfile.path != "" && this.logfile.logUserinput) {
                        this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: input was 'undefined' or 'null'`);
                    };
                } else {
                    resolve(input.replace(/\n/g, ""));
                    linstener.destroy();
                    if (this.logfile.path != "" && this.logfile.logUserinput) {
                        this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'string':: ${input}`);
                    };
                };
            });
        });
    };

    /**
     * Ask the user to enter a value ant returns it as number.
     * @param {boolean} [displayPräambel] toggles the Präambel (default: true)
     * @returns {Promise<number>} Input given by the user as number
     */
    getNumber (displayPräambel) {
        if (displayPräambel || displayPräambel == undefined) {
            this.cout(colorizer([
                {role: "dissabeld", text: "INPUT"},
                {role: "neutral", text: " ["},
                {role: "info", text: "number"},
                {role: "neutral", text: "] << "},
            ], this.colorTheme, !this.useFormatting)); 
        };
        return new Promise((resolve, reject) => {
            var listener = process.stdin.on("data", (rawData) => {
                var input = rawData.toString();
                if (input.length == 0 || input == undefined || input == null) {
                    reject(null);
                    listener.destroy();
                    if (this.logfile.path != "" && this.logfile.logUserinput) {
                        this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: input was 'undefined' or 'null'`);
                    };
                } else {
                    var numberResolved = Number(input.replace(/\n/g, ""));
                    listener.destroy();
                    if (numberResolved == NaN) {
                        if (this.logfile.path != "" && this.logfile.logUserinput) {
                            this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: was not able to resolve 'number' out of '${input}' >> reject NULL `);
                        };
                        reject(null);
                    } else { 
                        resolve(numberResolved);
                    };
                    
                }; 
            });
        });

    };

    /**
     * Ask the user to enter a value ant returns it as boolean.
     * @param {boolean} displayPräambel toggles the Präambel (default: true)
     * @returns {Promise<boolean>} Input given by the user as boolean
     */
    getBool (displayPräambel) {
        if (displayPräambel || displayPräambel == undefined) {
            this.cout(colorizer([
                {role: "dissabeld", text: "INPUT"},
                {role: "neutral", text: " ["},
                {role: "info", text: "bool"},
                {role: "neutral", text: "] << "},
            ], this.colorTheme, !this.useFormatting)); 
        };
        return new Promise((resolve, reject) => {
            var listener = process.stdin.on("data", (rawData) => {
                var input = rawData.toString().replace(/\n/g, "").toLocaleLowerCase();
                if (input.length == 0 || input == null || input == undefined) {
                    reject(null);
                    listener.destroy();
                    if (this.logfile.path != "" && this.logfile.logUserinput) {
                        this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: input was 'undefined' or 'null'`);
                    };
                } else {
                    switch (input) {
                        default: 
                            reject(null);
                            listener.destroy();
                            if (this.logfile.path != "" && this.logfile.logUserinput) {
                                this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: was not able to resolve 'bool' out of '${input}' >> reject NULL `);
                            };
                        break;
                        case "true":
                            listener.destroy();
                            resolve(true);
                            if (this.logfile.path != "" && this.logfile.logUserinput) {
                                this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'bool':: ${input}`);
                            };
                        break;
                        case "false":
                            listener.destroy();
                            resolve(false);
                            if (this.logfile.path != "" && this.logfile.logUserinput) {
                                this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'bool':: ${input}`);
                            };
                        break;
                        case "yes":
                            listener.destroy();
                            resolve(true);
                            if (this.logfile.path != "" && this.logfile.logUserinput) {
                                this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'bool':: ${input}`);
                            };
                        break;
                        case "no":
                            listener.destroy();
                            resolve(false);if (this.logfile.path != "" && this.logfile.logUserinput) {
                                this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'bool':: ${input}`);
                            };
                            if (this.logfile.path != "" && this.logfile.logUserinput) {
                                this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'bool':: ${input}`);
                            };
                        break;
                        case "0":
                            listener.destroy();
                            resolve(false);
                            if (this.logfile.path != "" && this.logfile.logUserinput) {
                                this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'bool':: ${input}`);
                            };
                        break;
                        case "1":
                            listener.destroy();
                            resolve(true);
                            if (this.logfile.path != "" && this.logfile.logUserinput) {
                                this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'bool':: ${input}`);
                            };
                        break;
                    };
                };
            });
        });
    };

    /**
     * Writes a large unicede-blockfont header
     * @param {string} title input text
     * @param {string} [role] colorizer role 
     */
    writeHeader(title, role) {
        var out = largeFont(title);
        if (role == "" || role == undefined) { role = "neutral" };
        if (this.logfile.path != "" && this.logfile.logVisualision) {
            out.split("\n").forEach(outputLine => {
                this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.logfile.includeTimestamps) + outputLine);
            });
        };
        this.cout(colorizer([
            {role: role, text: out}
        ], this.colorTheme, !this.useFormatting));
    };

    /**
     * Creates an infoblock with given values and displays it
     * @param {Array<object>} data array of data to display
     * @param {string} data.name parameter display name 
     * @param {any} data.value value of the parameter
     * @param {number} spacer space between the parameter name and the value, should be larger than the length of the longest parameter name
     */
    INFOblock (data, spacer) {
        var output = [];
        data.forEach(element => {
            var spacerCalc = spacer - element.name.length;
            var spacerAdd = "";
            for (var i = 0; i < spacerCalc; i++) {
                spacerAdd = spacerAdd + " ";
            };
            output.push({role: "neutral", text: element.name + ":" + spacerAdd});
            output.push({role: "info", text: element.value + "\n"});

        });
        this.cout(colorizer(output, this.colorTheme, !this.useFormatting));
    };

};