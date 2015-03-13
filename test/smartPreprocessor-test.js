/*
	The Cedric's Swiss Knife (CSK) - Smart Preprocessor
	
	Copyright (c) 2015 Cédric Ronvel 
	
	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

/* jshint unused:false */
/* global describe, it, before, after */



var spp = require( '../lib/smartPreprocessor.js' ) ;
var fs = require( 'fs' ) ;

var expect = require( 'expect.js' ) ;





describe( "preprocess()" , function() {
	
	it( "Simple line uncomment behaviour" , function() {
		
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
	} ) ;
	
	it( "Simple line comment behaviour" , function() {
		
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
			"//debug = true ;\n" +
			"console.log( debug ) ;\n"
		) ;
	} ) ;
	
	it( "Uncomment a line comment with various spacing behaviour" , function() {
		
		expect( spp.preprocess( "//#debug:debug = true ;" ) ).to.be( "//debug = true ;" ) ;
		expect( spp.preprocess( "//#debug:debug = true ;" , { debug: true } ) ).to.be( "debug = true ;" ) ;
		
		expect( spp.preprocess( "//# \t debug \t : \t debug = true ;" ) ).to.be( "//debug = true ;" ) ;
		expect( spp.preprocess( "//# \t debug \t : \t debug = true ;" , { debug: true } ) ).to.be( "debug = true ;" ) ;
		
		expect( spp.preprocess( " \t //# \t debug \t : \t debug = true ;" ) ).to.be( " \t //debug = true ;" ) ;
		expect( spp.preprocess( " \t //# \t debug \t : \t debug = true ;" , { debug: true } ) ).to.be( " \t debug = true ;" ) ;
	} ) ;
	
	it( "Comment the line with various spacing behaviour" , function() {
		
		expect( spp.preprocess( "debug = true ;//#!production" ) ).to.be( "debug = true ;" ) ;
		expect( spp.preprocess( "debug = true ;//#!production" , { production: true } ) ).to.be( "//debug = true ;" ) ;
		
		expect( spp.preprocess( "debug = true ; \t //# \t ! \t production \t " ) ).to.be( "debug = true ;" ) ;
		expect( spp.preprocess( "debug = true ; \t //# \t ! \t production \t " , { production: true } ) ).to.be( "//debug = true ;" ) ;
		
		expect( spp.preprocess( " \t debug = true ; \t //# \t ! \t production \t " ) ).to.be( " \t debug = true ;" ) ;
		expect( spp.preprocess( " \t debug = true ; \t //# \t ! \t production \t " , { production: true } ) ).to.be( " \t //debug = true ;" ) ;
	} ) ;
	
	it( "Simple block uncomment behaviour" , function() {
		
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
	} ) ;
	
	it( "Simple block comment behaviour" , function() {
		
		var code =
			"var debug = false ;\n" +
			"//*#! production\n" +
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
	} ) ;
	
	it( "Line uncomment behaviour with string comparison" , function() {
		
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
	} ) ;
	
	it( "Line comment behaviour with string comparison" , function() {
		
		var code =
			"fn1() ;\n" +
			"console.log( '[VERBOSE] Loading...' ) ; //#!debug=error\n" +
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
	} ) ;
	
	it( "Block uncomment behaviour with string comparison" , function() {
		
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
	} ) ;
	
	it( "Block comment behaviour with string comparison" , function() {
		
		var code =
			"fn1() ;\n" +
			"//*#!debug=error\n" +
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
	} ) ;
	
} ) ;


//var code = fs.readFileSync( __dirname + '/codeSample/test1.js' , 'utf8' ) ;



