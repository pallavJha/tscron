import {Number64} from "../parser/number64";

export class SpecSchedule {
    minute: Number64;
    hour: Number64;
    dom: Number64;
    month: Number64;
    dow: Number64;


    constructor() {
        this.minute = new Number64();
        this.hour = new Number64();
        this.dom = new Number64();
        this.month = new Number64();
        this.dow = new Number64();
    }

    set(pos: number, range: Number64) {
        switch (pos) {
            case 0:
                this.minute = range
                break;
            case 1:
                this.hour = range
                break;
            case 2:
                this.dom = range
                break;
            case 3:
                this.month = range
                break;
            case 4:
                this.dow = range
                break;
            default:
                throw InvalidPositionError
        }
    }
}

export const InvalidPositionError = new Error("invalid position for the Spec Schedule, must be between 0-5 inclusive")
