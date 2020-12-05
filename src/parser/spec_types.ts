export class SpecType {
    specType: string;
    name: string;
    prefix: string;
    prefixSingular: string;

    constructor(specType: string, name: string, prefix: string, prefixSingular: string) {
        this.specType = specType;
        this.name = name;
        this.prefix = prefix;
        this.prefixSingular = prefixSingular;
    }
}

export const MinuteSpec: SpecType = new SpecType("minute", "Minute", "Every", "At");
export const HourSpec: SpecType = new SpecType("hour", "Hour", "Past", "Past");
export const DayOfTheMonthSpec: SpecType = new SpecType("dom", "Day-Of-Month", "On Every", "On");
export const MonthSpec: SpecType = new SpecType("month", "Month", "In Every", "In");
export const DayOfTheWeekSpec: SpecType = new SpecType("dow", "Day-Of-Week", "On Every", "On");
export const DefaultSpec: SpecType = new SpecType("default", "", "", "");