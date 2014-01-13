function run(code){
  if(typeof code !== "object")
    return code;
  var key;
  var args = [];
  if(typeof code[0] === "object"){
    key = run(code[0]);
  }else{
    key = code[0];
  }
  var temp =function(b){
              return function(){
                var c;
                if(!c)
                  c = run(code[b]);
                return c;
              };
            };
  for(var i = 1;i<code.length;i++){
    args[i-1]=temp(i);
  }
  return env[key](args);
}
var env = {};