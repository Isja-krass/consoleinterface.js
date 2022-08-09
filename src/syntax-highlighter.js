/**
 * ===[ INFO ]==================================================================
 * @file ./src/syntax-highlighter.js
 * @brief Colorize an pice of code coresponding to the color theme
 * @created 09-08-2022@21:29:07.025
 * @author isja_krass
 * @version 0.0.1
 * =============================================================================
 */

/**
 * Token lib
 */
const tokens = {

};

/// EXPORTS MASTERFUNCTION ///
/**
 * Colorize an given input via token-detection corresponding to the current color theme.
 * @param {string} input input source code
 * @param {string} colorTheme choose a color theme
 */
module.exports = function (input, colorTheme) {
    var currentTheme = require("../colorthemes.json")[colorTheme]["tokens"];


};