import {SpecSchedule} from "../schedule/schedule";
import {Number64, Part, Spec} from "./spec";
import {DayOfTheMonthSpec, DayOfTheWeekSpec, HourSpec, MinuteSpec, MonthSpec, SpecType} from "./spec_types";

// Currently 5 blocks are supported
const NumberOfFields = 5;

// Range defines the maximum values that the cron specification can have
export class Range {
    start: number;
    end: number;
    specType: SpecType;

    constructor(start: number, end: number, specType: SpecType) {
        this.start = start;
        this.end = end;
        this.specType = specType;
    }
}

export const fieldDefinitions = [
    // minutes
    new Range(0, 59, MinuteSpec),
    // hours
    new Range(0, 23, HourSpec),
    // day of the month
    new Range(1, 31, DayOfTheMonthSpec),
    // month of the year
    new Range(1, 12, MonthSpec),
    // day of the week
    new Range(0, 6, DayOfTheWeekSpec),
];

// parse splits the cron string on space that results into an array of specs
// then iteratively calls the getField to create Spec for each one of the
// string specs
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
        schedule.set(i, getField(fields[i], fieldDefinitions[i]))
    }
    return schedule
}

// getField calls the getRange function iteratively for each of the parts
// found after splitting the spec on comma
export function getField(expr: string, r: Range) {
    const bits = new Number64();
    const spec = new Spec(bits, []);
    spec.type = r.specType;
    const expressions = expr.split(",");
    for (const expression of expressions) {
        spec.merge(getRange(expression.trim(), r))
    }
    return spec
}

// creates a spec by finding the min and max locations
// at which Spec should have the bit set.
// This function works on the Parts found after splitting the spec on comma
// The part is the first parameter.
export function getRange(expr: string, r: Range): Spec {
    let start: number;
    let end: number;
    let step: number;
    let allAvailable: boolean = false;
    const rangeAndStep = expr.split("/");
    const lowAndHigh = rangeAndStep[0].split("-");
    const singleDigit = lowAndHigh.length === 1;

    if (lowAndHigh[0] === "*" || lowAndHigh[0] === "?") {
        start = r.start;
        end = r.end;
        allAvailable = true;
    } else {
        start = mustParseInt(lowAndHigh[0]);
        switch (lowAndHigh.length) {
            case 1:
                end = start;
                break;
            case 2:
                end = mustParseInt(lowAndHigh[1]);
                break;
            default:
                throw new Error("Too many hyphens: Only use one hyphen for setting the range, like, 1-15")
        }
    }

    switch (rangeAndStep.length) {
        case 1:
            step = 1;
            break;
        case 2:
            step = mustParseInt(rangeAndStep[1]);
            if (singleDigit) {
                // special handling: "N/step" means "N-max/step".
                end = r.end
            }
            break;
        default:
            throw new Error("Too many Slashes: Only use one slash for setting the range, like, 1-15/2 or 3/5")
    }

    if (start < r.start) {
        throw new Error("Beginning of range " + start + " below minimum " + r.start + ": " + expr)
    }
    if (end > r.end) {
        throw new Error("End of range " + end + " above maximum " + r.end + ": " + expr)
    }
    if (r.start > end) {
        throw new Error("Beginning of range " + start + " beyond end of range " + end + ": " + expr)
    }
    if (step === 0) {
        throw new Error("Step of range should be a positive number: " + expr)
    }

    const spec = setBits(start, end, step);
    spec.type = r.specType;
    spec.parts[0].allAvailable = allAvailable;
    return spec
}

// converts the expression string into integer.
export function mustParseInt(expr: string): number {
    const num = parseInt(expr, 10);
    if (num < 0) {
        throw new Error("Negative numbers are not allowed in the cron expression")
    }

    return num
}

// Creates a new Spec whose bits are set at the locations between min and max inclusive
// with gaps = steps
export function setBits(min: number, max: number, step: number): Spec {
    const spec: Spec = new Spec(new Number64(), [new Part(min, max, step)]);

    for (let i = min; i <= max; i += step) {
        spec.setBit(i);
    }
    return spec
}

export const ParseError = new Error("invalid format for the cron, follow * * * * *");
