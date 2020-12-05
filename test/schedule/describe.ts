import {strict as assert} from 'assert';
import {parse} from '../../src/parser/parser'

class TestCase {
    id: string;
    cronSpec: string;
    outputDescription: string;

    constructor(id: string, cronSpec: string, outputDescription: string) {
        this.id = id;
        this.cronSpec = cronSpec;
        this.outputDescription = outputDescription;
    }
}

const testCases = [
    new TestCase(
        "1",
        "0/15 * * * *",
        "Every 15th Minute from 0 through 59",
    ),
    new TestCase(
        "6",
        "20-35/15 * * * *",
        "Every 15th Minute from 20 through 35"
    ),
    new TestCase(
        "7",
        "0 0 9 4-10 *",
        "At Minute 0 Past Hour 0 On Day-Of-Month 9 Every Month from April through October"
    ),
    new TestCase(
        "8",
        "0 0 */5 4,8,10 1",
        "At Minute 0 Past Hour 0 Every 5th Day-Of-Month from 1 through 31 In Month April, August and October On Day-Of-Week Monday"
    ),
    new TestCase(
        "9",
        "0 0 */5 10 1",
        "At Minute 0 Past Hour 0 Every 5th Day-Of-Month from 1 through 31 In Month October On Day-Of-Week Monday"
    ),
    new TestCase(
        "10",
        "0 0 * 2 1",
        "At Minute 0 Past Hour 0 In Month February On Day-Of-Week Monday"
    ),
    new TestCase(
        "11",
        "0 0 * 2 1/2",
        "At Minute 0 Past Hour 0 In Month February Every 2nd Day-Of-Week from Monday through Saturday"
    ),
    new TestCase(
        "12",
        "* * * * *",
        "Every minute"
    ),
    new TestCase(
        "13",
        "* * 29 2 *",
        "Every minute On Day-Of-Month 29 In Month February"
    ),
    new TestCase(
        "14",
        "* 12-18/6,3,9 29 2 *",
        "Every minute Every 6th Hour from 12 through 18, 3 and 9 On Day-Of-Month 29 In Month February"
    ),

];


describe('Describe', () => {
    it('test all the cron test cases', () => {
        testCases.forEach(testCase => {
            const schedule = parse(testCase.cronSpec);
            assert.equal(schedule.describe(), testCase.outputDescription)
        });
    });
});
