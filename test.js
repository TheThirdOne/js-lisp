function getTok(){
  var lastChar = getChar();
  
  while(!!lastChar.match(/\s/)){ //trim whitespace
    lastChar = getChar();
  }
  if(lastChar === ';'){ //comments
    while(lastChar !== '' && lastChar !== '\n'){
      lastChar = getChar();
    }
    returnChar(lastChar);
    return getTok();
  }
  if(lastChar === ''){ //pretty obvious stuff here
    return {token:'EOF'};
  }
  if(lastChar === '('){
    return {token:'(',index:getIndex()};
  }
  if(lastChar === ')'){
    return {token:')',index:getIndex()};
  }
  if(lastChar === '\''){
    return {token:'\'',index:getIndex()};
  }
  
  if(!!lastChar.match(/[^"0-9]/)){ //identifiers
    return {token: 'identifier',
            data:   getRest(/[^()'"\s]/,lastChar),
            index:  getIndex()};
  }
  if(!!lastChar.match(/[0-9]/)){ //numbers
    return clean({token: 'number',
            data:   getRest(/[0-9\.]/,lastChar),
            primary: true, index:getIndex()});
  }
  if(lastChar === '"'){   //Strings
    lastChar = getChar();
    var out = "";
    var escaping = false;
    while(lastChar !== '"' || escaping){
      if(lastChar === ''){
        throw "Unexpected EOF";
      }
      
      out += lastChar;
      
      escaping = lastChar === '\\' && !escaping;
      lastChar = getChar();
    }
    return clean({token: 'string',
            data: out, primary:true,
            index:getIndex()});
  }
  return 'Unexpected character: ' + lastChar;
}
function clean(section){ //only really helps with numbers right now, but I'm running all primaries through it for safety
  if(section.token === 'number'){
    var decimal = section.data.indexOf('.');
    if(decimal !== -1){
      if(section.data.indexOf('.',decimal+1)!==-1){
        throw "Unnexpected second decimal place: " +
              section.data;
      }
    }
    section.data = parseFloat(section.data);
  }
  return section;
}
function getRest(condition,last){ //helpful to grap a bunch of characters matching a regex
  var out = last || getChar();
  var lastChar = getChar();
  while(!!lastChar.match(condition)){
    if(lastChar === ''){
      throw "Unexpected EOF";
    }
    out += lastChar;
    lastChar = getChar();
  }
  returnChar(lastChar);
  return out;
}
var a = function(){
  var arr = '()'.split('');
  var i = 0;
  return [function(){ //temporary
    i++;
    return arr.shift() || '';
  },
  function(a){
    arr.unshift(a);
    i--;
  },
  function(){
    return i;
  }];
}();
getChar = a[0];
returnChar = a[1];
getIndex = a[2];

function parseExpr(tok){ //parses from ( to ) unless first token is a primary
  var t = tok || getTok();
  if(t.token !== '('){
    if(!t.primary && t.token !== '\''){
      throw "Unexpected token: " + (t.data || t.token);
    }
    if(t.token === '\''){
      return parseList(t);
    }
    return t;
  }
  t = getTok();
  var out = [];
  while(t.token !== ')'){
    if(t.token === '(' || t.token === '\''){
      t = parseExpr(t);
    }
    out.push(t);
    t = getTok();
    if(t.token === 'EOF'){
      throw "Unexpected end of file";
    }
  }
  return out;
}
function parseList(tok){
  var t = tok || getTok();
  if(t.token !== '\''){
    throw "Unexpected token: " + (t.data || t.token);
  }
  var out = parseExpr();
  out.unshift({token:'identifier',data:'list'});
  return out;
}
function codegen(expr){
  if(!expr.length){
    if(!types[expr.token])
      throw "Nonexistent Token";  //should not be called if parsed with this parser
    return types[expr.token].codegen(expr.data);
  }
  var temp = expr.shift();
  if(temp.token === 'identifier' && stdlib[temp.data]){
    var arr = expr;
    if(stdlib[temp.data].premap){
      arr = arr.map(function(a){return codegen(a)});
    }
    return stdlib[temp.data].codegen(arr);
  }
  expr.unshift(temp);
  return stdlib.call.codegen(expr.map(function(a){return codegen(a)}));
}
a = function(){
  var code = '0;\n', i = 1;
  
  var me = [
  function(str){
    code += str + '\n';
    return 'i[' + i++ + ']';
  },
  function(){
    return i;
  },
  function(){
    return code.slice(0,-1);
  },
  function(){
    return 'var i = [], env = {};\n'+me[2]().split('\n').map(function(a,b){return 'i['+b+'] = '+a}).join('\n');
  },
  function(str){
    code += str;
  },
  function(a){
    code = code.slice(0,a||-1);
  }];
  
  return me;
}();

writeLine  = a[0];
getCode    = a[2];
finishCode = a[3];
writeStr   = a[4];
sliceCode  = a[5];

var types = {};
types.string = {codegen:function(a){return '"' + a + '"'}};
types.number = {codegen:function(a){return a}};
types.identifier = {codegen:function(a){return 'env["'+a+'"]'}};

var stdlib = {};
stdlib['+'] = {premap:true,codegen:function(arr){return writeLine('('+arr.join(' + ')+');')}};
stdlib['*'] = {premap:true,codegen:function(arr){return writeLine('('+arr.join(' * ')+');')}};
stdlib.call = {premap:true,codegen:function(arr){return writeLine(arr.shift()+"(" + arr.join(', ') + ');');}};
stdlib.do   = {premap:true,codegen:function(arr){return arr[arr.length-1];}};
stdlib.js   = {codegen:function(arr){
              for(var i in arr){
                if(!(arr[i].primary || arr[i].token === 'identifier'))throw 'Unexpected non-primary';
              }
              return writeLine(arr[0].data + '.bind(' + arr[1].data + ');');
            }};
stdlib.if   = {codegen:function(arr){
              var out = [];
              out[0] = codegen(arr[0]);
              sliceCode();
              writeStr('if('+out[0]+'){\n');
              out[1] = codegen(arr[1]);
              if(arr[2]){
                sliceCode();
                writeStr('}else{\n')
                out[2] = codegen(arr[2]);
                sliceCode();
                writeStr('}\n');
              }
              return writeLine('('+out[0]+')?'+out[1]+':'+out[2]);
            }};
stdlib.let = {codegen:function(arr){
              var out = '';
              out += '(function(';
              if(arr[0].length === undefined)throw "Lacks argument list";
              var t = [[],[]], tmp = '';
              for(var i in arr[0]){
                if(arr[0][i].token !== 'identifier' && arr[0][i].length === undefined){
                  throw 'Unexpected token: ' + arr[0][i].data;
                }
                t[0][i] = arr[0][i].data || arr[0][i][0].data;
                t[1][i] = arr[0][i][0] && arr[0][i][1];
              }
              out += t[0].join(', ');
              tmp = t[0].map(function(a){return 'env["'+a+'"] = ' + a + ';'}).join('');
              t = t[1].map(function(a){return codegen(a)}).join(', ');
              
              
              arr.shift();
              out += '){var env = {}, i = [];' + tmp;
              writeLine(out);
              tmp = arr.pop();
              arr.map(function(a){return codegen(a)});
              tmp = codegen(tmp)
              sliceCode(-1);
              writeStr('return '+tmp+';})(' + t +  ')\n');
              return ;
            }};
stdlib.def  = {codegen:function(arr){
                if(arr[0].token !== 'identifier')throw 'Unexpected token: ' + arr[0].data;
                return writeLine('env["'+arr[0].data+'"] = ' + codegen(arr[1]) + ';'); //env[identifier] = value
              }};
stdlib.defun  = {codegen:function(arr){
                var out = '';
                if(arr[0].token === 'identifier'){
                  out += 'env["'+arr[0].data+'"] =';
                }
                out += 'function(', tmp = '';
                arr.shift();
                if(arr[0].length){
                  for(var i in arr[0]){
                    if(arr[0][i].token !== 'identifier')throw 'Unexpected token: ' + arr[0][i].data;
                  }
                  out += arr[0].map(function(a){return a.data}).join(', ');
                  tmp = arr[0].map(function(a){return 'env["'+a.data+'"] = ' + a.data + ';'}).join('')
                }
                if(arr[0].length !== undefined)
                  arr.shift();
                out += '){var env = {}, i = [];' + tmp;
                out = writeLine(out);
                tmp = arr.pop();
                arr.map(function(a){return codegen(a)});
                tmp = codegen(tmp)
                sliceCode(-1);
                writeStr('return '+tmp+';}\n');
                return out;
              }};
