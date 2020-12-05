import {Number64, Spec} from "../parser/spec"

export const InvalidPositionError = new Error("invalid position for the Spec Schedule, must be between 0-5 inclusive");
export const NoReachableDateError = new Error("No valid date for the cron available in the next 5 years");

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
    seconds: Spec;
    minute: Spec;
    hour: Spec;
    dom: Spec;
    month: Spec;
    dow: Spec;


    constructor() {
        this.minute = new Spec(new Number64(), []);
        this.hour = new Spec(new Number64(), []);
        this.dom = new Spec(new Number64(), []);
        this.month = new Spec(new Number64(), []);
        this.dow = new Spec(new Number64(), []);
        this.seconds = new Spec(new Number64(), []);
        this.seconds.setBit(0)
    }

    public set(pos: number, spec: Spec) {
        switch (pos) {
            case 0:
                this.minute = spec;
                break;
            case 1:
                this.hour = spec;
                break;
            case 2:
                this.dom = spec;
                break;
            case 3:
                this.month = spec;
                break;
            case 4:
                this.dow = spec;
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
        if (this.dom.getStart() === MaxMonthStart && this.dom.getEnd() === MaxMonthEnd) {
            return dowMatch
        }
        if (this.dow.getStart() === MaxDayOfWeekStart && this.dow.getEnd() === MaxDayOfWeekEnd) {
            return domMatch
        }
        return domMatch || dowMatch
    }


    public describe(): string {
        let descriptionBuffer: string = "";
        descriptionBuffer = descriptionBuffer + this.minute.describe();
        if (descriptionBuffer.length === 0) {
            descriptionBuffer = "Every minute "
        }
        descriptionBuffer = descriptionBuffer.trim() + " " + this.hour.describe().trim();
        descriptionBuffer = descriptionBuffer.trim() + " " + this.dom.describe().trim();
        descriptionBuffer = descriptionBuffer.trim() + " " + this.month.describe().trim();
        descriptionBuffer = descriptionBuffer.trim() + " " + this.dow.describe().trim();

        if (descriptionBuffer.length === 0) {
            return "Every minute"
        }

        return descriptionBuffer.trim()
    }
}
