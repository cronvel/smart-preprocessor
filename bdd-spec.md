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
	"console.log( debug ) ;\n"
) ;

expect( spp.preprocess( code , { toto: true } ) ).to.be( 
	"var debug = false ;\n" +
	"console.log( debug ) ;\n"
) ;

expect( spp.preprocess( code , { debug: true } ) ).to.be( 
	"var debug = false ;\n" +
	"debug = true ;\n" +
	"console.log( debug ) ;\n"
) ;
```

Simple remove line behaviour.

```js
var code =
	"var debug = false ;\n" +
	"debug = true ; //#! production\n" +
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
	"console.log( debug ) ;\n"
) ;
```

Uncomment a line comment with various spacing behaviour.

```js
expect( spp.preprocess( "//#debug:debug = true ;" ) ).to.be( "" ) ;
expect( spp.preprocess( "//#debug:debug = true ;" , { debug: true } ) ).to.be( "debug = true ;" ) ;

expect( spp.preprocess( "//# \t debug \t : \t debug = true ;" ) ).to.be( "" ) ;
expect( spp.preprocess( "//# \t debug \t : \t debug = true ;" , { debug: true } ) ).to.be( "debug = true ;" ) ;

expect( spp.preprocess( " \t //# \t debug \t : \t debug = true ;" ) ).to.be( "" ) ;
expect( spp.preprocess( " \t //# \t debug \t : \t debug = true ;" , { debug: true } ) ).to.be( " \t debug = true ;" ) ;
```

Remove the line of a comment with various spacing behaviour.

```js
expect( spp.preprocess( "debug = true ;//#!production" ) ).to.be( "debug = true ;" ) ;
expect( spp.preprocess( "debug = true ;//#!production" , { production: true } ) ).to.be( "" ) ;

expect( spp.preprocess( "debug = true ; \t //# \t ! \t production \t " ) ).to.be( "debug = true ;" ) ;
expect( spp.preprocess( "debug = true ; \t //# \t ! \t production \t " , { production: true } ) ).to.be( "" ) ;

expect( spp.preprocess( " \t debug = true ; \t //# \t ! \t production \t " ) ).to.be( " \t debug = true ;" ) ;
expect( spp.preprocess( " \t debug = true ; \t //# \t ! \t production \t " , { production: true } ) ).to.be( "" ) ;
```

