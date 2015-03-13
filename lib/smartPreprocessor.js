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



// Load modules
//var tree = require( 'tree-kit' ) ;



// Create the object
var smartPreprocessor = {} ;

// Export it!
module.exports = smartPreprocessor ;



smartPreprocessor.preprocess = function preprocess( str , parameters )
{
	var aliases = {} ;
	
	parameters = parameters || {} ;
	
	// Constant definition
	//# parameter # value1 -> value2
	str = str.replace( /(^|\n)[ \t]*\/\/#[ \t]*([a-zA-Z0-9_.-]+)[ \t]*#[ \t]*([a-zA-Z0-9_.-]+)[ \t]*->[ \t]*([a-zA-Z0-9_.-]+)[ \t]*(?=$|\n)/g ,
		function( match , sol , parameter , value1 , value2 , eol ) {
			if ( ! aliases[ parameter ] ) { aliases[ parameter ] = {} ; }
			aliases[ parameter ][ value1 ] = value2 ;
			return '' ;
		}
	) ;
	
	//console.log( aliases ) ;
	
	// Uncomment line tag
	str = str.replace( /(^|\n)([ \t]*)\/\/#[ \t]*([a-zA-Z0-9_.-]+)(?:[ \t]*(=|<|>)[ \t]*([a-zA-Z0-9_.-]+))?[ \t]*:[ \t]*(.*)(?=$|\n)/g ,
		function( match , sol , indent , parameter , operator , value , code , eol ) {
			
			console.log( ">aliases: " , aliases ) ;
			if ( condition( parameters[ parameter ] , operator , value , aliases[ parameter ] ) ) { return sol + indent + code ; }
			else { return sol + indent + '//' + code ; }
		}
	) ;
	
	// Comment line tag
	str = str.replace( /(^|\n)([ \t]*)(.*?)[ \t]*\/\/#[ \t]*([a-zA-Z0-9_.-]+)(?:[ \t]*(=|<|>)[ \t]*([a-zA-Z0-9_.-]+))?[ \t]*![ \t]*(?=$|\n)/g ,
		function( match , sol , indent , code , parameter , operator , value , eol ) {
			
			if ( condition( parameters[ parameter ] , operator , value , aliases[ parameter ] ) ) { return sol + indent + '//' + code ; }
			else { return sol + indent + code ; }
		}
	) ;
	
	// Uncomment block tag
	str = str.replace( /(^|\n)([ \t]*)\/\*#[ \t]*([a-zA-Z0-9_.-]+)(?:[ \t]*(=|<|>)[ \t]*([a-zA-Z0-9_.-]+))?[ \t]*:[ \t]*(?=$|\n)/g ,
		function( match , sol , indent , parameter , operator , value , eol ) {
			
			if ( condition( parameters[ parameter ] , operator , value , aliases[ parameter ] ) ) { return sol + indent + '//*' ; }
			else { return sol + indent + '/*' ; }
		}
	) ;
	
	// Comment block tag
	str = str.replace( /(^|\n)([ \t]*)\/\/\*#[ \t]*([a-zA-Z0-9_.-]+)(?:[ \t]*(=|<|>)[ \t]*([a-zA-Z0-9_.-]+))?[ \t]*![ \t]*(?=$|\n)/g ,
		function( match , sol , indent , parameter , operator , value , eol ) {
			
			if ( condition( parameters[ parameter ] , operator , value , aliases[ parameter ] ) ) { return sol + indent + '/*' ; }
			else { return sol + indent + '//*' ; }
		}
	) ;
	
	return str ;
} ;



function condition( leftValue , operator , rightValue , aliases )
{
	var parsed , leftIsNumber , rightIsNumber ;
	
	// If no leftValue, it's false
	if ( leftValue === undefined ) { return false ; }
	
	// If no operator, it is true (only undefined return false, 0 MUST return true)
	if ( ! operator ) { return true ; }
	
	
	// Replace alias
	console.log( "Aliases: " , aliases ) ;
	if ( aliases && typeof leftValue === 'string' && aliases[ leftValue ] !== undefined ) { leftValue = aliases[ leftValue ] ; }
	if ( aliases && typeof rightValue === 'string' && aliases[ rightValue ] !== undefined ) { rightValue = aliases[ rightValue ] ; }
	
	// Cast to number if possible
	parsed = parseFloat( leftValue ) ;
	if ( ! isNaN( parsed ) ) { leftValue = parsed ; leftIsNumber = true ; }
	
	parsed = parseFloat( rightValue ) ;
	if ( ! isNaN( parsed ) ) { rightValue = parsed ; rightIsNumber = true ; }
	
	console.log( "values: " , [ leftValue , rightValue ] ) ;
	
	// Equals operators...
	if ( operator === '=' ) { return leftValue === rightValue ; }
	
	// Below, we will check with < and > operator, so if one value is not a number, the condition return false
	if ( ! leftIsNumber || ! rightIsNumber ) { return false ; }
	
	if ( operator === '<' ) { return leftValue < rightValue ; }
	
	if ( operator === '>' ) { return leftValue > rightValue ; }
	
	// Should never happen
	return false ;
}



