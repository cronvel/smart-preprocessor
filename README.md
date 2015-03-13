

# Smart Preprocessor

A smart preprocessor for Node.js.

Early alpha: **do not use now!**



## Comment syntax


* `//# param : [code]` if param is set, the code is uncommented.
* `[code] //# param !` if param is set, the code is commented.
* `/*# param :\n [multiline-code] \n//*/` if param is set, the code is uncommented.
* `//*# param :\n [multiline-code] \n//*/` if param is set, the code is commented.

