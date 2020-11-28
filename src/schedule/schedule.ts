export const InvalidPositionError = new Error("invalid position for the Spec Schedule, must be between 0-5 inclusive")

export class SpecSchedule {
    minute: number;
    hour: number;
    dom: number;
    month: number;
    dow: number;


    constructor() {
        this.minute = 0
        this.hour = 0
        this.dom = 0
        this.month = 0
        this.dow = 0
    }

    set(pos: number, range: number) {
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
