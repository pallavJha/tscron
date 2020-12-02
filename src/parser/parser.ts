import {SpecSchedule} from "../schedule/schedule";
import {Number64} from "./number64";

const NumberOfFields = 5

class Range {
    start: number;
    end: number;

    constructor(start: number, end: number) {
        this.start = start
        this.end = end
    }
}

const fieldDefinitions = [
    new Range(0, 59),
    new Range(0, 23),
    new Range(1, 31),
    new Range(1, 12),
    new Range(0, 6),
];

export function parse(spec: string): SpecSchedule {
    if (spec === undefined || spec.length === 0) {
        throw ParseError
    }

    const fields = spec.split(" ");
    if (NumberOfFields !== fields.length) {
        throw ParseError
    }

    const schedule: SpecSchedule = new SpecSchedule();

    for (let i = 0; i < NumberOfFields; i++) {
        schedule.set(i, getRange(fields[i], fieldDefinitions[i]))
    }
    return schedule
}

function getRange(expr: string, r: Range): Number64 {
    let start: number;
    let end: number;
    let step: number;
    const rangeAndStep = expr.split("/");
    const lowAndHigh = rangeAndStep[0].split("-");
    const singleDigit = lowAndHigh.length === 1;

    if (lowAndHigh[0] === "*" || lowAndHigh[0] === "?") {
        start = r.start
        end = r.end
    } else {
        start = mustParseInt(lowAndHigh[0])
        switch (lowAndHigh.length) {
            case 1:
                end = start
                break;
            case 2:
                end = mustParseInt(lowAndHigh[1])
                break;
            default:
                throw new Error("Too many hyphens: Only use one hyphen for setting the range, like, 1-15")
        }
    }

    switch (rangeAndStep.length) {
        case 1:
            step = 1
            break
        case 2:
            step = mustParseInt(rangeAndStep[1])
            if (singleDigit) {
                end = r.end
            }
            break
        default:
            throw new Error("Too many Slashes: Only use one slash for setting the range, like, 1-15/2 or 3/5")
    }

    if (start < r.start) {
        throw new Error("beginning of range " + start + " below minimum " + r.start + ": " + expr)
    }
    if (end > r.end) {
        throw new Error("end of range " + end + " above maximum " + r.end + ": " + expr)
    }
    if (r.start > end) {
        throw new Error("beginning of range " + start + " beyond end of range " + end + ": " + expr)
    }
    if (step === 0) {
        throw new Error("step of range should be a positive number: " + expr)
    }

    return getBits(start, end, step)
}


function mustParseInt(expr: string): number {
    const num = parseInt(expr, 10)
    if (num <= 0) {
        throw new Error("Negative numbers are not allowed in the cron expression")
    }

    return num
}

function getBits(min: number, max: number, step: number): Number64 {
    const bits: Number64 = new Number64();

    for (let i = min; i <= max; i += step) {
        bits.setBit(i);
    }
    return bits
}

export const ParseError = new Error("invalid format for the cron, follow * * * * *");
