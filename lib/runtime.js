var jslisp;
(function(exports){
  exports.run = function(code){
    if(typeof code !== "object"){
      return code;
    }
    var key;
    var args = [];
    if(typeof code[0] === "object"){
      key = exports.run(code[0]);
    }else{
      key = code[0];
    }
    var temp =function(b){
      var c;
      return function(rerun){
        if(!c || rerun){
          c = exports.run(code[b]);
        }
        return c;
      };
    };
    for(var i = 1;i<code.length;i++){
      args[i-1]=temp(i);
    }
    try{
      return exports.env[key](args);
    }catch(e){
      console.warn(key,'is not a valid function');
    }
  };
  exports.env = {};
})(exports || jslisp.runtime);