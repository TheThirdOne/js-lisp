function test(output,input){
  if(output.join(",")!==clean(input).join(','))
    throw output + ", "+ input;
  return true;
}
test(["a","b","c","d","e","f"],"a b c d e f");
test(["a","b","c","'d e'","f","g"],"a b c 'd e' f g");
console.log('Tests complete');