var types = exports;
types.string = {codegen:function(a){return '"' + a + '"';}};
types.number = {codegen:function(a){return a;}};
types.identifier = {codegen:function(a){return 'env["'+a+'"]';}};

