import { Vector3 } from "three";
import { Node } from "sparse-octree";
import { Octant } from "./Octant.js";
import { OctantId } from "./OctantId.js";

const p = /* @__PURE__ */ new Vector3();

/**
 * An octant wrapper that stores positional information.
 *
 * @param T - The type of the octant data.
 */

export class OctantWrapper<T> implements Node {

	min: Vector3;
	max: Vector3;

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
		this.min.copy(octantWrapper.min);
		this.max.copy(octantWrapper.max);

		return this;

	}

	getCenter(target: Vector3): Vector3 {

		return target.addVectors(this.min, this.max).multiplyScalar(0.5);

	}

	getDimensions(target: Vector3): Vector3 {

		return target.subVectors(this.max, this.min);

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

	distanceToSquared(point: Vector3): number {

		const clampedPoint = p.copy(point).clamp(this.min, this.max);
		return clampedPoint.sub(point).lengthSq();

	}

	/**
	 * Calculates the squared distance from the center to the given point.
	 *
	 * @param point - A point.
	 * @return The squared distance.
	 */

	distanceToCenterSquared(point: Vector3): number {

		const center = this.getCenter(p);

		const dx = point.x - center.x;
		const dy = point.y - center.x;
		const dz = point.z - center.z;

		return dx * dx + dy * dy + dz * dz;

	}

	/**
	 * Checks if the given point lies inside the boundaries of this wrapper.
	 *
	 * @param point - A point.
	 * @return Whether the given point lies inside the boundaries.
	 */

	containsPoint(point: Vector3): boolean {

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
