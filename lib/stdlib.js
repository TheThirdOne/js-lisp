var code = require('./code.js');
var stdlib = exports;
stdlib['+'] = {premap:true,codegen:function(arr){return code.writeLine('('+arr.join(' + ')+');');}};
stdlib['*'] = {premap:true,codegen:function(arr){return code.writeLine('('+arr.join(' * ')+');');}};
stdlib.call = {premap:true,codegen:function(arr){return code.writeLine(arr.shift()+"(" + arr.join(', ') + ');');}};
stdlib.do   = {premap:true,codegen:function(arr){return arr[arr.length-1];}};
stdlib.js   = {codegen:function(arr){
              for(var i in arr){
                if(!(arr[i].primary || arr[i].token === 'identifier')){throw 'Unexpected non-primary';}
              }
              return code.writeLine(arr[0].data + '.bind(' + arr[1].data + ');');
            }};
stdlib.import = {codegen:function(arr){
                if(arr[0].token !== 'string'){throw "Cannot dynamically compute imports";}
                if(process.browser){
                  require(arr[0].data)(stdlib, code);
                }else{
                  require(process.cwd()+'/'+arr[0].data)(stdlib, code);
                }
                return undefined;
              }};
stdlib.if   = {codegen:function(arr,codegen){
              var out = [];
              out[0] = codegen(arr[0],codegen);
              code.slice();
              code.writeStr('if('+out[0]+'){\n');
              out[1] = codegen(arr[1],codegen);
              if(arr[2]){
                code.slice();
                code.writeStr('}else{\n');
                out[2] = codegen(arr[2],codegen);
                code.slice();
                code.writeStr('}\n');
              }
              return code.writeLine('('+out[0]+')?'+out[1]+':'+out[2]);
            }};
stdlib.let = {codegen:function(arr,codegen){
              var out = '';
              out += '(function(';
              if(arr[0].length === undefined){throw "Lacks argument list";}
              var t = [[],[]], tmp = '';
              for(var i in arr[0]){
                if(arr[0][i].token !== 'identifier' && arr[0][i].length === undefined){
                  throw 'Unexpected token: ' + arr[0][i].data;
                }
                t[0][i] = arr[0][i].data || arr[0][i][0].data;
                t[1][i] = arr[0][i][0] && arr[0][i][1];
              }
              out += t[0].join(', ');
              tmp = t[0].map(function(a){return 'env["'+a+'"] = ' + a + ';';}).join('');
              t = t[1].map(function(a){return codegen(a,codegen);}).join(', ');
              
              
              arr.shift();
              out += '){var env = {}, i = [];' + tmp;
              code.writeLine(out);
              tmp = arr.pop();
              arr.map(function(a){return codegen(a,codegen);});
              tmp = codegen(tmp,codegen);
              code.slice(-1);
              code.writeStr('return '+tmp+';})(' + t +  ')\n');
              return ;
            }};
stdlib.def  = {codegen:function(arr,codegen){
                if(arr[0].token !== 'identifier'){throw 'Unexpected token: ' + arr[0].data;}
                return code.writeLine('env["'+arr[0].data+'"] = ' + codegen(arr[1],codegen) + ';'); //env[identifier] = value
              }};
stdlib.defun  = {codegen:function(arr,codegen){
                var out = '', tmp = '';
                if(arr[0].token === 'identifier'){
                  out += 'env["'+arr[0].data+'"] =';
                }
                out += 'function(';
                arr.shift();
                if(arr[0].length){
                  for(var i in arr[0]){
                    if(arr[0][i].token !== 'identifier'){throw 'Unexpected token: ' + arr[0][i].data;}
                  }
                  out += arr[0].map(function(a){return a.data;}).join(', ');
                  tmp = arr[0].map(function(a){return 'env["'+a.data+'"] = ' + a.data + ';';}).join('');
                }
                if(arr[0].length !== undefined){
                  arr.shift();
                }
                out += '){var env = {}, i = [];' + tmp;
                out = code.writeLine(out);
                tmp = arr.pop();
                arr.map(function(a){return codegen(a,codegen);});
                tmp = codegen(tmp,codegen);
                code.slice(-1);
                code.writeStr('return '+tmp+';}\n');
                return out;
              }};
