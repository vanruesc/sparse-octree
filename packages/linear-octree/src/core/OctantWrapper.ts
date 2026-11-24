import { Node, Vector3, Vector3Like } from "sparse-octree";
import { Octant } from "./Octant.js";
import { OctantId } from "./OctantId.js";

const p = /* @__PURE__ */ new Vector3();

/**
 * An octant wrapper that stores positional information.
 *
 * @param T - The type of the octant data.
 */

export class OctantWrapper<T> implements Node {

	min: Vector3Like;
	max: Vector3Like;

	/**
	 * The octant.
	 */

	octant: Octant<T> | null;

	/**
	 * The octant ID.
	 */

	id: OctantId;

	/**
	 * Constructs a new octant wrapper.
	 *
	 * @param octant - An octant.
	 */

	constructor(octant: Octant<T> | null = null) {

		this.min = new Vector3();
		this.max = new Vector3();

		this.octant = octant;
		this.id = new OctantId();

	}

	/**
	 * Copies the given octant wrapper.
	 *
	 * @param octantWrapper - An octant wrapper.
	 * @return This octant wrapper.
	 */

	copy(octantWrapper: OctantWrapper<T>): OctantWrapper<T> {

		this.octant = octantWrapper.octant;
		this.id.copy(octantWrapper.id);
		const { min, max } = octantWrapper;
		this.min.x = min.x;
		this.min.y = min.y;
		this.min.z = min.z;
		this.max.x = max.x;
		this.max.y = max.y;
		this.max.z = max.z;

		return this;

	}

	/**
	 * Updates the bounds from key coordinates in a grid.
	 *
	 * @param keyX - The X coordinate in the grid.
	 * @param keyY - The Y coordinate in the grid.
	 * @param keyZ - The Z coordinate in the grid.
	 * @param cellSize - The size of a grid cell.
	 * @param origin - The lower bounds of the tree.
	 * @internal
	 */

	setBounds(keyX: number, keyY: number, keyZ: number, cellSize: Vector3Like, origin: Vector3Like): void {

		const { min, max } = this;
		min.x = keyX * cellSize.x + origin.x;
		min.y = keyY * cellSize.y + origin.y;
		min.z = keyZ * cellSize.z + origin.z;
		max.x = min.x + cellSize.x;
		max.y = min.y + cellSize.y;
		max.z = min.z + cellSize.z;

	}

	getCenter<V extends Vector3Like>(target: V): V {

		const { min, max } = this;
		target.x = (min.x + max.x) * 0.5;
		target.y = (min.y + max.y) * 0.5;
		target.z = (min.z + max.z) * 0.5;
		return target;

	}

	getDimensions<V extends Vector3Like>(target: V): V {

		const { min, max } = this;
		target.x = max.x - min.x;
		target.y = max.y - min.y;
		target.z = max.z - min.z;
		return target;

	}

	/**
	 * Clones this octant wrapper.
	 *
	 * @return The clone.
	 */

	clone(): OctantWrapper<T> {

		const clone = new (this.constructor as typeof OctantWrapper)();
		return clone.copy(this) as OctantWrapper<T>;

	}

	/**
	 * Calculates the squared distance to the given point.
	 *
	 * @param point - A point.
	 * @return The squared distance.
	 */

	distanceToSquared(point: Vector3Like): number {

		const { min, max } = this;
		const clamped = p.set(
			Math.max(min.x, Math.min(max.x, point.x)),
			Math.max(min.y, Math.min(max.y, point.y)),
			Math.max(min.z, Math.min(max.z, point.z))
		);
		return Vector3.distanceToSquared(clamped, point);

	}

	/**
	 * Calculates the squared distance from the center to the given point.
	 *
	 * @param point - A point.
	 * @return The squared distance.
	 */

	distanceToCenterSquared(point: Vector3Like): number {

		return Vector3.distanceToSquared(point, this.getCenter(p));

	}

	/**
	 * Checks if the given point lies inside the boundaries of this wrapper.
	 *
	 * @param point - A point.
	 * @return Whether the given point lies inside the boundaries.
	 */

	containsPoint(point: Vector3Like): boolean {

		const min = this.min;
		const max = this.max;

		return (
			point.x >= min.x &&
			point.y >= min.y &&
			point.z >= min.z &&
			point.x <= max.x &&
			point.y <= max.y &&
			point.z <= max.z
		);

	}

}
