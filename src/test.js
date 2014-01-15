function test(func,output,input){
  if(output.join(",")!==func(input).join(','))
    throw output + ", "+ input;
  return true;
}
function test_env(command,output){
  if(output!==run(parse(command)))
    throw output + ", "+ command;
  return true;
}

//cleaning
test(clean,["a","b","c","d","e","f"],"a b c d e f");         //basic
test(clean,["a","b","c","'d e'","f","g"],"a b c 'd e' f g"); //quotes
test(clean,["a","b","c","f","g"],"a b c ;d e\n f g");        //single comment
test(clean,["a","b","c","f","g"],"a b c #|d \n e|# f g");    //block comment
test(clean,["a","b","c","f","g"],"a b c #|d  'e|# f g");     //quote in block
test(clean,["a","b","c","'d;e'","f","g"],"a b c 'd;e' f g"); //comment in string

//parsing
test(parse,["do",['a','b','c']],"(a b c)"); //basic test
test(parse,["do",['a',['b','c',['d']],'e']],"(a (b c (d)) e)"); //basic stack
test(parse,["do",['a',[['b'],'c'],'d']],"(a ((b) c) d)"); //first function
test(parse,["do",['a','b','c']],"(a) (b) (c)"); //separate commands
test(parse,["do",['a',"'hello there'"]],"(a 'hello there')"); //strings ' 
test(parse,["do",['a','"hello there"']],'(a "hello there")'); //strings "

//biooleans
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