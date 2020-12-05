import {Number64} from "../parser/number64";

class NextDateRequest {
    currentDate: Date;
    modified: boolean;
    discontinue: boolean;

    constructor(currentDate: Date, modified: boolean, discontinue: boolean) {
        this.currentDate = currentDate;
        this.modified = modified;
        this.discontinue = discontinue;
    }
}

const MaxMonthStart = 2147483646;
const MaxMonthEnd = 2;
const MaxDayOfWeekStart = 127;
const MaxDayOfWeekEnd = 0;

export class SpecSchedule {
    seconds: Number64;
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
        this.seconds = new Number64();
        this.seconds.setBit(0)
    }

    public set(pos: number, range: Number64) {
        switch (pos) {
            case 0:
                this.minute = range;
                break;
            case 1:
                this.hour = range;
                break;
            case 2:
                this.dom = range;
                break;
            case 3:
                this.month = range;
                break;
            case 4:
                this.dow = range;
                break;
            default:
                throw InvalidPositionError
        }
    }

    public next(d: Date) {
        d.setSeconds(d.getSeconds() + 1);
        const yearLimit = d.getFullYear() + 5;
        let req = new NextDateRequest(d, false, false);
        while (true) {
            req = this.findNext(req);
            if (req.currentDate.getFullYear() > yearLimit) {
                throw NoReachableDateError
            }
            if (req.discontinue) {
                return req.currentDate
            }
        }
    }

    private findNext(req: NextDateRequest) {
        while (!this.month.getBit(req.currentDate.getMonth() + 1)) {
            if (!req.modified) {
                req.modified = true;
                req.currentDate = new Date(req.currentDate.getFullYear(), req.currentDate.getMonth(), 1, 0, 0, 0, 0)
            }
            req.currentDate.setMonth(req.currentDate.getMonth() + 1);

            if (req.currentDate.getMonth() === 0) {
                return req
            }
        }

        while (!this.dayMatches(req)) {
            if (!req.modified) {
                req.modified = true;
                req.currentDate = new Date(req.currentDate.getFullYear(), req.currentDate.getMonth(), req.currentDate.getDate(), 0, 0, 0, 0)
            }
            req.currentDate.setDate(req.currentDate.getDate() + 1);

            if (req.currentDate.getDate() === 1) {
                return req
            }
        }

        while (!this.hour.getBit(req.currentDate.getHours())) {
            if (!req.modified) {
                req.modified = true;
                req.currentDate = new Date(req.currentDate.getFullYear(), req.currentDate.getMonth(), req.currentDate.getDate(), req.currentDate.getHours(), 0, 0, 0)
            }
            req.currentDate.setHours(req.currentDate.getHours() + 1);

            if (req.currentDate.getHours() === 0) {
                return req
            }
        }

        while (!this.minute.getBit(req.currentDate.getMinutes())) {
            if (!req.modified) {
                req.modified = true;
                req.currentDate = new Date(req.currentDate.getFullYear(), req.currentDate.getMonth(), req.currentDate.getDate(), req.currentDate.getHours(), req.currentDate.getMinutes(), 0, 0)
            }
            req.currentDate.setMinutes(req.currentDate.getMinutes() + 1);

            if (req.currentDate.getMinutes() === 0) {
                return req
            }
        }

        while (!this.minute.getBit(req.currentDate.getMinutes())) {
            if (!req.modified) {
                req.modified = true;
                req.currentDate = new Date(req.currentDate.getFullYear(), req.currentDate.getMonth(), req.currentDate.getDate(), req.currentDate.getHours(), req.currentDate.getMinutes(), 0, 0)
            }
            req.currentDate.setMinutes(req.currentDate.getMinutes() + 1);

            if (req.currentDate.getMinutes() === 0) {
                return req
            }
        }

        while (req.currentDate.getSeconds() !== 0) {
            if (!req.modified) {
                req.modified = true;
                req.currentDate = new Date(req.currentDate.getFullYear(), req.currentDate.getMonth(), req.currentDate.getDate(), req.currentDate.getHours(), req.currentDate.getMinutes(), req.currentDate.getSeconds(), 0)
            }
            req.currentDate.setSeconds(req.currentDate.getSeconds() + 1);

            if (req.currentDate.getSeconds() === 0) {
                return req
            }
        }


        req.discontinue = true;
        return req
    }

    private dayMatches(req: NextDateRequest) {
        const domMatch = this.dom.getBit(req.currentDate.getDate());
        const dowMatch = this.dow.getBit(req.currentDate.getDay());
        if (this.dom.start === MaxMonthStart && this.dom.end === MaxMonthEnd) {
            return dowMatch
        }
        if (this.dow.start === MaxDayOfWeekStart && this.dow.end === MaxDayOfWeekEnd) {
            return domMatch
        }
        return domMatch || dowMatch
    }
}

export const InvalidPositionError = new Error("invalid position for the Spec Schedule, must be between 0-5 inclusive");
export const NoReachableDateError = new Error("No valid date for the cron available in the next 5 years");
