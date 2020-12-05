import {DefaultSpec, SpecType} from "./spec_types";
import {convertNumberToString, getName, isAllDigit, isAllText} from "../util/util";

export class Number64 {
    start: number;
    end: number;

    constructor() {
        this.start = 0;
        this.end = 0
    }

    getStart() {
        return this.start
    }

    getEnd() {
        return this.end
    }

    merge(n: Number64) {
        this.start |= n.start;
        this.end |= n.end;
    }

    setBit(pos: number) {
        if (pos < 31) {
            this.start |= 1 << pos;
        } else if (pos < 60) {
            this.end |= 1 << (pos % 30);
        } else {
            throw InvalidBitError;
        }
    }

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

export class Part {
    start: number;
    end: number;
    step: number;
    allAvailable: boolean;

    constructor(start: number, end: number, step: number) {
        this.start = start;
        this.end = end;
        this.step = step;
        this.allAvailable = false;
    }

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


export class Spec {
    type: SpecType;
    bits: Number64;
    parts: Part[];

    constructor(bits: Number64, parts: Part[]) {
        this.bits = bits;
        this.parts = parts;
        this.type = DefaultSpec;
    }

    getParts() {
        return this.parts
    }

    getStart() {
        return this.bits.getStart()
    }

    getEnd() {
        return this.bits.getEnd()
    }

    merge(s: Spec) {
        if (this.type === s.type) {
            this.bits.merge(s.bits);
            this.parts = this.parts.concat(s.parts);
        } else {
            throw InvalidTypeForMergeError;
        }
    }

    setBit(pos: number) {
        this.bits.setBit(pos);
    }

    getBit(pos: number) {
        return this.bits.getBit(pos);
    }

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

export const InvalidBitError = new Error("Indexes only between [0, 59] can be set");
export const InvalidTypeForMergeError = new Error("The specs are of different types");
