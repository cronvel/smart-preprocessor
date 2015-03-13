# TOC
   - [preprocess()](#preprocess)
<a name=""></a>
 
<a name="preprocess"></a>
# preprocess()
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

