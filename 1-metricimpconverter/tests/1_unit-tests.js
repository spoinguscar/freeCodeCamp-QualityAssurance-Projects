const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');
let convertHandler = new ConvertHandler();


suite('Unit Tests', function(){
  test('Read whole number input', () => assert.equal(convertHandler.getNum('32L'), 32));
  test('Read decimal number input', () => assert.equal(convertHandler.getNum('3.2mi'), 3.2));
  test('Read fractional input', () => assert.equal(convertHandler.getNum('1/2kg'), 0.5));
  test('Read fractional input with decimal', () => assert.equal(convertHandler.getNum('3.5/7km'), 0.5));
  test('Error on double-fraction', () => assert.equal(convertHandler.getNum('3/2/3lbs'), 'invalid number'));
  test('Default to 1 when no number is provided', () => assert.equal(convertHandler.getNum('kg'), 1));
  test('Read valid units', () => assert.equal(convertHandler.getUnit('32L'), 'L'));
  test('Error on invalid unit', () => assert.equal(convertHandler.getUnit('32g'), 'invalid unit'));
  test('Return correct return unit', () => assert.equal(convertHandler.getReturnUnit('mi'), 'km'));
  test('Return spelled-out string unit', () => assert.equal(convertHandler.spellOutUnit('kg'), 'kilograms'));
  test('Convert gal to L', () => assert.equal(convertHandler.convert(1, 'gal'), 3.78541));
  test('Convert L to gal', () => assert.equal(convertHandler.convert(1, 'L'), 0.26417));
  test('Convert mi to km', () => assert.equal(convertHandler.convert(1, 'mi'), 1.60934));
  test('Convert km to mi', () => assert.equal(convertHandler.convert(1, 'km'), 0.62137));
  test('Convert lbs to kg', () => assert.equal(convertHandler.convert(1, 'lbs'), 0.45359));
  test('Convert kg to lbs', () => assert.equal(convertHandler.convert(1, 'kg'), 2.20462));
});