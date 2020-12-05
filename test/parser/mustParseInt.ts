import {strict as assert} from 'assert';
import {mustParseInt} from '../../src/parser/parser'

describe('mustParseInt', () => {
    it('1 Digit Positive Number', () => {
        assert.deepEqual(2, mustParseInt("2"))
    });
    it('2 Digit Positive Number', () => {
        assert.deepEqual(22, mustParseInt("22"))
    });
    it('1 Digit Negative Number', () => {
        // TODO: The error messages are not being test, only the error thrown is being tested
        // TODO: Need to Look into it.
        assert.throws(() => mustParseInt("-2"), Error, "Negative numbers are not allowed in the cron expression")
    });
    it('2 Digit Negative Number', () => {
        assert.throws(() => mustParseInt("-22"), Error, "Negative numbers are not allowed in the cron expression")
    });
});
