var stdlib = require('./stdlib.js');
var types = require('./types.js');
var codegen = function(expr){
  if(expr.length === 0)return 'i[0]'
  if(!expr.length){
    if(!types[expr.token])
      throw "Nonexistent Token";  //should not be called if parsed with this parser
    return types[expr.token].codegen(expr.data);
  }
  var temp = expr.shift();
  if(temp.token === 'identifier' && stdlib[temp.data]){
    var arr = expr;
    if(stdlib[temp.data].premap){
      arr = arr.map(function(a){return codegen(a,codegen)});
    }
    return stdlib[temp.data].codegen(arr,codegen);
  }
  expr.unshift(temp);
  return stdlib.call.codegen(expr.map(function(a){return codegen(a,codegen)}),codegen);
};
module.exports = codegen;