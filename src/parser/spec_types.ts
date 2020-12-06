// SpecType represents the type of the Spec
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

// MinuteSpec represents the Minute Spec
export const MinuteSpec: SpecType = new SpecType("minute", "Minute", "Every", "At");
// HourSpec represents the Hour Spec
export const HourSpec: SpecType = new SpecType("hour", "Hour", "Past", "Past");
// DayOfTheMonthSpec represents the DayOfTheMonth Spec
export const DayOfTheMonthSpec: SpecType = new SpecType("dom", "Day-Of-Month", "On Every", "On");
// MonthSpec represents the Month Spec
export const MonthSpec: SpecType = new SpecType("month", "Month", "In Every", "In");
// DayOfTheWeekSpec represents the DayOfTheWeek Spec
export const DayOfTheWeekSpec: SpecType = new SpecType("dow", "Day-Of-Week", "On Every", "On");
// DefaultSpec represents the Default Spec
export const DefaultSpec: SpecType = new SpecType("default", "", "", "");
