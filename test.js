const consoleinterface = require("./consoleinterface");
const cif = new consoleinterface({
    useFormatting: true,
    chrono: "date-now",
});


cif.operation("event", "EVENT_MESSAGE_CREATE", [
    {name: "sort", descriptor: "message was sorted as an guild message from <eos>", sucessor: true},
    {name: "MESSAGE_WATCHDOG_SE", descriptor: "message contains no violent content", sucessor: true},
    {name: "command", descriptor: "the command handler was reached at <eof>", sucessor: true},
    {name: "command", descriptor: "type 'admincommand' was selected", sucessor: true},
    {name: "ADMINCMD_SE", descriptor: "searching for privileges: ['ADMIN', 'MANAGE_SERVER']", sucessor: false},
    {name: "ADMINCMD_SE", descriptor: "failed, no permission...", sucessor: false},
], false);

