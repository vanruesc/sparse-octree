import { Octant } from "./Octant.js";

/**
 * An octant that stores information about the existence of child octants.
 *
 * @param T - The type of the octant data.
 */

export class IntermediateOctant<T> extends Octant<T> {

	/**
	 * An 8-bit mask that indicates the existence of the eight potential
	 * children.
	 *
	 * The order of the children follows the octant layout from `sparse-octree`:
	 *
	 * ```text
	 *    3____7
	 *  2/___6/|
	 *  | 1__|_5
	 *  0/___4/
	 * ```
	 */

	children: number;

	/**
	 * Constructs a new intermediate octant.
	 */

	constructor() {

		super();

		this.children = 0;

	}

}
