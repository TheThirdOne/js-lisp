
var code = '0;\n', i = 1;


exports.writeLine = function(str){
  code += str + '\n';
  return 'i[' + i++ + ']';
}
exports.getLine = function(){
  return i;
}
exports.get = function(){
  return code.slice(0,-1);
}
exports.finish = function(){
  return 'var i = [], env = {};\n'+exports.get().split('\n').map(function(a,b){return 'i['+b+'] = '+a}).join('\n');
}
exports.writeStr = function(str){
  code += str;
}
exports.slice = function(a){
  code = code.slice(0,a||-1);
}

