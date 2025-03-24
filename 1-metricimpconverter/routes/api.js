'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');
module.exports = function (app) {
  let convertHandler = new ConvertHandler();
  app.get('/api/convert', (req, res) => {
    let input = req.query.input;
    let initNum = convertHandler.getNum(input);
    let initUnit = convertHandler.getUnit(input);
    if (initNum === 'invalid number' && initUnit === 'invalid unit') return res.json({ error: 'invalid number and unit' });
    if (initNum === 'invalid number') return res.json({ error: 'invalid number' });
    if (initUnit === 'invalid unit') return res.json({ error: 'invalid unit' });
    let returnNum = convertHandler.convert(initNum, initUnit);
    let returnUnit = convertHandler.getReturnUnit(initUnit);
    let string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
    res.json({ initNum, initUnit, returnNum, returnUnit, string });
  });
};
