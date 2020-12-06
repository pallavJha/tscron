import minimist = require('minimist');
import {parse} from "./parser/parser";

const help = `ts-cron help:

commands:
next: To print the next date on which the cron is supposed to run
   Option:
       --cron or -c : For the cron Syntax, like, * 12-18/3 * 2 5
describe: To print the cron description
   Option:
       --cron or -c : For the cron Syntax
help: To print help docs`;

const args = minimist(process.argv.slice(2));


function getAction(arg: minimist.ParsedArgs): string {
    const actions = arg._;
    if (actions.length > 1) {
        console.error("Too many sub commands present!");
        console.log("The valid sub commands count is 1");
        console.log(help);
        return ""
    }
    if (!(actions[0] === "next" || actions[0] === "describe" || actions[0] === "help")) {
        console.error("Invalid sub command provided!");
        console.log("The valid sub commands are: cron and describe");
        console.log(help);
        return ""
    }
    return actions[0]
}

function getCronString(arg: minimist.ParsedArgs): string {
    let cronString: string = arg.cron;
    if (!cronString || cronString.length === 0) {
        cronString = arg.c;
        if (cronString.length === 0) {
            console.log("Cron string is a required parameter");
            console.log(help);
            return ""
        }
    }
    return cronString
}

const action: string = getAction(args);
if (action.length !== 0) {
    if (action === "help") {
        console.log(help)
    } else {
        const cronString = getCronString(args);
        const schedule = parse(cronString);
        if (action === "next") {
            const nextExecOn = schedule.next(new Date());
            console.log(nextExecOn.toLocaleString("en-IN", {timeZone: "Asia/Kolkata"}))
        } else {
            console.log(schedule.describe())
        }
    }
}


