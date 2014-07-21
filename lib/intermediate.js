exports.toString = function(arr){
  return JSON.stringify(exports.toObject(arr));
};
exports.fromString = function(str){
  return exports.toArr(JSON.parse(str));
};

exports.toArr = function(arr){
  if(arr.array instanceof Array){
    var out = [];
    console.log(arr);
    for(var i = 0; i < arr.array.length;i++){
      out[i] = exports.toArr(arr.array[i]);
    }
    if(arr.index){
      out.index = arr.index;
    }
    return out;
  }
  return arr;
};
exports.toObject = function(arr){
  if(arr instanceof Array){
    var out = [];
    for(var i = 0; i < arr.length;i++){
      out[i] = exports.toObject(arr[i]);
    }
    out = {array:out};
    if(arr.index){
      out.index = arr.index;
    }
    return out;
  }
  return arr;
};