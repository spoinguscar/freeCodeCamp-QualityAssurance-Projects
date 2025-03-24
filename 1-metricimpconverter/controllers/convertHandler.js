function ConvertHandler() {
  this.getNum = function (input) {
    let result = input.match(/[.\d\/]+/g);
    if (!result) return 1;
    result = result[0];
    if (result.includes('/')) {
      let fractions = result.split('/');
      if (fractions.length !== 2) return 'invalid number';
      result = parseFloat(fractions[0]) / parseFloat(fractions[1]);
    } else {
      result = parseFloat(result);
    }
    return isNaN(result) ? 'invalid number' : result;
  };

  this.getUnit = function (input) {
    let result = input.match(/[a-zA-Z]+/g);
    if (!result) return 'invalid unit';
    result = result[0].toLowerCase();
    const validUnits = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
    return validUnits.includes(result) ? (result === 'l' ? 'L' : result) : 'invalid unit';
  };

  this.getReturnUnit = function (initUnit) {
    const unitMap = { gal: 'L', L: 'gal', mi: 'km', km: 'mi', lbs: 'kg', kg: 'lbs' };
    return unitMap[initUnit] || 'invalid unit';
  };

  this.spellOutUnit = function (unit) {
    const spellMap = { gal: 'gallons', L: 'liters', mi: 'miles', km: 'kilometers', lbs: 'pounds', kg: 'kilograms' };
    return spellMap[unit] || 'invalid unit';
  };

  this.convert = function (initNum, initUnit) {
    const conversionRates = { gal: 3.78541, L: 1 / 3.78541, mi: 1.60934, km: 1 / 1.60934, lbs: 0.453592, kg: 1 / 0.453592 };
    return parseFloat((initNum * conversionRates[initUnit]).toFixed(5));
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
}

module.exports = ConvertHandler;