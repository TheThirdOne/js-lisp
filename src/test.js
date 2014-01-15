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

test(parse,["do",['a','b','c']],"(a b c)"); //basic test
test(parse,["do",['a',['b','c',['d']],'e']],"(a (b c (d)) e)"); //basic stack
test(parse,["do",['a',[['b'],'c'],'d']],"(a ((b) c) d)"); //first function
test(parse,["do",['a','b','c']],"(a) (b) (c)"); //separate commands
test(parse,["do",['a',"'hello there'"]],"(a 'hello there')"); //strings ' 
test(parse,["do",['a','"hello there"']],'(a "hello there")'); //strings "
console.log('Tests complete');