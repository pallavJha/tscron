import {strict as assert} from 'assert';
import {fieldDefinitions, getRange} from '../../src/parser/parser'

describe('getRange', () => {
    it('* for minute spec', () => {
        const spec = getRange("*", fieldDefinitions[0])
        for (let i = 0; i <= 59; i++) {
            assert.ok(spec.getBit(i))
        }
    });
    it('?/2 for minute spec', () => {
        const spec = getRange("?/2", fieldDefinitions[0])
        for (let i = 0; i <= 59; i += 2) {
            assert.ok(spec.getBit(i))
        }
    });
    it('1-30/2 for minute spec', () => {
        const spec = getRange("1-30/2", fieldDefinitions[0])
        for (let i = 1; i <= 30; i += 2) {
            assert.ok(spec.getBit(i))
        }
        for (let i = 0; i <= 30; i += 2) {
            assert.ok(!spec.getBit(i))
        }
        for (let i = 31; i <= 59; i++) {
            assert.ok(!spec.getBit(i))
        }
    });
    it('5/5 must convert to 5-59/5 for minute spec', () => {
        const spec1 = getRange("5/5", fieldDefinitions[0])
        const spec2 = getRange("5-59/5", fieldDefinitions[0])
        for (let i = 5; i <= 59; i += 5) {
            assert.ok(spec1.getBit(i))
            assert.ok(spec2.getBit(i))
        }
    });
    it('spec = 1-15 without any step for minute spec', () => {
        const spec = getRange("1-15", fieldDefinitions[0])
        for (let i = 1; i <= 15; i += 1) {
            assert.ok(spec.getBit(i))
        }
    });
    it('single digit spec = 18 without any step for minute spec', () => {
        const spec = getRange("18", fieldDefinitions[0])
        assert.ok(spec.getBit(18))
        for (let i = 0; i <= 59; i += 1) {
            if (i !== 18) {
                assert.ok(!spec.getBit(i))
            }
        }
    });
    it('too many hyphens in the spec', () => {
        let errorOccurred = false
        try {
            getRange("18-19-20/21", fieldDefinitions[0])
        } catch (e) {
            assert.deepEqual(e, new Error("Too many hyphens: Only use one hyphen for setting the range, like, 1-15"))
            errorOccurred = true
        }
        assert.ok(errorOccurred)
    });
    it('too many slashes or steps in the spec', () => {
        let errorOccurred = false
        try {
            getRange("18-20/21/12", fieldDefinitions[0])
        } catch (e) {
            assert.deepEqual(e, new Error("Too many Slashes: Only use one slash for setting the range, like, 1-15/2 or 3/5"))
            errorOccurred = true
        }
        assert.ok(errorOccurred)
    });
    it('0 as spec for day of month section', () => {
        let errorOccurred = false
        try {
            getRange("0", fieldDefinitions[2])
        } catch (e) {
            assert.deepEqual(e, new Error("Beginning of range 0 below minimum 1: 0"))
            errorOccurred = true
        }
        assert.ok(errorOccurred)
    });
    it('32 as spec for day of month section', () => {
        let errorOccurred = false
        try {
            getRange("32", fieldDefinitions[2])
        } catch (e) {
            assert.deepEqual(e, new Error("End of range 32 above maximum 31: 32"))
            errorOccurred = true
        }
        assert.ok(errorOccurred)
    });
    it('1-0 as spec for day of month section', () => {
        let errorOccurred = false
        try {
            getRange("1-0", fieldDefinitions[2])
        } catch (e) {
            assert.deepEqual(e, new Error("Beginning of range 1 beyond end of range 0: 1-0"))
            errorOccurred = true
        }
        assert.ok(errorOccurred)
    });
    it('Step = 0 for the spec 1-15/0 for day of month section', () => {
        let errorOccurred = false
        try {
            getRange("1-15/0", fieldDefinitions[2])
        } catch (e) {
            assert.deepEqual(e, new Error("Step of range should be a positive number: 1-15/0"))
            errorOccurred = true
        }
        assert.ok(errorOccurred)
    });
});
