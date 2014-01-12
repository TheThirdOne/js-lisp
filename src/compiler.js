//still needs work
function compile(str){
  var out = [];
  var forw =/\(/g, back = /\)/g;
  var parsed = clean(str);
  var net = 0;
  for(var i = 0; i < parsed.length;i++){
    net += parsed[i].match(forw)-parsed[i].match(back);
    if(net < 0)
      throw "To many closing parens";
  }
  if(net > 0)
    throw "To many opening parens";
  return parsed.join(" ").replace(/\(/g,'{').replace(/\)/g,'}');
}
//mostly done; may put some ( handling in here eventually
function clean(str){
  var start = 0;
  var out = [];
  var string = false;
  var comment = false;
  for(var i = start; i < str.length;i++){
    char = str[i];
    if(!comment&&(char==='"'||char==="'")&&str[i-1]!='\\'){ //handles quotations
      if(string === char)
        string = false;
      else if(!string)
        string = char;
      continue;
    }
    if(!string&&comment===';'&&char==='\n'){ //end ; comment
      start = i + 1;
      comment = false;
      continue;
    }
    if(!string&&comment==='#'&&char==='#'&&str[i-1]=='|'){ //end #| comment
      start = i + 1;
      comment = false;
      continue;
    }
    if(!string&&!comment&&char===';'&&str[i-1]!='\\'){ //start ; comment
      comment=';';
      if(start!=i)
        out.push(str.substring(start,i));
      continue;
    }
    if(!string&&!comment&&char==='#'&&str[i-1]!='\\'&&str[i+1]=='|'){ //start #| comment
      comment='#';
      if(start!=i)
        out.push(str.substring(start,i));
      continue;
    }
    if(!comment&&!string&&/\s/.test(char)){ //separate about whitespace
      console.log('yolo');
      if(start!=i)
        out.push(str.substring(start,i));
      start=i+1;
    }
  }
  if(start!=i)
        out.push(str.substring(start,i));
  return out;
}
