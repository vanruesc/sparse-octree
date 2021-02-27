import { Node } from "./Node";

/**
 * A tree data structure.
 */

export interface Tree extends Node {

	/**
	 * Calculates the depth of this tree.
	 *
	 * @return The depth.
	 */

	getDepth(): number;

	/**
	 * Fetches all nodes of a specific depth level.
	 *
	 * @param level - The depth level.
	 * @return The nodes.
	 */

	findNodesByLevel(level: number): Node[];

}
