import {strict as assert} from 'assert';
import {Range} from '../../src/parser/parser'
import {MinuteSpec} from "../../src/parser/spec_types";


describe('Range', () => {
    it('constructor', () => {
        const range = new Range(1, 2, MinuteSpec)
        assert.deepEqual(range.start, 1)
        assert.deepEqual(range.end, 2)
    });
});
