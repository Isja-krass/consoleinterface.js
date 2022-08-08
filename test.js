const consoleinterface = require("./consoleinterface");
const cif = new consoleinterface({
    useTimestamps: false,
});

cif.initLogfile("./testlog.log", {logLevel: "all"});


cif.log("ter");
cif.logWarning("test");
