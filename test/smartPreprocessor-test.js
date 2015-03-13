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





describe( "Comment/uncomment" , function() {
	
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
		
		expect( spp.preprocess( "debug = true ;//#production!" ) ).to.be( "debug = true ;" ) ;
		expect( spp.preprocess( "debug = true ;//#production!" , { production: true } ) ).to.be( "//debug = true ;" ) ;
		
		expect( spp.preprocess( "debug = true ; \t //# \t production \t ! \t " ) ).to.be( "debug = true ;" ) ;
		expect( spp.preprocess( "debug = true ; \t //# \t production \t ! \t " , { production: true } ) ).to.be( "//debug = true ;" ) ;
		
		expect( spp.preprocess( " \t debug = true ; \t //# \t production \t ! \t " ) ).to.be( " \t debug = true ;" ) ;
		expect( spp.preprocess( " \t debug = true ; \t //# \t production \t ! \t " , { production: true } ) ).to.be( " \t //debug = true ;" ) ;
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
	} ) ;
	
	it( "Multiple adjacent preprocessor command" , function() {
		
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
	} ) ;
	
	it( "Type coercion" , function() {
		
		expect( spp.preprocess( "//#debug:debug = true ;" ) ).to.be( "//debug = true ;" ) ;
		expect( spp.preprocess( "//#debug:debug = true ;" , { debug: true } ) ).to.be( "debug = true ;" ) ;
		expect( spp.preprocess( "//#debug:debug = true ;" , { debug: '0' } ) ).to.be( "debug = true ;" ) ;
		expect( spp.preprocess( "//#debug:debug = true ;" , { debug: 0 } ) ).to.be( "debug = true ;" ) ;
	} ) ;
	
	it( "<,<=,>,>= operators" ) ;
} ) ;



describe( "Aliases" , function() {
	
	it( "Numeric aliases" , function() {
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
	} ) ;
	
} ) ;



describe( "Assignment" , function() {
	
	it( "Simple assignment" , function() {
		
		expect( spp.preprocess( "//#debug -> myVar" , {} ) ).to.be( "" ) ;
		expect( spp.preprocess( "//#debug -> myVar" , { debug: true } ) ).to.be( "myVar = true ;" ) ;
		expect( spp.preprocess( "//#debug -> myVar" , { debug: 'trace' } ) ).to.be( "myVar = 'trace' ;" ) ;
		expect( spp.preprocess( "//#debug -> myVar" , { debug: '42' } ) ).to.be( "myVar = 42 ;" ) ;
		expect( spp.preprocess( "//#debug -> myVar" , { debug: 42 } ) ).to.be( "myVar = 42 ;" ) ;
		expect( spp.preprocess( "//#debug -> myVar" , { debug: '0' } ) ).to.be( "myVar = 0 ;" ) ;
		expect( spp.preprocess( "//#debug -> myVar" , { debug: 0 } ) ).to.be( "myVar = 0 ;" ) ;
		
		expect( spp.preprocess( "//#debug -> obj.child.prop" , { debug: 'trace' } ) ).to.be( "obj.child.prop = 'trace' ;" ) ;
		expect( spp.preprocess( "//#debug -> arr[4]" , { debug: 'trace' } ) ).to.be( "arr[4] = 'trace' ;" ) ;
	} ) ;
	
	it( "Conditional assignment" , function() {
		
		expect( spp.preprocess( "//#debug = trace -> myVar" , { debug: 'trace' } ) ).to.be( "myVar = 'trace' ;" ) ;
		expect( spp.preprocess( "//#debug = trace -> myVar" , { debug: 'error' } ) ).to.be( "" ) ;
		expect( spp.preprocess( "//#debug > 1 -> myVar" , { debug: '2' } ) ).to.be( "myVar = 2 ;" ) ;
		expect( spp.preprocess( "//#debug > 3 -> myVar" , { debug: '2' } ) ).to.be( "" ) ;
	} ) ;
	
} ) ;


//var code = fs.readFileSync( __dirname + '/codeSample/test1.js' , 'utf8' ) ;



