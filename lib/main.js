var parser  = require('./parser.js');
var codegen = require('./codegen.js');
var code    = require('./code.js');

codegen(parser.parseExpr());
console.log(code.finish());
