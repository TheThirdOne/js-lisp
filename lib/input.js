var arr = '()'.split('');
var i = 0;
exports.getChar = function(){ //temporary
  i++;
  return arr.shift() || '';
}
exports.returnChar = function(a){
  arr.unshift(a);
  i--;
}
exports.getIndex = function(){
  return i;
}
