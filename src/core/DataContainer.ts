/**
 * A generic data container.
 *
 * @param T - The type of the data.
 */

export interface DataContainer<T = unknown> {

	/**
	 * The data.
	 */

	data: T | null;

}
