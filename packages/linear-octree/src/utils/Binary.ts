/**
 * A collection of binary helper functions.
 */

export class Binary {

	/**
	 * Interpretes the given string as a binary number.
	 *
	 * @param s - A string that represents a binary number.
	 * @return The parsed number.
	 */

	static parseBin(s: string): number {

		return parseInt(s, 2);

	}

	/**
	 * Creates a binary string representation of the given number.
	 *
	 * @param n - A number.
	 * @param minBits - The minimum length of the string.
	 * @return The binary representation.
	 */

	static toString(n: number, minBits = 64): string {

		const sign = (n < 0) ? "-" : "";
		return sign + Math.abs(n).toString(2).padStart(minBits, "0");

	}

}
