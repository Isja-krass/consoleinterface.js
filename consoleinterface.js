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
     * @param {number} options.genericAnimationTick Ovarall console animation tick (default: 100ms)
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
            tignoreClasses: [],
        };

    };

    /**
     * Initialise the File-Logger. The file logger enables events to be logged in a file for later diagnostics
     * or the archive. REMEMBER: if a file already saved it will be overwritten!
     * @param {string} path filepath where the logfile will be written
     * @param {object} options options pass to the file-logger
     * @param {boolean} options.logUserinput controls if user input should be present in the logfile (default: false)  
     * @param {boolean} options.logVisualision controls if visualision like prograss-bars or tables should be present in the logfile (default: false)
     * @param {boolean} options.includeTimestamps enables timestamps for logfile (default: true)
     * @param {"all"|"warning"|"error"|"fatal"} options.logLevel level of the logfile (default: "warning")
     * @param {string} options.ignoreClasses[] ignore speziffic classes fot the logfile (default: none)
     */
    initLogfile (path, options) {
        if (!path || typeof path != "string") {
            throw {name: "0x10", class: "ERR_MISSING_ARGUMENTS", message: "The 'path' argument is missing or undefined"};
        };
        this.logfile.path = path;
        if (options.logUserinput != undefined) {this.logfile.logUserinput = options.logUserinput};
        if (options.logVisualision != undefined) {this.logfile.logVisualision = options.logVisualision};
        if (options.includeTimestamps != undefined) {this.logfile.useTimestamps = options.useTimestamps};
        if (typeof options.logLevel == "string") {this.logfile.logLevel = options.logLevel};
        if (options.ignoreClasses != undefined) {this.logfile.tignoreClasses = options.ignoreClasses};
        this.fsloggerHandle = new fslogger(this.logfile.path, "a");
    };

    /**
     * Closes the logifile and shuts down the stream
     */
    dropLogfile () {
        if (!this.fsloggerHandle) {
            throw {name: "0x10", class: "ERR_MISSING_ARGUMENTS", message: "The 'fs::handle' argument is missing or undefined"};
        };
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
                this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.useTimestamps) + " " + message);
            };
            this.cout(colorizer([
                {role: "grayed", text: chrono(this.chrono, this.chonoLength, !this.useTimestamps)},
                {role: "neutral", text: message},
            ], this.colorTheme, !this.useFormatting) + "\n");
        };
    };

    /**
     * Displays and loggs a simple warning message in the console.
     * @param {*} message 
     */
    logWarning (message) {
        if (this.globalLogLevel == "error" || this.globalLogLevel == "fatal") {
            return;
        } else {
            if (this.logfile.path != "") {
                this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.useTimestamps) + " !WRN: " + message);
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
     */
    logError (code, errClass, message) {
        if (this.globalLogLevel == "fatal") {
            return;
        } else {
            if (this.logfile.path != "") {
                this.fsloggerHandle.append(chrono(this.chrono, this.chonoLength, !this.useTimestamps) + " !ERR: [" + code + "]" + errClass + ":: " + message);
            };
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

};