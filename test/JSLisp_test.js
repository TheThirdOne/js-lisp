'use strict';

var code    = require('../lib/code.js');
var input   = require('../lib/input.js');
var parser  = require('../lib/parser.js');
var codegen = require('../lib/codegen.js');
var int     = require('../lib/intermediate.js');

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
    test.expect(5);
    test.tokenTest = function(str,out){
      input.set(str);
      var tmp = [],
      t = parser.getTok();
      while(t.token !== 'EOF'){
        tmp.push(t);
        t = parser.getTok();
      }
      test.deepEqual(tmp,out,str);
    };
    test.parserTest = function(str,inter){
      input.set(str);
      test.deepEqual(parser.parseExprs(),int.fromString(inter),str);
    };
    test.codegenTest = function(str,out){
      input.set(str);
      var t = parser.parseExprs();
      t.unshift({token:'identifier',data:'do'});
      codegen(t);
      test.deepEqual(code.finish(),out,str);
      code.clear();
    };
    
    //basic tokenizer test: ensures all types of tokens can be parsed
    test.tokenTest('( ) ; a \n a "a\\"" 1.2 \'',[{ token: '(', index: 1 },
                                                 { token: ')', index: 3 },
                                                 { token: 'identifier', data: 'a', index: 11 },
                                                 { token: 'string', data: 'a\\"', primary: true, index: 17 },
                                                 { token: 'number', data: 1.2, primary: true, index: 21 },
                                                 { token: '\'', index:23}]);
    
    //tests special chars in comments and strings
    test.tokenTest('( (() ()) ) ; a )( \n a "a()()\\""',[{"token":"(","index":1},
                                                         {"token":"(","index":3},
                                                         {"token":"(","index":4},
                                                         {"token":")","index":5},
                                                         {"token":"(","index":7},
                                                         {"token":")","index":8},
                                                         {"token":")","index":9},
                                                         {"token":")","index":11},
                                                         {"token":"identifier","data":"a","index":22},
                                                         {"token":"string","data":"a()()\\\"","primary":true,"index":32}] );
    
    
    //basic parser test: ensures structures can generate correctly
    test.parserTest('(a b 1.23 "c" ((d e) f))(g h)','{"array":[{"index":2,"array":[{"token":"identifier","data":"a","index":2},{"token":"identifier","data":"b","index":4},{"token":"number","data":1.23,"primary":true,"index":9},{"token":"string","data":"c","primary":true,"index":13},{"index":16,"array":[{"index":17,"array":[{"token":"identifier","data":"d","index":17},{"token":"identifier","data":"e","index":19}]},{"token":"identifier","data":"f","index":22}]}]},{"index":26,"array":[{"token":"identifier","data":"g","index":26},{"token":"identifier","data":"h","index":28}]}]}');
    
    //arithmetic test
    test.codegenTest('(+ 1 2.1 1) (- 3 4 3) (* 5 6 5) (/ 7 8 7) (% 9 10 9)',
"var i = [], env = {};\n\
i[0] = 0;\n\
i[1] = (1 + 2.1 + 1);\n\
i[2] = (3 - 4 - 3);\n\
i[3] = (5 * 6 * 5);\n\
i[4] = (7 / 8 / 7);\n\
i[5] = (9 % 10 % 9);");

    //boolean test
    test.codegenTest('(> 0 1)(< 2 3)(>= 4 5)(<= 6 7)(& 8 9)(| 0 1)(! 2 3)',
"var i = [], env = {};\n\
i[0] = 0;\n\
i[1] = (0 > 1);\n\
i[2] = (2 < 3);\n\
i[3] = (4 >= 5);\n\
i[4] = (6 <= 7);\n\
i[5] = (8 && 9);\n\
i[6] = (0 || 1);\n\
i[7] = (2 || 3);\n\
i[8] = !i[7];");
  },
};
