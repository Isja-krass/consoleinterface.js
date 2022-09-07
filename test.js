const consoleinterface = require("./consoleinterface");
const cif = new consoleinterface({

});

cif.initLogfile("./testlog", {
    logUserinput: true,
});


cif.getBool().then(result => {
    cif.cout(result + "\n");
    cif.cout(typeof result + "\n");
}).catch(error => {
    console.log(error);
});
