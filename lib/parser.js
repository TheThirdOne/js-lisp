var input = require('./input.js');
function getTok(){
  var lastChar = input.getChar();
  
  while(!!lastChar.match(/\s/)){ //trim whitespace
    lastChar = input.getChar();
  }
  if(lastChar === ';'){ //comments
    while(lastChar !== '' && lastChar !== '\n'){
      lastChar = input.getChar();
    }
    input.returnChar(lastChar);
    return getTok();
  }
  if(lastChar === ''){ //pretty obvious stuff here
    return {token:'EOF'};
  }
  if(lastChar === '('){
    return {token:'(',index:input.getIndex()};
  }
  if(lastChar === ')'){
    return {token:')',index:input.getIndex()};
  }
  if(lastChar === '\''){
    return {token:'\'',index:input.getIndex()};
  }
  
  if(!!lastChar.match(/[^"0-9]/)){ //identifiers
    return {token: 'identifier',
            data:   getRest(/[^()'"\s]/,lastChar),
            index:  input.getIndex()};
  }
  if(!!lastChar.match(/[0-9]/)){ //numbers
    return clean({token: 'number',
            data:   getRest(/[0-9\.]/,lastChar),
            primary: true, index:input.getIndex()});
  }
  if(lastChar === '"'){   //Strings
    lastChar = input.getChar();
    var out = "";
    var escaping = false;
    while(lastChar !== '"' || escaping){
      if(lastChar === ''){
        throw "Unexpected EOF";
      }
      
      out += lastChar;
      
      escaping = lastChar === '\\' && !escaping;
      lastChar = input.getChar();
    }
    return clean({token: 'string',
            data: out, primary:true,
            index:input.getIndex()});
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
  var out = last || input.getChar();
  var lastChar = input.getChar();
  while(!!lastChar.match(condition)){
    if(lastChar === ''){
      throw "Unexpected EOF";
    }
    out += lastChar;
    lastChar = input.getChar();
  }
  input.returnChar(lastChar);
  return out;
}

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
module.exports = {getTok:getTok,
          clean:clean,
          getRest:getRest,
          parseExpr:parseExpr,
          parseList:parseList};