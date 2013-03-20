'use strict';

var coffeeify = require('coffeeify');

module.exports = function (file) {
  return coffeeify(file);
};

module.exports.__defineSetter__('root', function (root) { coffeeify.root = root; });
