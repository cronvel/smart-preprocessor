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

"use strict" ;



const fs = require( 'fs' ) ;
const path = require( 'path' ) ;
//const osTmpDir = require( 'os' ).tmpdir() ;

// This is the Node.js core Module class
const Module = require( 'module' ) ;



const smartPreprocessor = {} ;
module.exports = smartPreprocessor ;



smartPreprocessor.preprocess = ( str , parameters ) => {
	var aliases = {} ;

	if ( ! parameters || typeof parameters !== 'object' ) { parameters = {} ; }

	// Aliases definition
	//# parameter # value1 -> value2
	str = str.replace( /^[ \t]*\/\/#[ \t]*([a-zA-Z0-9_.-]+)[ \t]*#[ \t]*([a-zA-Z0-9_.-]+)[ \t]*~[ \t]*([a-zA-Z0-9_.-]+)[ \t]*$/mg ,
		( match , parameter , value1 , value2 ) => {
			if ( ! aliases[ parameter ] ) { aliases[ parameter ] = {} ; }
			aliases[ parameter ][ value1 ] = value2 ;
			return '' ;
		}
	) ;

	//console.log( aliases ) ;

	// Assignment
	str = str.replace( /^([ \t]*)\/\/#[ \t]*([a-zA-Z0-9_.-]+)(?:[ \t]*(=|<|<=|>=|>)[ \t]*([a-zA-Z0-9_.-]+))?[ \t]*->[ \t]*(.*?)[ \t]*$/mg ,
		( match , indent , parameter , operator , value , code ) => {
			var assignment , parsed ;

			if ( ! evalCondition( parameters[ parameter ] , operator , value , aliases[ parameter ] ) ) { return '' ; }

			assignment = indent + code + ' = ' ;

			if ( parameters[ parameter ] === true ) {
				assignment += 'true' ;
			}
			else if ( typeof parameters[ parameter ] === 'number' ) {
				assignment += parameters[ parameter ] ;
			}
			else if ( typeof parameters[ parameter ] === 'string' ) {
				parsed = parseFloat( parameters[ parameter ] ) ;
				if ( ! isNaN( parsed ) ) { assignment += parsed ; }
				else { assignment += "'" + parameters[ parameter ] + "'" ; }
			}
			else {
				return '' ;
			}

			assignment += ' ;' ;

			return assignment ;
		}
	) ;

	// Uncomment line tag
	str = str.replace( /^([ \t]*)\/\/#[ \t]*([a-zA-Z0-9_.-]+)(?:[ \t]*(=|<|<=|>=|>)[ \t]*([a-zA-Z0-9_.-]+))?[ \t]*:[ \t]*(.*)$/mg ,
		( match , indent , parameter , operator , value , code ) => {
			if ( evalCondition( parameters[ parameter ] , operator , value , aliases[ parameter ] ) ) { return indent + code ; }
			return indent + '//' + code ;
		}
	) ;

	// Comment line tag
	str = str.replace( /^([ \t]*)(.*?)[ \t]*\/\/#[ \t]*([a-zA-Z0-9_.-]+)(?:[ \t]*(=|<|<=|>=|>)[ \t]*([a-zA-Z0-9_.-]+))?[ \t]*![ \t]*$/mg ,
		( match , indent , code , parameter , operator , value ) => {
			if ( evalCondition( parameters[ parameter ] , operator , value , aliases[ parameter ] ) ) { return indent + '//' + code ; }
			return indent + code ;
		}
	) ;

	// Uncomment block tag
	str = str.replace( /^([ \t]*)\/\*#[ \t]*([a-zA-Z0-9_.-]+)(?:[ \t]*(=|<|<=|>=|>)[ \t]*([a-zA-Z0-9_.-]+))?[ \t]*:[ \t]*$/mg ,
		( match , indent , parameter , operator , value ) => {
			if ( evalCondition( parameters[ parameter ] , operator , value , aliases[ parameter ] ) ) { return indent + '//*' ; }
			return indent + '/*' ;
		}
	) ;

	// Comment block tag
	str = str.replace( /^([ \t]*)\/\/\*#[ \t]*([a-zA-Z0-9_.-]+)(?:[ \t]*(=|<|<=|>=|>)[ \t]*([a-zA-Z0-9_.-]+))?[ \t]*![ \t]*$/mg ,
		( match , indent , parameter , operator , value ) => {
			if ( evalCondition( parameters[ parameter ] , operator , value , aliases[ parameter ] ) ) { return indent + '/*' ; }
			return indent + '//*' ;
		}
	) ;

	return str ;
} ;



function evalCondition( leftValue , operator , rightValue , aliases ) {
	var parsed , leftIsNumber , rightIsNumber ;

	// If no leftValue, it's false
	if ( leftValue === undefined ) { return false ; }

	// If no operator, it is true (only undefined return false, 0 MUST return true)
	if ( ! operator ) { return true ; }


	// Replace alias
	if ( aliases && typeof leftValue === 'string' && aliases[ leftValue ] !== undefined ) { leftValue = aliases[ leftValue ] ; }
	if ( aliases && typeof rightValue === 'string' && aliases[ rightValue ] !== undefined ) { rightValue = aliases[ rightValue ] ; }

	// Cast to number if possible
	parsed = parseFloat( leftValue ) ;
	if ( ! isNaN( parsed ) ) { leftValue = parsed ; leftIsNumber = true ; }

	parsed = parseFloat( rightValue ) ;
	if ( ! isNaN( parsed ) ) { rightValue = parsed ; rightIsNumber = true ; }

	// Equals operators...
	if ( operator === '=' ) { return leftValue === rightValue ; }

	// Below, we will check with < and > operator, so if one value is not a number, the condition return false
	if ( ! leftIsNumber || ! rightIsNumber ) { return false ; }

	if ( operator === '<' ) { return leftValue < rightValue ; }

	if ( operator === '<=' ) { return leftValue <= rightValue ; }

	if ( operator === '>' ) { return leftValue > rightValue ; }

	if ( operator === '>=' ) { return leftValue >= rightValue ; }

	// Should never happen
	return false ;
}



// Must be attached to a module object
Module.prototype.preprocessorRequire =
smartPreprocessor.preprocessorRequire = function( id , parameters , options ) {
	var resolvedPath , outputPath , outputFilename , sppId , content ;

	if ( ! options || typeof options !== 'object' ) { options = {} ; }

	// Unfortunately, module.require.resolve() does not exist
	//sppId = resolvedPath = this.require.resolve( id ) ;
	//sppId = resolvedPath = require.resolve( id ) ;
	sppId = resolvedPath = Module._resolveFilename( id , this ) ;
	//console.log( "sppId:" , sppId ) ;

	if ( options.multi ) { sppId += JSON.stringify( parameters ) ; }

	if ( smartPreprocessor.requireCache[ sppId ] ) {
		//console.log( 'Cache hit!' ) ;
		return smartPreprocessor.requireCache[ sppId ].exports ;
	}

	content = smartPreprocessor.preprocess(
		fs.readFileSync( resolvedPath , { encoding: 'utf8' } ) ,
		parameters
	) ;

	var module_ = new Module( resolvedPath , this ) ;

	module_.filename = resolvedPath ;
	module_.paths = Module._nodeModulePaths( path.dirname( resolvedPath ) ) ;

	//console.log( module_ ) ;

	module_._compile( content , resolvedPath ) ;
	module_.loaded = true ;

	// Put the preprocecessed module in the cache
	smartPreprocessor.requireCache[ sppId ] = module_ ;

	return module_.exports ;
} ;



// The module cache, so same files are not preprocessed again and again
smartPreprocessor.requireCache = {} ;



// Build synchronously: preprocess a file and write the build.
smartPreprocessor.buildSync = ( inputPath , outputPath , parameters ) => {
	fs.writeFileSync(
		outputPath ,
		smartPreprocessor.preprocess(
			fs.readFileSync( inputPath , { encoding: 'utf8' } ) ,
			parameters
		) ,
		{ encoding: 'utf8' }
	) ;
} ;



// Preprocess a file and write it to standard output
smartPreprocessor.buildStdout = ( inputPath , parameters ) => {
	process.stdout.write(
		smartPreprocessor.preprocess(
			fs.readFileSync( inputPath , { encoding: 'utf8' } ) ,
			parameters
		)
	) ;
} ;





/* Command Line Interface */



smartPreprocessor.cli = () => {
	var source , dest , parameters ;

	if ( process.argv.length < 3 ) {
		console.error( 'Usage is: smart-preprocessor <source-file> [dest-file] [--parameter1 value1] [--parameter2 value2] [...]' ) ;
		process.exit( 1 ) ;
	}

	parameters = require( 'minimist' )( process.argv.slice( 2 ) ) ;
	//console.log( parameters ) ;

	source = parameters._[ 0 ] ;
	dest = parameters._[ 1 ] ;

	// Cleanup parameters...
	delete parameters._ ;

	try {
		if ( dest ) { smartPreprocessor.buildSync( source , dest , parameters ) ; }
		else { smartPreprocessor.buildStdout( source , parameters ) ; }
	}
	catch ( error ) {
		console.error( 'Some errors occurs: ' , error ) ;
		process.exit( 1 ) ;
	}

	process.exit( 0 ) ;
} ;

