'use strict';

var JSLisp = require('../lib/JSLisp.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.compiler = {
  setUp: function(done) {
    // setup here
    done();
  },
  'no args': function(test) {
    test.expect(32);
    // tests here
    test.arr_equal = function(actual,expected,message){
      test.equal(actual.toString(),expected.toString(),message);
    };
    
    //cleaning
    test.arr_equal(JSLisp.compiler.clean("a b c d e f"),["a","b","c","d","e","f"]);         //basic
    test.arr_equal(JSLisp.compiler.clean("a b c 'd e' f g"),["a","b","c","'d e'","f","g"]); //quotes
    test.arr_equal(JSLisp.compiler.clean("a b c ;d e\n f g"),["a","b","c","f","g"]);        //single comment
    test.arr_equal(JSLisp.compiler.clean("a b c #|d \n e|# f g"),["a","b","c","f","g"]);    //block comment
    test.arr_equal(JSLisp.compiler.clean("a b c #|d  'e|# f g"),["a","b","c","f","g"]);     //quote in block
    test.arr_equal(JSLisp.compiler.clean("a b c 'd;e' f g"),["a","b","c","'d;e'","f","g"]); //comment in string
    
    //parsing
    test.arr_equal(JSLisp.compiler.parse("(a b c)"),["do",['a','b','c']]); //basic test
    test.arr_equal(JSLisp.compiler.parse("(a 1 2)"),["do",['a', 1, 2]]); //basic numbers test
    test.arr_equal(JSLisp.compiler.parse("(a (b c (d)) e)"),["do",['a',['b','c',['d']],'e']]); //basic stack
    test.arr_equal(JSLisp.compiler.parse("(a ((b) c) d)"),["do",['a',[['b'],'c'],'d']]); //first function
    test.arr_equal(JSLisp.compiler.parse("(a) (b) (c)"),["do",['a','b','c']]); //separate commands
    test.arr_equal(JSLisp.compiler.parse("(a 'hello there')"),["do",['a','STRING:hello there']]); //strings ' 
    test.arr_equal(JSLisp.compiler.parse('(a "hello there")'),["do",['a','STRING:hello there']]); //strings "
    
    //booleans
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(bool 3)')),true);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(bool 0)')),false);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(> 3 2 1)')),true);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(> 3 2 2)')),false);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(>= 3 2 2)')),true);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(< 3 2 1)')),false);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(< 1 2 3)')),true);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(< 1 2 2)')),false);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(<= 1 2 2)')),true);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(= 1 1 1)')),true);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(= 2 1 1)')),false);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(not 1 1)')),false);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(not 0 1)')),true);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(or 1 0 4)')),1);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(or 0 0 4)')),4);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(or 0 0 0)')),false);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(and 1 1 5 2)')),true);
    
    //control structure
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(if 1 1 2)')),1);
    test.equal(JSLisp.runtime.run(JSLisp.compiler.parse('(if 0 1 2)')),2);
    test.done();
  
  },
};
