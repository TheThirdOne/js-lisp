JSLisp [Latest Build](https://drone.io/github.com/TheThirdOne/js-lisp/files/build/jslisp.min.js) [![Build Status](https://drone.io/github.com/TheThirdOne/js-lisp/status.png)](https://drone.io/github.com/TheThirdOne/js-lisp/latest)
=======



Lisp implemented only in JavaScript. Heavy influence from ClojureScript, Haskell and of course JavaScript. Mainly made to increase my knowledge of compiler theory, but also to make a really easily compiled lisp that can run anywhere.


It is a compiler (todo) and interpreter for lisp. Though it is not planned to be strictly Clojure compatable, it will mimic many of the function names for the sake of simplicity for users. One way in which it is planned to be different is that it will be meant to be run on javascript and it will inherit some functional philosphies of haskell.

Reasons for Creation:
  - To learn
  - Making a simple to compile lisp (no dependencies)
  - Using a lean implementation (currently 300 lines with tests)
  - In JavaScript

TODO:
  - **Variables**
  - Compiling to Javascript
  - Finish STDlib

How to Use
----------

Before every commit make sure ```grunt hint test``` runs without errors.   
Inorder to build a browser version run ```grunt build```.   
Or if it hasn't been tested yet ```grunt```.