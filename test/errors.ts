import {strict as assert} from 'assert';
import {InvalidBitError} from "../src/parser/spec";
import {ParseError} from "../src/parser/parser";
import {InvalidPositionError} from "../src/schedule/schedule";

describe('Error Initialization', () => {
    it('invalidBitError', () => {
        assert.deepEqual(InvalidBitError, new Error("Indexes only between [0, 59] can be set"))
    });
    it('ParseError', () => {
        assert.deepEqual(ParseError, new Error("invalid format for the cron, follow * * * * *"))
    });
    it('InvalidPositionError', () => {
        assert.deepEqual(InvalidPositionError, new Error("invalid position for the Spec Schedule, must be between 0-5 inclusive"))
    });
});
