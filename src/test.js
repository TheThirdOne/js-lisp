function test(func,output,input){
  if(output.join(",")!==func(input).join(','))
    throw output + ", "+ input;
  return true;
}
function test_env(command,output){
  if(output!==jslisp.runtime.run(jslisp.compiler.parse(command)))
    throw output + ", "+ command;
  return true;
}

//cleaning
test(jslisp.compiler.clean,["a","b","c","d","e","f"],"a b c d e f");         //basic
test(jslisp.compiler.clean,["a","b","c","'d e'","f","g"],"a b c 'd e' f g"); //quotes
test(jslisp.compiler.clean,["a","b","c","f","g"],"a b c ;d e\n f g");        //single comment
test(jslisp.compiler.clean,["a","b","c","f","g"],"a b c #|d \n e|# f g");    //block comment
test(jslisp.compiler.clean,["a","b","c","f","g"],"a b c #|d  'e|# f g");     //quote in block
test(jslisp.compiler.clean,["a","b","c","'d;e'","f","g"],"a b c 'd;e' f g"); //comment in string

//parsing
test(jslisp.compiler.parse,["do",['a','b','c']],"(a b c)"); //basic test
test(jslisp.compiler.parse,["do",['a', 1, 2]],"(a 1 2)"); //basic numbers test
test(jslisp.compiler.parse,["do",['a',['b','c',['d']],'e']],"(a (b c (d)) e)"); //basic stack
test(jslisp.compiler.parse,["do",['a',[['b'],'c'],'d']],"(a ((b) c) d)"); //first function
test(jslisp.compiler.parse,["do",['a','b','c']],"(a) (b) (c)"); //separate commands
test(jslisp.compiler.parse,["do",['a','STRING:hello there']],"(a 'hello there')"); //strings ' 
test(jslisp.compiler.parse,["do",['a','STRING:hello there']],'(a "hello there")'); //strings "

//booleans
test_env('(bool 3)',true);
test_env('(bool 0)',false);
test_env('(> 3 2 1)',true);
test_env('(> 3 2 2)',false);
test_env('(>= 3 2 2)',true);
test_env('(< 3 2 1)',false);
test_env('(< 1 2 3)',true);
test_env('(< 1 2 2)',false);
test_env('(<= 1 2 2)',true);
test_env('(= 1 1 1)',true);
test_env('(= 2 1 1)',false);
test_env('(not 1 1)',false);
test_env('(not 0 1)',true);
test_env('(or 1 0 4)',1);
test_env('(or 0 0 4)',4);
test_env('(or 0 0 0)',false);
test_env('(and 1 1 5 2)',true);

//control structure
test_env('(if 1 1 2)',1);
test_env('(if 0 1 2)',2);

console.log('Tests complete');