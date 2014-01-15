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
env.and = function(args){
  for(var i = 0; i < args.length;i++){
    if(!args[i]())
      return args[i]();
  }
  return true;
};
env.or = function(args){
  for(var i = 0; i < args.length;i++){
    if(args[i]())
      return args[i]();
  }
  return false;
};

