import {DefaultSpec, SpecType} from "./spec_types";
import {convertNumberToString, getName, isAllDigit, isAllText} from "../util/util";


// Number64 uses two Number type variables, start and end, to partially implement a 64 bit Number
// It supports setting bits at the locations from 0 - 60
export class Number64 {
    // start handles the bits from 0 to 30
    start: number;
    // start handles the bits from 31 to 69
    end: number;

    constructor() {
        this.start = 0;
        this.end = 0
    }

    // returns the start
    getStart() {
        return this.start
    }

    // returns the end
    getEnd() {
        return this.end
    }

    // sets the bits at those locations
    // where n(of Number64 type) has its bit set
    merge(n: Number64) {
        this.start |= n.start;
        this.end |= n.end;
    }

    // sets the bits at the provided position
    setBit(pos: number) {
        if (pos < 31) {
            this.start |= 1 << pos;
        } else if (pos < 60) {
            this.end |= 1 << (pos % 30);
        } else {
            throw InvalidBitError;
        }
    }

    // returns true if the bit is set at the provided location
    getBit(pos: number) {
        if (pos < 31) {
            return (this.start & (1 << pos)) > 0;
        } else if (pos < 60) {
            return (this.end & 1 << (pos % 30)) > 0;
        } else {
            throw InvalidBitError;
        }
    }
}

// Part represents the contents of the cron specification
// For example, if the cron spec is * 1-2/3,18-20,22-23/2 * * *
// Then there will be 5 specs one each for the Minute, Hour, DoM, Month and DoW
// and the Hour spec will contain 3 parts:
// 3 Parts -> {start:1, end:2, step: 3}, {start:18, end:20, step: 1}, {start:22, end:23, step: 2}
export class Part {
    start: number;
    end: number;
    step: number;
    // allAvailable will be true if spec is *
    allAvailable: boolean;

    constructor(start: number, end: number, step: number) {
        this.start = start;
        this.end = end;
        this.step = step;
        this.allAvailable = false;
    }

    // provides a description for the part
    describe(type: SpecType): string {
        if (this.allAvailable && this.step === 1) {
            return ""
        }
        if (this.start !== this.end) {
            if (this.step > 1) {
                return "Every " + convertNumberToString(this.step) + " " + type.name + " from " + getName(this.start, type) + " through " + getName(this.end, type);
            } else {
                return "Every " + type.name + " from " + getName(this.start, type) + " through " + getName(this.end, type);
            }
        } else {
            if (this.step > 1) {
                return "Every " + convertNumberToString(this.step) + " " + type.name + " from " + getName(this.start, type) + " through " + getName(this.end, type);
            } else {
                return getName(this.start, type)
            }
        }
    }
}

// Spec represents the blocks of the cron specification.
// Currently there are 5 block implemented.
// Each spec is characterized by its Spec Type
export class Spec {
    type: SpecType;
    bits: Number64;
    parts: Part[];

    constructor(bits: Number64, parts: Part[]) {
        this.bits = bits;
        this.parts = parts;
        this.type = DefaultSpec;
    }

    // getter for the parts array
    getParts() {
        return this.parts
    }

    // returns the start number from the Number64 variable by
    // delegating to its method
    getStart() {
        return this.bits.getStart()
    }

    getEnd() {
        return this.bits.getEnd()
    }

    // merges the provided spec with this spec
    merge(s: Spec) {
        if (this.type === s.type) {
            this.bits.merge(s.bits);
            this.parts = this.parts.concat(s.parts);
        } else {
            throw InvalidTypeForMergeError;
        }
    }

    // set the bit at the provided location
    // delegates to setBit
    setBit(pos: number) {
        this.bits.setBit(pos);
    }

    getBit(pos: number) {
        return this.bits.getBit(pos);
    }

    // describe joins the description of its parts in a readable format
    public describe(): string {
        if (this.parts[0].describe(this.type).length === 0) {
            return ""
        }
        let descriptionBuffer: string = "";
        const firstDescription = this.parts[0].describe(this.type);
        if (firstDescription.length >= 1) {
            if (firstDescription.length === 1 || isAllText(firstDescription) || isAllDigit(firstDescription)) {
                descriptionBuffer = this.type.prefixSingular + " " + this.type.name;
            }
            descriptionBuffer = descriptionBuffer + " " + firstDescription;
            if (this.parts.length === 2) {
                descriptionBuffer = descriptionBuffer + " and " + this.parts[1].describe(this.type)
            } else if (this.parts.length > 2) {
                for (let i = 1; i < this.parts.length - 1; i++) {
                    descriptionBuffer = descriptionBuffer + ", " + this.parts[i].describe(this.type)
                }
                descriptionBuffer = descriptionBuffer + " and " + this.parts[this.parts.length - 1].describe(this.type)
            }
        }
        return descriptionBuffer.trim()
    }
}

// InvalidBitError is used when the bit is outside the range of [0, 59]
export const InvalidBitError = new Error("Indexes only between [0, 59] can be set");

// InvalidTypeForMergeError used when the spec of different types are merged
export const InvalidTypeForMergeError = new Error("The specs are of different types");
