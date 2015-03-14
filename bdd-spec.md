# TOC
   - [Preprocessor](#preprocessor)
     - [Comment/uncomment](#preprocessor-commentuncomment)
     - [Aliases](#preprocessor-aliases)
     - [Assignment](#preprocessor-assignment)
   - [Require](#require)
<a name=""></a>
 
<a name="preprocessor"></a>
# Preprocessor
<a name="preprocessor-commentuncomment"></a>
## Comment/uncomment
Simple line uncomment behaviour.

```js
var code =
	"var debug = false ;\n" +
	"//#debug : debug = true ;\n" +
	"console.log( debug ) ;\n" ;

expect( spp.preprocess( code , {} ) ).to.be( 
	"var debug = false ;\n" +
	"//debug = true ;\n" +
	"console.log( debug ) ;\n"
) ;

expect( spp.preprocess( code , { toto: true } ) ).to.be( 
	"var debug = false ;\n" +
	"//debug = true ;\n" +
	"console.log( debug ) ;\n"
) ;

expect( spp.preprocess( code , { debug: true } ) ).to.be( 
	"var debug = false ;\n" +
	"debug = true ;\n" +
	"console.log( debug ) ;\n"
) ;
```

Simple line comment behaviour.

```js
var code =
	"var debug = false ;\n" +
	"debug = true ; //#production!\n" +
	"console.log( debug ) ;\n" ;

expect( spp.preprocess( code , {} ) ).to.be( 
	"var debug = false ;\n" +
	"debug = true ;\n" +
	"console.log( debug ) ;\n"
) ;

expect( spp.preprocess( code , { toto: true } ) ).to.be( 
	"var debug = false ;\n" +
	"debug = true ;\n" +
	"console.log( debug ) ;\n"
) ;

expect( spp.preprocess( code , { production: true } ) ).to.be( 
	"var debug = false ;\n" +
	"//debug = true ;\n" +
	"console.log( debug ) ;\n"
) ;
```

Uncomment a line comment with various spacing behaviour.

```js
expect( spp.preprocess( "//#debug:debug = true ;" ) ).to.be( "//debug = true ;" ) ;
expect( spp.preprocess( "//#debug:debug = true ;" , { debug: true } ) ).to.be( "debug = true ;" ) ;

expect( spp.preprocess( "//# \t debug \t : \t debug = true ;" ) ).to.be( "//debug = true ;" ) ;
expect( spp.preprocess( "//# \t debug \t : \t debug = true ;" , { debug: true } ) ).to.be( "debug = true ;" ) ;

expect( spp.preprocess( " \t //# \t debug \t : \t debug = true ;" ) ).to.be( " \t //debug = true ;" ) ;
expect( spp.preprocess( " \t //# \t debug \t : \t debug = true ;" , { debug: true } ) ).to.be( " \t debug = true ;" ) ;
```

Comment the line with various spacing behaviour.

```js
expect( spp.preprocess( "debug = true ;//#production!" ) ).to.be( "debug = true ;" ) ;
expect( spp.preprocess( "debug = true ;//#production!" , { production: true } ) ).to.be( "//debug = true ;" ) ;

expect( spp.preprocess( "debug = true ; \t //# \t production \t ! \t " ) ).to.be( "debug = true ;" ) ;
expect( spp.preprocess( "debug = true ; \t //# \t production \t ! \t " , { production: true } ) ).to.be( "//debug = true ;" ) ;

expect( spp.preprocess( " \t debug = true ; \t //# \t production \t ! \t " ) ).to.be( " \t debug = true ;" ) ;
expect( spp.preprocess( " \t debug = true ; \t //# \t production \t ! \t " , { production: true } ) ).to.be( " \t //debug = true ;" ) ;
```

Simple block uncomment behaviour.

```js
var code =
	"var debug = false ;\n" +
	"/*#debug :\n" +
	"debug = true ;\n" +
	"//*/\n" +
	"console.log( debug ) ;\n" ;

expect( spp.preprocess( code , {} ) ).to.be( 
	"var debug = false ;\n" +
	"/*\n" +
	"debug = true ;\n" +
	"//*/\n" +
	"console.log( debug ) ;\n"
) ;

expect( spp.preprocess( code , { toto: true } ) ).to.be( 
	"var debug = false ;\n" +
	"/*\n" +
	"debug = true ;\n" +
	"//*/\n" +
	"console.log( debug ) ;\n"
) ;

expect( spp.preprocess( code , { debug: true } ) ).to.be( 
	"var debug = false ;\n" +
	"//*\n" +
	"debug = true ;\n" +
	"//*/\n" +
	"console.log( debug ) ;\n"
) ;
```

Simple block comment behaviour.

```js
var code =
	"var debug = false ;\n" +
	"//*# production !\n" +
	"debug = true ;\n" +
	"//*/\n" +
	"console.log( debug ) ;\n" ;

expect( spp.preprocess( code , {} ) ).to.be( 
	"var debug = false ;\n" +
	"//*\n" +
	"debug = true ;\n" +
	"//*/\n" +
	"console.log( debug ) ;\n"
) ;

expect( spp.preprocess( code , { toto: true } ) ).to.be( 
	"var debug = false ;\n" +
	"//*\n" +
	"debug = true ;\n" +
	"//*/\n" +
	"console.log( debug ) ;\n"
) ;

expect( spp.preprocess( code , { production: true } ) ).to.be( 
	"var debug = false ;\n" +
	"/*\n" +
	"debug = true ;\n" +
	"//*/\n" +
	"console.log( debug ) ;\n"
) ;
```

Line uncomment behaviour with string comparison.

```js
var code =
	"fn1() ;\n" +
	"//#debug=trace : console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"fn2() ;\n" ;

expect( spp.preprocess( code , {} ) ).to.be( 
	"fn1() ;\n" +
	"//console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { toto: true } ) ).to.be( 
	"fn1() ;\n" +
	"//console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { debug: true } ) ).to.be( 
	"fn1() ;\n" +
	"//console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { debug: 'toto' } ) ).to.be( 
	"fn1() ;\n" +
	"//console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { debug: 'trace' } ) ).to.be( 
	"fn1() ;\n" +
	"console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"fn2() ;\n"
) ;
```

Line comment behaviour with string comparison.

```js
var code =
	"fn1() ;\n" +
	"console.log( '[VERBOSE] Loading...' ) ; //# debug=error !\n" +
	"fn2() ;\n" ;

expect( spp.preprocess( code , {} ) ).to.be( 
	"fn1() ;\n" +
	"console.log( '[VERBOSE] Loading...' ) ;\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { toto: true } ) ).to.be( 
	"fn1() ;\n" +
	"console.log( '[VERBOSE] Loading...' ) ;\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { debug: true } ) ).to.be( 
	"fn1() ;\n" +
	"console.log( '[VERBOSE] Loading...' ) ;\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { debug: 'verbose' } ) ).to.be( 
	"fn1() ;\n" +
	"console.log( '[VERBOSE] Loading...' ) ;\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { debug: 'error' } ) ).to.be( 
	"fn1() ;\n" +
	"//console.log( '[VERBOSE] Loading...' ) ;\n" +
	"fn2() ;\n"
) ;
```

Block uncomment behaviour with string comparison.

```js
var code =
	"fn1() ;\n" +
	"/*#debug=trace:\n" +
	"console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"//*/\n" +
	"fn2() ;\n" ;

expect( spp.preprocess( code , {} ) ).to.be( 
	"fn1() ;\n" +
	"/*\n" +
	"console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"//*/\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { toto: true } ) ).to.be( 
	"fn1() ;\n" +
	"/*\n" +
	"console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"//*/\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { debug: true } ) ).to.be( 
	"fn1() ;\n" +
	"/*\n" +
	"console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"//*/\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { debug: 'toto' } ) ).to.be( 
	"fn1() ;\n" +
	"/*\n" +
	"console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"//*/\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { debug: 'trace' } ) ).to.be( 
	"fn1() ;\n" +
	"//*\n" +
	"console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"//*/\n" +
	"fn2() ;\n"
) ;
```

Block comment behaviour with string comparison.

```js
var code =
	"fn1() ;\n" +
	"//*# debug=error !\n" +
	"console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"//*/\n" +
	"fn2() ;\n" ;

expect( spp.preprocess( code , {} ) ).to.be( 
	"fn1() ;\n" +
	"//*\n" +
	"console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"//*/\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { toto: true } ) ).to.be( 
	"fn1() ;\n" +
	"//*\n" +
	"console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"//*/\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { debug: true } ) ).to.be( 
	"fn1() ;\n" +
	"//*\n" +
	"console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"//*/\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { debug: 'verbose' } ) ).to.be( 
	"fn1() ;\n" +
	"//*\n" +
	"console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"//*/\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { debug: 'error' } ) ).to.be( 
	"fn1() ;\n" +
	"/*\n" +
	"console.log( '[TRACE] Current state: ' , state ) ;\n" +
	"//*/\n" +
	"fn2() ;\n"
) ;
```

Multiple adjacent preprocessor command.

```js
var code =
	"fn1() ; \n" +
	"//#trace : console.log( '[TRACE] Something happens.' ) ;\n" +
	"//#verbose : console.log( '[VERBOSE] Something happens.' ) ;\n" +
	"//#warning : console.log( '[WARNING] Something happens.' ) ;\n" +
	"//#error : console.log( '[ERROR] Something happens.' ) ;\n" +
	"fn2() ;\n" ;

expect( spp.preprocess( code , {} ) ).to.be( 
	"fn1() ; \n" +
	"//console.log( '[TRACE] Something happens.' ) ;\n" +
	"//console.log( '[VERBOSE] Something happens.' ) ;\n" +
	"//console.log( '[WARNING] Something happens.' ) ;\n" +
	"//console.log( '[ERROR] Something happens.' ) ;\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { toto: true } ) ).to.be( 
	"fn1() ; \n" +
	"//console.log( '[TRACE] Something happens.' ) ;\n" +
	"//console.log( '[VERBOSE] Something happens.' ) ;\n" +
	"//console.log( '[WARNING] Something happens.' ) ;\n" +
	"//console.log( '[ERROR] Something happens.' ) ;\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { trace: true } ) ).to.be( 
	"fn1() ; \n" +
	"console.log( '[TRACE] Something happens.' ) ;\n" +
	"//console.log( '[VERBOSE] Something happens.' ) ;\n" +
	"//console.log( '[WARNING] Something happens.' ) ;\n" +
	"//console.log( '[ERROR] Something happens.' ) ;\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { verbose: true } ) ).to.be( 
	"fn1() ; \n" +
	"//console.log( '[TRACE] Something happens.' ) ;\n" +
	"console.log( '[VERBOSE] Something happens.' ) ;\n" +
	"//console.log( '[WARNING] Something happens.' ) ;\n" +
	"//console.log( '[ERROR] Something happens.' ) ;\n" +
	"fn2() ;\n"
) ;

expect( spp.preprocess( code , { trace: true , verbose: true , warning: true , error: true } ) ).to.be( 
	"fn1() ; \n" +
	"console.log( '[TRACE] Something happens.' ) ;\n" +
	"console.log( '[VERBOSE] Something happens.' ) ;\n" +
	"console.log( '[WARNING] Something happens.' ) ;\n" +
	"console.log( '[ERROR] Something happens.' ) ;\n" +
	"fn2() ;\n"
) ;
```

Type coercion.

```js
expect( spp.preprocess( "//#debug:debug = true ;" ) ).to.be( "//debug = true ;" ) ;
expect( spp.preprocess( "//#debug:debug = true ;" , { debug: true } ) ).to.be( "debug = true ;" ) ;
expect( spp.preprocess( "//#debug:debug = true ;" , { debug: '0' } ) ).to.be( "debug = true ;" ) ;
expect( spp.preprocess( "//#debug:debug = true ;" , { debug: 0 } ) ).to.be( "debug = true ;" ) ;
```

<a name="preprocessor-aliases"></a>
## Aliases
Numeric aliases.

```js
var aliases =
	"//# debug # error ~ 0\n" +
	"//# debug # warning ~ 1\n" +
	"//# debug # verbose ~ 2\n" +
	"//# debug # trace ~ 3\n" ;

expect( spp.preprocess( aliases + "//#debug=error:debug = true ;" , { debug: true } ) ).to.be( "\n\n\n\n//debug = true ;" ) ;
expect( spp.preprocess( aliases + "//#debug=error:debug = true ;" , { debug: 'error' } ) ).to.be( "\n\n\n\ndebug = true ;" ) ;
expect( spp.preprocess( aliases + "//#debug=error:debug = true ;" , { debug: 'verbose' } ) ).to.be( "\n\n\n\n//debug = true ;" ) ;
expect( spp.preprocess( aliases + "//#debug=error:debug = true ;" , { debug: 0 } ) ).to.be( "\n\n\n\ndebug = true ;" ) ;
expect( spp.preprocess( aliases + "//#debug=error:debug = true ;" , { debug: '0' } ) ).to.be( "\n\n\n\ndebug = true ;" ) ;

expect( spp.preprocess( aliases + "//#debug>=warning:debug = true ;" , { debug: 'error' } ) ).to.be( "\n\n\n\n//debug = true ;" ) ;
expect( spp.preprocess( aliases + "//#debug>=warning:debug = true ;" , { debug: 'warning' } ) ).to.be( "\n\n\n\ndebug = true ;" ) ;
expect( spp.preprocess( aliases + "//#debug>=warning:debug = true ;" , { debug: 'verbose' } ) ).to.be( "\n\n\n\ndebug = true ;" ) ;
expect( spp.preprocess( aliases + "//#debug>=warning:debug = true ;" , { debug: 'trace' } ) ).to.be( "\n\n\n\ndebug = true ;" ) ;
expect( spp.preprocess( aliases + "//#debug>=warning:debug = true ;" , { debug: '0' } ) ).to.be( "\n\n\n\n//debug = true ;" ) ;
expect( spp.preprocess( aliases + "//#debug>=warning:debug = true ;" , { debug: '1' } ) ).to.be( "\n\n\n\ndebug = true ;" ) ;
expect( spp.preprocess( aliases + "//#debug>=warning:debug = true ;" , { debug: '2' } ) ).to.be( "\n\n\n\ndebug = true ;" ) ;
expect( spp.preprocess( aliases + "//#debug>=warning:debug = true ;" , { debug: '3' } ) ).to.be( "\n\n\n\ndebug = true ;" ) ;
```

<a name="preprocessor-assignment"></a>
## Assignment
Simple assignment.

```js
expect( spp.preprocess( "//#debug -> myVar" , {} ) ).to.be( "" ) ;
expect( spp.preprocess( "//#debug -> myVar" , { debug: true } ) ).to.be( "myVar = true ;" ) ;
expect( spp.preprocess( "//#debug -> myVar" , { debug: 'trace' } ) ).to.be( "myVar = 'trace' ;" ) ;
expect( spp.preprocess( "//#debug -> myVar" , { debug: '42' } ) ).to.be( "myVar = 42 ;" ) ;
expect( spp.preprocess( "//#debug -> myVar" , { debug: 42 } ) ).to.be( "myVar = 42 ;" ) ;
expect( spp.preprocess( "//#debug -> myVar" , { debug: '0' } ) ).to.be( "myVar = 0 ;" ) ;
expect( spp.preprocess( "//#debug -> myVar" , { debug: 0 } ) ).to.be( "myVar = 0 ;" ) ;

expect( spp.preprocess( "//#debug -> obj.child.prop" , { debug: 'trace' } ) ).to.be( "obj.child.prop = 'trace' ;" ) ;
expect( spp.preprocess( "//#debug -> arr[4]" , { debug: 'trace' } ) ).to.be( "arr[4] = 'trace' ;" ) ;
```

Conditional assignment.

```js
expect( spp.preprocess( "//#debug = trace -> myVar" , { debug: 'trace' } ) ).to.be( "myVar = 'trace' ;" ) ;
expect( spp.preprocess( "//#debug = trace -> myVar" , { debug: 'error' } ) ).to.be( "" ) ;
expect( spp.preprocess( "//#debug > 1 -> myVar" , { debug: '2' } ) ).to.be( "myVar = 2 ;" ) ;
expect( spp.preprocess( "//#debug > 3 -> myVar" , { debug: '2' } ) ).to.be( "" ) ;
```

<a name="require"></a>
# Require
Should preprocess and require multiple instances of the same module.

```js
var catched , mod ;


catched = false ;

try {
	// It MUST fail
	mod = spp.require( './codeSample/module1.js' ) ;
}
catch ( error ) {
	//console.log( error ) ;
	catched = true ;
}

expect( catched ).to.be.ok() ;

mod = spp.require( __dirname + '/codeSample/module1.js' , {} , { multi: true } ) ;
expect( mod.fixedText() ).to.be( 'original' ) ;
expect( mod.value() ).to.be( undefined ) ;

mod = spp.require( __dirname + '/codeSample/module1.js' , { modified: true } , { multi: true } ) ;
expect( mod.fixedText() ).to.be( 'modified' ) ;
expect( mod.value() ).to.be( undefined ) ;

mod = spp.require( __dirname + '/codeSample/module1.js' , { param: 'toto' } , { multi: true } ) ;
expect( mod.fixedText() ).to.be( 'original' ) ;
expect( mod.value() ).to.be( 'toto' ) ;

mod = spp.require( __dirname + '/codeSample/module1.js' , { param: true } , { multi: true } ) ;
expect( mod.fixedText() ).to.be( 'original' ) ;
expect( mod.value() ).to.be( true ) ;

mod = spp.require( __dirname + '/codeSample/module1.js' , { param: 42 } , { multi: true } ) ;
expect( mod.fixedText() ).to.be( 'original' ) ;
expect( mod.value() ).to.be( 42 ) ;

mod = spp.require( __dirname + '/codeSample/module1.js' , { param: "42" } , { multi: true } ) ;
expect( mod.fixedText() ).to.be( 'original' ) ;
expect( mod.value() ).to.be( 42 ) ;
```

