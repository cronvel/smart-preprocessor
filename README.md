

# Smart Preprocessor

A smart preprocessor for Node.js.

Early alpha: **do not use now!**



## smart-preprocessor: the CLI program

After installing it globally, using `npm install -g smart-preprocessor`, we can run it from everywhere.

The syntaxe is simple:

`smart-preprocessor <source-file> [dest-file] [--parameter1 value1] [--parameter2 value2] [...]`.

If *dest* is not passed, the standard output will be assumed. It's useful if we have to pipe to another program.

All the *parameters* are identifiers you refer in your source-file. See below.

Some examples:

* `smart-preprocessor main.js main.debug.js --debug`: build the main.debug.js file from main.js, using the *debug* parameter
* `smart-preprocessor main.js main.trace.js --loglevel trace`: build the main.trace.js file from main.js,
  setting the *loglevel* parameter to 'trace'



## Conditional comment syntax

### `//# <condition> : <inline-code>`

If *condition* is true, then the code is uncommented.

Example, source code:
```
```



### `<code> //# <condition> !` if <condition> is set, the code is commented.



### `/*# <condition> :\n <multiline-code> \n//*/` if <condition> is set, the code is uncommented.



### `//*# <condition> :\n <multiline-code> \n//*/` if <condition> is set, the code is commented.

