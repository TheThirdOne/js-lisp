env.do = function(args){
  var c;
  for(var i = 0; i < args.length;i++){ 
    c = args[i]();
  }
  return c;
};
env.log = function(args){
  var str = "";
  for(var i = 0; i < args.length;i++){
    str += args[i]();
  }
  console.log(str);
  return str;
};

//arithmetic operations
env['+'] = function(args){
  var out = args[0]();
  for(var i = 1; i < args.length;i++){
    out += args[i]();
  }
  return out;
}; 
env['*'] = function(args){
  var out = args[0]();
  for(var i = 1; i < args.length;i++){
    out *= args[i]();
  }
  return out;
};
env['-'] = function(args){
  var out = args[0]();
  for(var i = 1; i < args.length;i++){
    out -= args[i]();
  }
  return out;
};
env['/'] = function(args){
  var out = args[0]();
  for(var i = 1; i < args.length;i++){
    out /= args[i]();
  }
  return out;
};

//boolean logic
env.bool = function(args){
  if(!args.length)
    throw "Not enough arguments";
  return !!args[0]();
};
env.and = function(args){
  if(!args.length)
    throw "Not enough arguments";
  for(var i = 0; i < args.length;i++){
    if(!args[i]())
      return args[i]();
  }
  return true;
};
env.or = function(args){
  if(!args.length)
    throw "Not enough arguments";
  for(var i = 0; i < args.length;i++){
    if(args[i]())
      return args[i]();
  }
  return false;
};
env.not = function(args){
  if(!args.length)
    throw "Not enough arguments";
  return !args[0]();
};
env['='] = function(args){
    if(args.length < 2)
    throw "Not enough arguments";
  var out = true;
  for(var i = 1; i < args.length;i++){
    out &= args[i-1]() == args[i]();
  }
  return !!out;
};
env['<='] = function(args){
  if(args.length < 2)
    throw "Not enough arguments";
  var out = true;
  for(var i = 1; i < args.length;i++){
    out &= args[i-1]() > args[i]();
  }
  return !out;
};
env['>'] = function(args){
  return !env['<='](args);
};
env['>='] = function(args){
  if(args.length < 2)
    throw "Not enough arguments";
  var out = true;
  for(var i = 1; i < args.length;i++){
    out &= args[i-1]() < args[i]();
  }
  return !out;
};
env['<'] = function(args){
  return !env['>='](args);
};

//control structure
env.if = function(args){
  if(args[0]&&args[0]()){
    if(args[1])
      return args[1]();
  }else{
    if(args[2])
      return args[2]();
  }
};
