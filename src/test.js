function test(func,output,input){
  if(output.join(",")!==func(input).join(','))
    throw output + ", "+ input;
  return true;
}
test(clean,["a","b","c","d","e","f"],"a b c d e f");         //basic
test(clean,["a","b","c","'d e'","f","g"],"a b c 'd e' f g"); //quotes
test(clean,["a","b","c","f","g"],"a b c ;d e\n f g");        //single comment
test(clean,["a","b","c","f","g"],"a b c #|d \n e|# f g");    //block comment
test(clean,["a","b","c","f","g"],"a b c #|d  'e|# f g");     //quote in block
test(clean,["a","b","c","'d;e'","f","g"],"a b c 'd;e' f g"); //comment in string
console.log('Tests complete');