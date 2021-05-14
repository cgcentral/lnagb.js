/**
 * @module Algebra
 * @author Nguyen Hoang Duong / <you_create@protonmail.com>
 * @description
 *
 * Contains algebraic operations and several functions for dealing with algebra.
 *
 */

/**
 * Computes and returns the result of the linear combination of 2 sequences
 * of numbers. The sequences must have the same number of terms.
 *
 * @param {number[]} p First sequence of numbers.
 * @param {number[]} q Second sequence of numbers.
 * @returns {number} The result of the linear combination of the two sequences
 */
function linearCombination( p, q ) {

	return p.reduce( ( result, v, i ) => result + p[ i ] * q[ i ], 0 );

}

export { linearCombination };
