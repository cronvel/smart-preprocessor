


## Smart Preprocessor

A smart preprocessor for Node.js.

* License: MIT
* Current status: beta



Smart Preprocessor allows you to preprocess a Javascript module, to build modified versions of the module,
or even load a modified version of the module at run-time (*require()*).

While it is inspired by the C/C++ preprocessor, the syntax is different to be more in phase with the Javascript's spirit.

Its syntax is hidden behind the comment mark, so the original source file is
[perfectly operational without any pre-processing](#recommandations)



##### Common use cases: 

* you want a lot of logs in development mode, but you don't even want that the production code had to filter them out
  with dozens of *if* statements.

* your source code uses specific features of an engine, namely *io.js*, but you have specified an alternative code
  that is compatible with *node.js*.

* you have some server code that works fine, you want to build a browser-compatible version

Be sure to check the [recommandations](#recommandations).



## smart-preprocessor: the CLI program

Smart Preprocessor can be invoked as a Command Line utility to build an alternative version of your code.

After installing it globally, using `npm install -g smart-preprocessor`, we can run it from everywhere.

The syntax is simple:

`smart-preprocessor <source-file> [dest-file] [--switch1 [value1]] [--switch2 [value2]] [...]`.

If *dest* is not given, the standard output will be assumed. It's useful if we have to pipe that into another program.

All *switches* are identifiers we have used in our source-file. See below.

Any alpha-numric string can be used as a *switch*.
Just try to be consistent with other projects.

Some examples:

* `smart-preprocessor main.js main.debug.js --debug`: build the *main.debug.js* file from *main.js*, using the *debug* parameter
* `smart-preprocessor main.js main.trace.js --loglevel trace`: build the *main.trace.js* file from *main.js*,
  setting the *loglevel* parameter to 'trace'



## Require a module and pre-process it on-the-fly

Smart Preprocessor can *require* a module while pre-processing it on-the-fly.



### .require( module , switches , [ options ] )

* module: `string` the module to load
* switches: `object` an object containing the preprocessor switches
* options: `object` *optional*, contains some options where:
	* multi: if the module is required multiple times with different *switches* objects, multiple
		instances of the module will be spawned. Without this options, subsequent *require* will use the first
		instance even if the *switches* object are different. Some node.js module execute code
		at require-time, that's why the default behaviour is to share only one instance, just like a normal
		*require()* does.

```js
var spp = require( 'smart-preprocessor' ) ;	// Load the smart preprocessor module

var myModule = spp.require( 'my-module' , { config1: true , config2: 4 } ) ;
```

When loading a module not lying in a `node_modules` directory, you must provide the full path of the file, 
one may simply prepend `__dirname` to the path's string.



<a name="recommandations"></a>
## Recommandations / Good practices

* Your source code should be working without any preprocessing, that's what make
  [Preprocessor.js](http://npmjs.org/package/preprocessor) a bad thing, Javascript must run unprocessed.
* In fact, your source code should be your standard / production version
* Use runtime preprocessor's *.require()* only for development, debugging, or any kind of fail-safe or emergency mode,
  that's not a good practice to use it for production running in standard mode.
  By the way, since preprocessor's *.require()* should read your code, write it somewhere and then call the core
  node.js *require()*, it is slower than normal *require()*. Once your module is cached, it still has to compute a hash
  to find out the path of the preprocessed file.
* As you can see, you cannot define a preprocessor switch to false, null, undefined or an empty string.
  There is nothing close to an *else* statement either. Why? Because invoking Smart Preprocessor without any switch
  **\*MUST\*** be equivalent to the original unprocessed code.



## Preprocessor Commands Syntax

The Javascript source file should contains some preprocessor command.
All preprocessor command are hidden into comments.

In fact, many command works by commenting or uncommenting lines.

A preprocessor command start with a *preprocessor mark*.

A *preprocessor mark* is a *comment mark* followed by a *#*.

For inline command, this will start by `//#` without spaces.

For multi-line command, this will start with either `/*#` or `//*#`, see below the differences.
Multi-line command stop at `//*/`.



### Conditional comment syntax

#### `//# <expression> : <inline-code>`

If *expression* is truthy, then the code is uncommented.

Example, source code of *hello.js*:
```js
console.log( 'Hello' ) ;
//# debug : console.log( myVar ) ;
console.log( 'world!' ) ;
```

After running in a shell the command `smart-preprocessor hello.js hello.pproc.js --debug`, you get a *hello.pproc.js*
file with this content:

```js
console.log( 'Hello' ) ;
console.log( myVar ) ;
console.log( 'world!' ) ;
```

If you had typed `smart-preprocessor hello.js hello.pproc.js --whatever`, *hello.pproc.js* would be:

```js
console.log( 'Hello' ) ;
//console.log( myVar ) ;
console.log( 'world!' ) ;
```

... note that the preprocessor command had been removed entirely.



#### `<inline-code> //# <expression> !`

If *expression* is truthy, then the code is commented.

Example, source code of *hello.js*:
```js
console.log( 'Hello' ) ;
console.log( myVar ) ;	//# quiet !
console.log( 'world!' ) ;
```

After running in a shell the command `smart-preprocessor hello.js hello.pproc.js --quiet`, you get a *hello.pproc.js*
file with this content:

```js
console.log( 'Hello' ) ;
//console.log( myVar ) ;
console.log( 'world!' ) ;
```

If you had typed `smart-preprocessor hello.js hello.pproc.js --whatever`, *hello.pproc.js* would be:

```js
console.log( 'Hello' ) ;
console.log( myVar ) ;
console.log( 'world!' ) ;
```



#### `/*# <expression> :\n <multiline-code> \n//*/`

If <expression> is set, the code is uncommented.

Example, source code of *hello.js*:
```js
console.log( 'Hello' ) ;
/*# debug :
console.log( myVar1 ) ;
console.log( myVar2 ) ;
//*/
console.log( 'world!' ) ;
```

After running in a shell the command `smart-preprocessor hello.js hello.pproc.js --debug`, you get a *hello.pproc.js*
file with this content:

```js
console.log( 'Hello' ) ;
//*
console.log( myVar1 ) ;
console.log( myVar2 ) ;
//*/
console.log( 'world!' ) ;
```

If you had typed `smart-preprocessor hello.js hello.pproc.js --whatever`, *hello.pproc.js* would be:

```js
console.log( 'Hello' ) ;
/*
console.log( myVar1 ) ;
console.log( myVar2 ) ;
//*/
console.log( 'world!' ) ;
```



#### `//*# <expression> :\n <multiline-code> \n//*/`

If *expression* is truthy, the code is commented.

Example, source code of *hello.js*:
```js
console.log( 'Hello' ) ;
//*# quiet !
console.log( myVar1 ) ;
console.log( myVar2 ) ;
//*/
console.log( 'world!' ) ;
```

After running in a shell the command `smart-preprocessor hello.js hello.pproc.js --quiet`, you get a *hello.pproc.js*
file with this content:

```js
console.log( 'Hello' ) ;
/*
console.log( myVar1 ) ;
console.log( myVar2 ) ;
//*/
console.log( 'world!' ) ;
```

If you had typed `smart-preprocessor hello.js hello.pproc.js --whatever`, *hello.pproc.js* would be:

```js
console.log( 'Hello' ) ;
//*
console.log( myVar1 ) ;
console.log( myVar2 ) ;
//*/
console.log( 'world!' ) ;
```



### Expressions

In previous examples, we have only used the presence or absence of a switch.
However it is possible to compare a switch to a value.

A value is typically a string.
However, any string that can be parsed as a float will be converted to a *number*.
The same rule apply for the switch itself.

This is the list of all type comparison.



#### `<switch>`

This is the simplest check.
If the switch is defined, the condition is true.

**Please be extremely careful: unlike Javascript, even if a switch's value is 0, the condition will still be true**.
**This expression does not check if the switch is truthy or falsy, it checks if it exists.**
Also there are [strong rationals behind this design)(#recommandations).

Example:

```js
//# debug : console.log( myVar ) ;
```



#### `<switch> = <value>`

This expression is true if the switch exists and if it equals *value*.

Example:

```js
//# loglevel = trace : console.log( myVar ) ;
```

If a switch *loglevel* exists and is set to "trace", then the code is uncommented.



#### `<switch> > <value>`, `<switch> >= <value>`, `<switch> < <value>`, `<switch> <= <value>`

This expression is true if the switch exists, if both the switch and the value are numbers, and if the switch is
respectively greater, greater or equals, lesser, lesser or equals than the value.

Example:

```js
//# loglevel >= 3 : console.log( myVar ) ;
```

If a switch *loglevel* exists, is a number and is greater than or equals to 3, then the code is uncommented.



### Aliases

It is possible to define aliases.
Each alias is bound to a particular switch.

When an expression involve a switch that has aliases, the preprocessor will try to perform alias substitution on 
both the switch's value and the value against whom the switch is compared.

The syntax of alias definition is `//# <switch> # <alias> ~ <value>`.

Example:

```js
//# loglevel # error ~ 0
//# loglevel # warning ~ 1
//# loglevel # verbose ~ 2
//# loglevel # trace ~ 3

//# loglevel >= warning : console.log( "Warning: something bad happens!" ) ;
```

We defined aliases for the *loglevel* switch.
If this switch value is one of *error, warning, verbose* or *trace*, it will be replaced respectively by 0, 1, 2 or 3.
Then we have a conditional syntax, comparing against *warning*... *warning* is replaced by *1* beforehand.
Therefore, if the *loglevel* switch is *warning*, *verbose*, *trace* or any number greater than or equals to 3,
the code will be uncommented.

Benefits of aliases:

* it can be thought as defining a constant
* it can be thought as defining an enum
* it can be used to perform *greater than* or *lesser than* comparison with strings



### Assignment

It is possible to assign a switch's value to a Javascript variable.

The syntax is `//# <switch> -> <Javascript-variable>`.

Example, code.js:
```js
var runningLogLevel ;
//# loglevel -> runningLogLevel
```

After running in a shell the command `smart-preprocessor code.js code.pproc.js --loglevel 3`, you get a *code.pproc.js*
file with this content:

```js
var runningLogLevel ;
runningLogLevel = 3 ;
```

If you had typed `smart-preprocessor code.js code.pproc.js --loglevel warning`, *code.pproc.js* would be:

```js
var runningLogLevel ;
runningLogLevel = 'warning' ;
```

If you had typed `smart-preprocessor code.js code.pproc.js --loglevel`, *code.pproc.js* would be:

```js
var runningLogLevel ;
runningLogLevel = true ;
```

Please note that if the *loglevel* switch wasn't defined, the whole line would be blank.
This is still related to the fact that [*no switch = original unprocessed source code*](#recommandations).
So if you had typed `smart-preprocessor code.js code.pproc.js --whatever`, *code.pproc.js* would be:

```js
var runningLogLevel ;

```

Also you can set up the value to anything, like (assuming the *loglevel* switch value is 'warning'):

* object: `//# loglevel -> myObject.child.prop` -> `myObject.child.prop = 'warning' ;`
* array: `//# loglevel -> myArray[ 5 ]` -> `myArray[ 5 ] = 'warning' ;`



Finally, it is possible to write conditional assignment.
This is simply a mix of the *conditional syntax* and the *assignment syntax*.

For example:

```js
//# loglevel = trace -> myVar
```

... will assign the *loglevel* switch to *myVar* only if loglevel === trace.

Another example:

```js
//# loglevel >= 3 -> myVar
```

... will assign the *loglevel* switch to *myVar* only if loglevel is a number and is greater than or equals to 3.



### Spacing

Spaces are optional.

This code:
```js
//#debug:console.log('Warning!');
```
... is strictly equivalent to this code:
```js
//# debug : console.log( 'Warning!' ) ;
```

**However spaces between the comment mark ('//' or '/*') and the '#' are \*NOT\* allowed!**

This is called *the preprocessor mark*.

Therefore, the current code has no effect:
```js
// # debug : console.log( 'Warning!' ) ;
```
... it will be considered like a normal comment.



