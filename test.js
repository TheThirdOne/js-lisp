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
    return {token:'('};
  }
  if(lastChar === ')'){
    return {token:')'};
  }
  
  if(!!lastChar.match(/[a-zA-Z]/)){ //identifiers
    return {token: 'identifier',
            data:   getRest(/[a-zA-Z0-9]/,lastChar)};
  }
  if(!!lastChar.match(/[0-9\.]/)){ //numbers
    return clean({token: 'number',
            data:   getRest(/[0-9\.]/,lastChar),
            primary: true});
  }
  if(lastChar === '"'){   //Strings
    lastChar = getChar();
    var out = "";
    var escaping = false;
    while(lastChar !== '"' || escaping){
      if(lastChar !== '\\' || escaping){
        //fancyness to handle any escaped cahracter
        //esssentially it makes json including the character and then parses it
        out += (!escaping)?lastChar:JSON.parse('{"data":"\\'+lastChar+'"}').data;
      }
      escaping = lastChar === '\\' && !escaping;
      lastChar = getChar();
    }
    return clean({token: 'string',
            data: out, primary:true});
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
    out += lastChar;
    lastChar = getChar();
  }
  returnChar(lastChar);
  return out;
}

function getChar(){
  return arr.shift() || '';
}

function returnChar(a){
  arr.unshift(a);
}

function parseExpr(tok){
  var t = tok || getTok();
  if(t.token !== '('){
    if(!t.primary){
      throw "Unexpected token: " + (t.data || t.token);
    }
    return t;
  }
  t = getTok();
  var out = [];
  while(t.token !== ')'){
    if(t.token === '('){
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