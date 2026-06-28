import { Box3 } from "three";

/**
 * Describes objects that can intersect with a 3D box.
 */

export interface BoxIntersector {

	/**
	 * Determines whether this object intersects the given box.
	 *
	 * @param box - A 3D box.
	 * @return True if this object intersects the box. Otherwise false.
	 */

	intersectsBox(box: Box3): boolean;

}
