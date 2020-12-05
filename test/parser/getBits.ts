import {strict as assert} from 'assert';
import {getBits} from '../../src/parser/parser'

describe('getBits', () => {
    it('check bit status for spec 1-5/1', () => {
        const spec = getBits(1, 5, 1)
        assert.ok(spec.getBit(1))
        assert.ok(spec.getBit(2))
        assert.ok(spec.getBit(3))
        assert.ok(spec.getBit(4))
        assert.ok(spec.getBit(5))
        assert.ok(!spec.getBit(6))
        assert.ok(!spec.getBit(15))
        assert.ok(!spec.getBit(19))
        assert.ok(!spec.getBit(30))
    });
    it('check bit status for spec 1-5/2', () => {
        const spec = getBits(1, 5, 2)
        assert.ok(spec.getBit(1))
        assert.ok(!spec.getBit(2))
        assert.ok(spec.getBit(3))
        assert.ok(!spec.getBit(4))
        assert.ok(spec.getBit(5))
    });
    it('check bit status for spec 1-5/3', () => {
        const spec = getBits(1, 5, 3)
        assert.ok(spec.getBit(1))
        assert.ok(!spec.getBit(2))
        assert.ok(!spec.getBit(3))
        assert.ok(spec.getBit(4))
        assert.ok(!spec.getBit(5))
    });
    it('check bit status for spec 1-5/10', () => {
        const spec = getBits(1, 5, 10)
        assert.ok(spec.getBit(1))
        assert.ok(!spec.getBit(2))
        assert.ok(!spec.getBit(3))
        assert.ok(!spec.getBit(4))
        assert.ok(!spec.getBit(5))
    });
    it('check bit status for spec 0-59/1', () => {
        const spec = getBits(0, 59, 1)
        for (let i = 0; i <= 59; i++) {
            assert.ok(spec.getBit(i))
        }
    });
    it('check bit status for spec 0-59/5', () => {
        const spec = getBits(0, 59, 5)
        for (let i = 0; i <= 59; i += 5) {
            assert.ok(spec.getBit(i))
        }
    });
    it('check bit status for spec 0-59/15', () => {
        const spec = getBits(0, 59, 15)
        for (let i = 0; i <= 59; i += 15) {
            assert.ok(spec.getBit(i))
        }
    });
});
