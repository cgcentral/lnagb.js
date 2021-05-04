/**
 * @module IdentityMatrix
 * @author Nguyen Hoang Duong / <you_create@protonmail.com>
 * @description
 *
 * Contains the {@link module:IdentityMatrix~IdentityMatrix} class, which
 * encodes read-only identity matrices.
 *
 */

/**
 * Encodes *read-only* identity matrices and their operations. Being read-only
 * means instances of this class cannot have their elements modified (e.g. by
 * matrix addition or row operations).
 *
 * Properties are encoded similarly to {@link module:Matrix~Matrix}. Many
 * methods in `Matrix` are absent in this class. Some are implemented
 * differently. The `elements` property of an `IdentityMatrix` instance only
 * serves for compatibility with other matrix classes; `IdentityMatrix` class
 * methods don't rely on it themselves.
 *
 * While `rows` and `columns` are getters in the `Matrix` class, they are
 * properties here. For this reason, if you want to assign a variable to either
 * of them, you should add `.slice()` to clone, avoiding any unwanted problems
 * with pointers.
 */
class IdentityMatrix {

	/**
	 * Constructs a new `IdentityMatrix` instance, which encodes an identity
	 * matrix.
	 *
	 * @param {number} size Number of rows (or columns) in the new identity
	 * matrix.
	 */
	constructor( size ) {

		// These are the properties that a `Matrix` instance also has

		this.size = { rows: size, columns: size };
		this.numberOfEntries = size * size;
		this.elements = new Array( this.numberOfEntries ).fill( 0 );

		for ( let index = 0, _size = size + 1, _n = this.numberOfEntries;
			index < _n; index += _size ) this.elements[ index ] = 1;

		// These are what in `Matrix` would be getters, but are properties here
		// for efficiency.

		this.rank = size;
		this.rows = [];

		for ( let i = 0; i < size; i ++ ) {

			let row = new Array( size ).fill( 0 ); row[ i ] = 1;
			this.rows.push( row );

		}

		this.columns = this.rows.slice();

	}

	/**
	 * Returns the transpose of this identity matrix (which equals to itself
 	 * anyways).
	 *
	 * @return {IdentityMatrix} This matrix
	 */
	get transpose() {

		return this.clone();

	}

	/* COMMON METHODS */

	/**
	 * Creates and returns a clone of this identity matrix instance.
	 *
	 * @return {IdentityMatrix} A clone of this instance
	 */
	clone() {

		return new this.constructor( this.size.rows );

	}

	/* ACCESSORS */

	/**
	 * Returns the entry in the specified row and column in this matrix.
	 *
	 * @param {number} r The row that contains the entry (1-indexed).
	 * @param {number} c The column that contains the entry (1-indexed).
	 * @return {number} The entry
	 */
	entry( r, c ) {

		return ( r === c ) ? 1 : 0;

	}

	/**
	 * Returns a row in this matrix as a JavaScript array.
	 *
	 * @param {number} r Row number (1-indexed).
	 * @return {number[]} The row's entries
	 */
	row( r ) {

		let size = this.size.rows;
		let row = new Array( size ).fill( 0 );
		row[ r - 1 ] = 1;

		return row;

	}

	/**
	 * Returns a column in this matrix as a JavaScript array.
	 *
	 * @param {number} c Column number (1-indexed).
	 * @return {number[]} The column's entries
	 */
	column( c ) {

		return this.row( c );

	}

	/**
	 * Returns the main diagonal of this matrix. Since this is an identity
	 * matrix, the main diagonal consists of only 1s.
	 *
	 * @return {number[]} The entries in the main diagonal of this matrix
	 */
	mainDiagonal() {

		return new Array( this.size.rows ).fill( 1 );

	}

	/**
	 * Returns the leading coefficient of a row, which is always 1 since this is
	 * an identity matrix.
	 *
	 * @param {number} r Row number (1-indexed) (this will be disregarded).
	 * @return {number} The leading coefficient of the row
	 */
	leadingCoefficient( r ) { // eslint-disable-line no-unused-vars

		return 1;

	}

	/* ITERATORS */

	/**
	 * Executes a function for each entry in this matrix.
	 *
	 * @param {IdentityMatrix~forEach} callback The function to execute per
	 * iteration.
	 * @param {object} thisArg The argument to use as `this` in the function.
	 */
	forEach( callback, thisArg ) {

		let matrix = this;
		let _size = this.size;
		let _nCols = _size.columns;
		let _n = _nCols * _nCols;
		let r = 1, c = 1;

		for ( let index = 0; index < _n; index ++ ) {

			let entry = ( r === c ) ? 1 : 0;
			callback.bind( thisArg )( entry, r, c, index, matrix );
			c ++;

			if ( c > _nCols ) ( c = 1, r ++ );

		}

	}

	/**
	 * @callback IdentityMatrix~forEach
	 * @param {number} entry The current entry being processed.
	 * @param {number} r The entry's row number (1-indexed).
	 * @param {number} c The entry's column number (1-indexed).
	 * @param {number} index The index of the entry in `this.elements` (0-indexed).
	 * @param {IdentityMatrix} matrix The instance that this method was called upon.
	 */

	/**
	 * Executes a function for each row in this matrix.
	 *
	 * @param {IdentityMatrix~forEachRow} callback The function to execute per
	 * iteration.
	 * @param {object} thisArg The argument to use as `this` in the function.
	 */
	forEachRow( callback, thisArg ) {

		let matrix = this;
		let _nRows = this.size.rows;

		for ( let i = 0; i < _nRows; i ++ ) {

			let r = i + 1;
			let row = new Array( _nRows ).fill( 0 );
			row[ i ] = 1;

			callback.bind( thisArg )( row, r, matrix );

		}

	}

	/**
	 * @callback IdentityMatrix~forEachRow
	 * @param {number[]} row The current row being processed (with its entries).
	 * @param {number} r Current row number (1-indexed).
	 * @param {IdentityMatrix} matrix The instance that this method was called upon.
	 */

	/**
	 * Executes a function for each column in this matrix.
	 *
	 * @param {IdentityMatrix~forEachColumn} callback The function to execute per
	 * iteration.
	 * @param {object} thisArg The argument to use as `this` in the function.
	 */
	forEachColumn( callback, thisArg ) {

		this.forEachRow( callback, thisArg ); // yeah...

	}

	/**
	 * @callback IdentityMatrix~forEachColumn
	 * @param {number[]} column The current column being processed (with its entries).
	 * @param {number} c Current column number (1-indexed).
	 * @param {IdentityMatrix} matrix The instance that this method was called upon.
	 */

}

export { IdentityMatrix };
