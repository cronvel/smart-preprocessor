/*
	Smart Preprocessor

	Copyright (c) 2014 - 2020 Cédric Ronvel

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

/* global describe, it, before, after */



const spp = require( '..' ) ;
const string = require( 'string-kit' ) ;
const fs = require( 'fs' ) ;





describe( "Preprocessor" , function() {
	
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
		
		it( "Behaviour of the <,<=,>,>= comparison operators" , function() {
			
			var fcode =
				"fn1() ;\n" +
				"//# debug %s %s : console.log( '[TRACE] Current state: ' , state ) ;\n" +
				"fn2() ;\n" ;
			
			var commentExpected =
				"fn1() ;\n" +
				"//console.log( '[TRACE] Current state: ' , state ) ;\n" +
				"fn2() ;\n" ;
			
			var uncommentExpected =
				"fn1() ;\n" +
				"console.log( '[TRACE] Current state: ' , state ) ;\n" +
				"fn2() ;\n" ;
			
			var check = function( fcode , op , rightValue , switches , expected ) {
				
				var code = string.format( fcode , op , rightValue ) ;
				
				expect( spp.preprocess( code , switches ) ).to.be( expected ) ;
			} ;
			
			check( fcode , '<' , 3 , { debug: 1 } , uncommentExpected ) ;
			check( fcode , '<=' , 3 , { debug: 1 } , uncommentExpected ) ;
			check( fcode , '>' , 3 , { debug: 1 } , commentExpected ) ;
			check( fcode , '>=' , 3 , { debug: 1 } , commentExpected ) ;
			
			check( fcode , '<' , 3 , { debug: 3 } , commentExpected ) ;
			check( fcode , '<=' , 3 , { debug: 3 } , uncommentExpected ) ;
			check( fcode , '>' , 3 , { debug: 3 } , commentExpected ) ;
			check( fcode , '>=' , 3 , { debug: 3 } , uncommentExpected ) ;
			
			check( fcode , '<' , 3 , { debug: 5 } , commentExpected ) ;
			check( fcode , '<=' , 3 , { debug: 5 } , commentExpected ) ;
			check( fcode , '>' , 3 , { debug: 5 } , uncommentExpected ) ;
			check( fcode , '>=' , 3 , { debug: 5 } , uncommentExpected ) ;
			
			check( fcode , '<' , 3 , { debug: 'blah' } , commentExpected ) ;
			check( fcode , '<=' , 3 , { debug: 'blah' } , commentExpected ) ;
			check( fcode , '>' , 3 , { debug: 'blah' } , commentExpected ) ;
			check( fcode , '>=' , 3 , { debug: 'blah' } , commentExpected ) ;
			
			check( fcode , '<' , 3 , {} , commentExpected ) ;
			check( fcode , '<=' , 3 , {} , commentExpected ) ;
			check( fcode , '>' , 3 , {} , commentExpected ) ;
			check( fcode , '>=' , 3 , {} , commentExpected ) ;
			
		} ) ;
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
	
} ) ;



describe( "Require" , function() {
	
	it( "Should preprocess and require multiple instances of the same module" , function() {
		
		var mod ;
		
		mod = module.preprocessorRequire( './codeSample/module1.js' , {} , { multi: true } ) ;
		expect( mod.fixedText() ).to.be( 'original' ) ;
		expect( mod.value() ).to.be( undefined ) ;
		
		mod = module.preprocessorRequire( './codeSample/module1.js' , { modified: true } , { multi: true } ) ;
		expect( mod.fixedText() ).to.be( 'modified' ) ;
		expect( mod.value() ).to.be( undefined ) ;
		
		mod = module.preprocessorRequire( './codeSample/module1.js' , { param: 'toto' } , { multi: true } ) ;
		expect( mod.fixedText() ).to.be( 'original' ) ;
		expect( mod.value() ).to.be( 'toto' ) ;
		
		mod = module.preprocessorRequire( './codeSample/module1.js' , { param: true } , { multi: true } ) ;
		expect( mod.fixedText() ).to.be( 'original' ) ;
		expect( mod.value() ).to.be( true ) ;
		
		mod = module.preprocessorRequire( './codeSample/module1.js' , { param: 42 } , { multi: true } ) ;
		expect( mod.fixedText() ).to.be( 'original' ) ;
		expect( mod.value() ).to.be( 42 ) ;
		
		mod = module.preprocessorRequire( './codeSample/module1.js' , { param: "42" } , { multi: true } ) ;
		expect( mod.fixedText() ).to.be( 'original' ) ;
		expect( mod.value() ).to.be( 42 ) ;
	} ) ;
	
	it( "Test the cache of .require()" ) ;
} ) ;


