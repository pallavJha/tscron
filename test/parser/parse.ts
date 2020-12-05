import {strict as assert} from 'assert';
import {parse, ParseError} from '../../src/parser/parser'

describe('parse', () => {
    it('check the bits for the cron 1 2 3 4 5', () => {
        const schedule = parse("1 2 3 4 5");
        assert.ok(schedule.minute.getBit(1));
        assert.ok(schedule.hour.getBit(2));
        assert.ok(schedule.dom.getBit(3));
        assert.ok(schedule.month.getBit(4));
        assert.ok(schedule.dow.getBit(5))
    });
    it('check the bits for the cron 1 2 3 4 5', () => {
        const schedule = parse("1 2 * 4 *");
        assert.ok(schedule.minute.getBit(1));
        assert.ok(schedule.hour.getBit(2));
        assert.ok(schedule.dom.getBit(3));
        assert.ok(schedule.month.getBit(4));
        assert.ok(schedule.dow.getBit(5))
    });
    it('blank string for cron expression ', () => {
        let errorOccurred = false;
        try {
            parse("")
        } catch (e) {
            assert.deepEqual(e, ParseError);
            errorOccurred = true
        }
        assert.ok(errorOccurred)
    });
    it('cron expression with invalid number of fields ', () => {
        const expressions = ["* * * *", "* * * * * *"];
        expressions.forEach(value => {
            let errorOccurred = false;
            try {
                parse(value)
            } catch (e) {
                assert.deepEqual(e, ParseError);
                errorOccurred = true
            }
            assert.ok(errorOccurred)
        })
    });
});
