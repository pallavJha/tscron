export class Number64 {
    start: number;
    end: number;

    constructor() {
        this.start = 0
        this.end = 0
    }

    setBit(pos: number) {
        if (pos < 31) {
            this.start |= 1 << pos
        } else if (pos < 60) {
            this.end |= 1 << (pos % 30)
        } else {
            throw InvalidBitError;
        }
    }
}


export const InvalidBitError = new Error("Indexes only between [0, 59] can be set");