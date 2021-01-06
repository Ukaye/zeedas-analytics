let functions = {};

functions.sumArrayObjectsByKey = (array, key) => array.reduce((a, b) => a + Number(b[key] || 0), 0);

Number.prototype.round = function (p) {
    p = p || 10;
    return parseFloat(parseFloat(this).toFixed(p));
};

String.prototype.round = function (p) {
    p = p || 10;
    return parseFloat(this).toFixed(p);
};

module.exports = functions;