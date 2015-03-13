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



// Create the object
var smartPreprocessor = {} ;

// Export it!
module.exports = smartPreprocessor ;



smartPreprocessor.preprocess = function preprocess( str , parameters )
{
	parameters = parameters || {} ;
	
	// Uncomment line tag
	str = str.replace( /(^|\n)([ \t]*)\/\/#[ \t]*([a-zA-Z0-9_-]+)[ \t]*:[ \t]*(.*)($|\n)/g ,
		function( match , sol , indent , parameter , code , eol ) {
			
			if ( parameters[ parameter ] ) { return sol + indent + code + eol ; }
			else { return sol ; }
		}
	) ;
	
	// Remove line tag
	str = str.replace( /(^|\n)([ \t]*)(.*?)[ \t]*\/\/#[ \t]*![ \t]*([a-zA-Z0-9_-]+)[ \t]*($|\n)/g ,
		function( match , sol , indent , code , parameter , eol ) {
			
			if ( parameters[ parameter ] ) { return sol ; }
			else { return sol + indent + code + eol ; }
		}
	) ;
	
	// Comment/uncomment block tag
	str = str.replace( /(^|\n)([ \t]*)\/\*#[ \t]*([a-zA-Z0-9_-]+)[ \t]*:[ \t]*($|\n)/g ,
		function( match , sol , indent , parameter , eol ) {
			
			if ( parameters[ parameter ] ) { return sol + indent + '//*' + eol ; }
			else { return sol + indent + '/*' + eol ; }
		}
	) ;
	
	// Comment/uncomment block tag
	str = str.replace( /(^|\n)([ \t]*)\/\/\*#[ \t]*![ \t]*([a-zA-Z0-9_-]+)[ \t]*($|\n)/g ,
		function( match , sol , indent , parameter , eol ) {
			
			if ( parameters[ parameter ] ) { return sol + indent + '/*' + eol ; }
			else { return sol + indent + '//*' + eol ; }
		}
	) ;
	
	return str ;
} ;





