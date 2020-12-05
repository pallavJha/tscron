import {strict as assert} from 'assert';
import {parse} from '../../src/parser/parser'
import {NoReachableDateError} from "../../src/schedule/schedule";

class TestCase {
    id: string;
    inputTime: Date;
    cronSpec: string;
    outputTime: Date;
    fail: boolean;

    constructor(id: string, inputTime: Date, cronSpec: string, outputTime: Date, fail: boolean) {
        this.id = id;
        this.inputTime = inputTime;
        this.cronSpec = cronSpec;
        this.outputTime = outputTime;
        this.fail = fail;
    }
}

const testCases = [
    new TestCase(
        "1",
        new Date(2012, 6, 9, 14, 45, 0, 0),
        "0/15 * * * *",
        new Date(2012, 6, 9, 15, 0, 0, 0),
        false
    ),
    new TestCase(
        "2",
        new Date(2012, 6, 9, 14, 59, 0, 0),
        "0/15 * * * *",
        new Date(2012, 6, 9, 15, 0, 0, 0),
        false
    ),
    new TestCase(
        "3",
        new Date(2012, 6, 9, 14, 59, 59, 0),
        "0/15 * * * *",
        new Date(2012, 6, 9, 15, 0, 0, 0),
        false
    ),
    new TestCase(
        "4",
        new Date(2012, 6, 9, 23, 46, 0, 0),
        "*/15 * * * *",
        new Date(2012, 6, 10, 0, 0, 0, 0),
        false
    ),
    new TestCase(
        "5",
        new Date(2012, 6, 9, 23, 46, 0, 0),
        "*/15 * * * *",
        new Date(2012, 6, 10, 0, 0, 0, 0),
        false
    ),
    new TestCase(
        "6",
        new Date(2012, 6, 9, 23, 45, 0, 0),
        "20-35/15 * * * *",
        new Date(2012, 6, 10, 0, 20, 0, 0),
        false
    ),
    new TestCase(
        "7",
        new Date(2012, 6, 9, 23, 35, 0, 0),
        "0 0 9 4-10 *",
        new Date(2012, 7, 9, 0, 0, 0, 0),
        false
    ),
    new TestCase(
        "8",
        new Date(2012, 6, 9, 23, 35, 0, 0),
        "0 0 */5 4,8,10 1",
        new Date(2012, 7, 1, 0, 0, 0, 0),
        false
    ),
    new TestCase(
        "9",
        new Date(2012, 6, 9, 23, 35, 0, 0),
        "0 0 */5 10 1",
        new Date(2012, 9, 1, 0, 0, 0, 0),
        false
    ),
    new TestCase(
        "10",
        new Date(2012, 6, 9, 23, 35, 0, 0),
        "0 0 * 2 1",
        new Date(2013, 1, 4, 0, 0, 0, 0),
        false
    ),
    new TestCase(
        "11",
        new Date(2012, 6, 9, 23, 35, 0, 0),
        "0 0 * 2 1/2",
        new Date(2013, 1, 1, 0, 0, 0, 0),
        false
    ),
    new TestCase(
        "12",
        new Date(2012, 11, 31, 23, 59, 0, 0),
        "* * * * *",
        new Date(2013, 0, 1, 0, 0, 0, 0),
        false
    ),
    new TestCase(
        "13",
        new Date(2012, 6, 9, 23, 35, 0, 0),
        "* * 29 2 *",
        new Date(2016, 1, 29, 0, 0, 0, 0),
        false
    ),
    new TestCase(
        "14",
        new Date(2012, 6, 9, 23, 35, 0, 0),
        "* * 29 2 *",
        new Date(2016, 1, 29, 0, 0, 0, 0),
        false
    ),
    new TestCase(
        "15",
        new Date(2012, 6, 9, 23, 35, 0, 0),
        "* * 29 2 *",
        new Date(2016, 1, 29, 0, 0, 0, 0),
        false
    ),
    new TestCase(
        "16 - Unsatisfiable",
        new Date(2012, 6, 9, 23, 35, 0, 0),
        "* * 31 2 *",
        new Date(),
        true
    ),
    new TestCase(
        "17 - Unsatisfiable",
        new Date(2012, 6, 9, 23, 35, 0, 0),
        "* * 31 4 *",
        new Date(),
        true
    ),

];


describe('Next', () => {
    it('test all the cron test cases', () => {
        testCases.forEach(testCase => {
            const schedule = parse(testCase.cronSpec);
            if (testCase.fail) {
                let errorHandled = false;
                try {
                    schedule.next(testCase.inputTime)
                } catch (e) {
                    assert.deepEqual(e, NoReachableDateError);
                    errorHandled = true
                }
                assert.ok(errorHandled)
            } else {
                assert.deepEqual(schedule.next(testCase.inputTime), testCase.outputTime, "For test case #" + testCase.id)
            }
        });
    });
});
