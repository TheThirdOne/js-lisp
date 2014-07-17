exports.throw = function(str,i){
  throw str+'at char:'+i;
};
exports.unexpectedToken = function(tok){
  exports.throw("Unexpected token: " + (tok.data || tok.token),tok.index);
};