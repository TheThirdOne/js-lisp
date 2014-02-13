var jslisp;
(function(exports){
  exports.save = function(code){
    return JSON.stringify(code).replace(/\\"/g,"\\'");
  };
  exports.load = function(code){
    return JSON.parse(code);
  };
  exports.symbolize = function(str){
    if(!isNaN(parseFloat(str))){
      return parseFloat(str);
    }
    if(str[0] === '"' || str[0]==="'"){
      return "STRING:"+str.slice(1,str.length-1);
    }
    return str;
  };
  //mostly done
  exports.parse = function(str){
    var stack = [];
    var out = ['do'];
    var current = out;
    var parsed = exports.clean(str);
    for(var i = 0; i < parsed.length;i++){
      if(parsed[i]==='('){
        stack.push(current);
        current.push([]);
        current = current[current.length-1];
        continue;
      }
      if(parsed[i]===')'){
        if(stack.length===0){
          throw "Unexpected )";
        }
        current = stack.pop();
        continue;
      }
      parsed[i]=exports.symbolize(parsed[i]);
      current.push(parsed[i]);
    }
    if(stack.length){
      throw "Unexpected end of file. Expecting )";
    }
    return out;
  };
  //mostly done; may put some ( handling in here eventually
  exports.clean = function(str){
    var start = 0;
    var out = [];
    var string = false;
    var comment = false;
    var char;
    for(var i = start; i < str.length;i++){
      char = str[i];
      if(!comment&&(char==='"'||char==="'")&&str[i-1]!=='\\'){ //handles quotations
        if(string === char){
          string = false;
        }else if(!string){
          string = char;
        }
        continue;
      }
      if(!string&&comment===';'&&char==='\n'){ //end ; comment
        start = i + 1;
        comment = false;
        continue;
      }
      if(!string&&comment==='#'&&char==='#'&&str[i-1]==='|'){ //end #| comment
        start = i + 1;
        comment = false;
        continue;
      }
      if(!string&&!comment&&char===';'&&str[i-1]!=='\\'){ //start ; comment
        comment=';';
        if(start!==i){
          out.push(str.substring(start,i));
        }
        continue;
      }
      if(!string&&!comment&&char==='#'&&str[i-1]!=='\\'&&str[i+1]==='|'){ //start #| comment
        comment='#';
        if(start!==i){
          out.push(str.substring(start,i));
        }
        continue;
      }
      if(!comment&&!string&&/\s/.test(char)){ //separate about whitespace
        if(start!==i){
          out.push(str.substring(start,i));
        }
        start=i+1;
        continue;
      }
      if(!comment&&!string&&(char==='('||char===')')){ //separate about parens
        if(start!==i){
          out.push(str.substring(start,i));
        }
        out.push(char);
        start=i+1;
        continue;
      }
    }
    if(start!==i){
      out.push(str.substring(start,i));
    }
    return out;
  };
})(exports || jslisp.compiler);