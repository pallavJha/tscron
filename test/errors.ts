import {strict as assert} from 'assert';
import {InvalidBitError} from "../src/parser/number64";
import {ParseError} from "../src/parser/parser";
import {InvalidPositionError} from "../src/schedule/schedule";

describe('Error Initialization', () => {
    describe('invalidBitError', () => {
        it('should initialized with correct message', () => {
            assert.deepEqual(InvalidBitError, new Error("Indexes only between [0, 59] can be set"))
        });
    });
    describe('ParseError', () => {
        it('should initialized with correct message', () => {
            assert.deepEqual(ParseError, new Error("invalid format for the cron, follow * * * * *"))
        });
    });
    describe('InvalidPositionError', () => {
        it('should initialized with correct message', () => {
            assert.deepEqual(InvalidPositionError, new Error("invalid position for the Spec Schedule, must be between 0-5 inclusive"))
        });
    });
});
