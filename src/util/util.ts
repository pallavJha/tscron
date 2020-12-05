import {DayOfTheWeekSpec, MonthSpec, SpecType} from "../parser/spec_types";

const AllChars = RegExp('^\\w+$');
const AllDigits = RegExp('^\\d+$');

export function convertNumberToString(num: number) {
    switch (num) {
        case 1:
            return "1st";
        case 2:
            return "2nd";
        case 3:
            return "3rd";
        default:
            return num + "th";
    }
}

export function getName(num: number, type: SpecType) {
    if (type.name === MonthSpec.name) {
        switch (num) {
            case 1:
                return "January";
            case 2:
                return "February";
            case 3:
                return "March";
            case 4:
                return "April";
            case 5:
                return "May";
            case 6:
                return "June";
            case 7:
                return "July";
            case 8:
                return "August";
            case 9:
                return "September";
            case 10:
                return "October";
            case 11:
                return "November";
            case 12:
                return "December";
            default:
                throw new Error("Invalid Month passed(" + num + ") for type " + type.name + ", must be between 1-12")
        }
    }
    if (type.name === DayOfTheWeekSpec.name) {
        switch (num) {
            case 1:
                return "Monday";
            case 2:
                return "Tuesday";
            case 3:
                return "Wednesday";
            case 4:
                return "Thursday";
            case 5:
                return "Friday";
            case 6:
                return "Saturday";
            case 0:
                return "Sunday";
            default:
                throw new Error("Invalid Day of the Week passed(" + num + ") for type " + type.name + ", must be between 0-6")
        }
    }
    return num + ""
}

export function isAllText(str: string) {
    return AllChars.test(str)
}

export function isAllDigit(str: string) {
    return AllDigits.test(str)
}