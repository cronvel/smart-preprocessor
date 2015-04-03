


## Smart Preprocessor

A smart preprocessor for Node.js.

* License: MIT
* Current status: beta



Smart Preprocessor allows you to preprocess a Javascript module, to build modified versions or even load at run-time 
(*require()*) a modified version of the code.

While it is inspired by the C/C++ preprocessor, the syntax is different in order to be in phase with the Javascript's spirit.

Its syntax is hidden behind comment, so the original source file is
<a href="#recommandations">perfectly operationnal without any pre-processing</a>.



Common use cases: 

* you want a lot of logs in development mode, but you don't even want that the production code had to filter out
  them with dozens of *if* statement.

* your source code use specific feature of an engine, namely *io.js*, but you have specified an alternative code
  that is compatible with *node.js*.

* you have some server code that works fine, you want to build a browser-compatible version

Be sure to check the <a href="#recommandations">recommandations</a>.



## smart-preprocessor: the CLI program

Smart Preprocessor can be invoked as a Command Line utility to build an alternative version of your code.

After installing it globally, using `npm install -g smart-preprocessor`, we can run it from everywhere.

The syntax is simple:

`smart-preprocessor <source-file> [dest-file] [--parameter1 value1] [--parameter2 value2] [...]`.

If *dest* is not passed, the standard output will be assumed. It's useful if we have to pipe to another program.

All the *parameters* are identifiers we have used in our source-file. See below.

Some examples:

* `smart-preprocessor main.js main.debug.js --debug`: build the main.debug.js file from main.js, using the *debug* parameter
* `smart-preprocessor main.js main.trace.js --loglevel trace`: build the main.trace.js file from main.js,
  setting the *loglevel* parameter to 'trace'



## Require a module and pre-process it on-the-fly

Smart Preprocessor can *require* a module while pre-processing it on-the-fly.



### .require( module , preprocessorContants , [ options ] )

* module: `string` the module to load
* preprocessorContants: `object` an object containing the preprocessor constants
* options: `object` *optional*, contains some options where:
	* multi: if the module is required multiple times with differents *preprocessorContants* object, multiple
		instances of the module will be spawned. Without this options, subsequent require will use the first
		instance even if the *preprocessorConstants* are different. Some node.js module execute code at require-time,
		that's why the default behaviour is to share only one instance, like normal *require()* does.



```js
var spp = require( 'smart-preprocessor' ) ;	// Load the smart preprocessor module

var myModule = spp.require( 'my-module' , { config1: true , config2: 4 } ) ;
```

When loading a module not lying in a `node_modules` directory, you must provide the full path of the file, 
one may simply prepend `__dirname` to the path's string.


<a name="recommandations"></a>
## Recommandations / Good practices

* Your source code should be working without any preprocessing, that's what make
  <a href="http://npmjs.org/package/preprocessor.js">preprocessor.js</a> a bad thing, JS must run unprocessed.
* In fact, your source code should be your standard / production version
* Use runtime preprocessor's *.require()* only for development, debugging, or any kind of fail-safe or emergency mode,
  that's not a good practice to use it for production running in standard mode.
  By the way, since preprocessor's *.require()* should read your code, write it somewhere and then call the core
  node.js *require()*, it is slower than normal *require()*. Once your module is cached, it still has to compute a hash
  to find out the path of the preprocessed file.
* As you can see, you cannot define a preprocessor constant to false, null or undefined. There is nothing close to 
  an *else* statement either. Why? Because invoking Smart Preprocessor without any constant **\*MUST\*** be equivalent
  to the original unprocessed code.



## Conditional comment syntax

### `//# <condition> : <inline-code>`

If *condition* is true, then the code is uncommented.

Example, source code:
```
```



### `<code> //# <condition> !` if <condition> is set, the code is commented.



### `/*# <condition> :\n <multiline-code> \n//*/` if <condition> is set, the code is uncommented.



### `//*# <condition> :\n <multiline-code> \n//*/` if <condition> is set, the code is commented.

