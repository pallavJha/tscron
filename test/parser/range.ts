import {strict as assert} from 'assert';
import {Range} from '../../src/parser/parser'


describe('Range', () => {
    it('constructor', () => {
        const range = new Range(1, 2)
        assert.deepEqual(range.start, 1)
        assert.deepEqual(range.end, 2)
    });
});
