import { DataContainer } from "sparse-octree";

/**
 * An octant.
 *
 * @param T - The type of the octant data.
 */

export class Octant<T> implements DataContainer<T> {

	data: T | null;

	/**
	 * Constructs a new octant.
	 */

	constructor() {

		this.data = null;

	}

}
