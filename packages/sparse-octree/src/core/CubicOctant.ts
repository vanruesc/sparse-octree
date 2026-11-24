import { Vector3 } from "../math/Vector3.js";
import { Vector3Like } from "../math/Vector3Like.js";
import { DataContainer } from "./DataContainer.js";
import { Node } from "./Node.js";
import { layout } from "./layout.js";

const c = /* @__PURE__ */ new Vector3();

/**
 * A cubic octant.
 *
 * @param T - The type of the data.
 */

export class CubicOctant<T = unknown> implements Node, DataContainer<T> {

	min: Vector3Like;
	children: CubicOctant<T>[] | null;
	data: T | null;

	/**
	 * The size of this octant.
	 */

	size: number;

	/**
	 * Constructs a new cubic octant.
	 *
	 * @param min - The lower bounds.
	 * @param size - The size of the octant.
	 */

	constructor(min?: Vector3Like, size = 0) {

		this.min = (min === undefined) ? new Vector3() : Vector3.from(min);
		this.size = size;
		this.children = null;
		this.data = null;

	}

	/**
	 * The upper bounds of this octant.
	 *
	 * Attention: Accessing this property creates a new vector!
	 */

	get max(): Vector3Like {

		const { min, size } = this;
		return new Vector3(min.x + size, min.y + size, min.z + size);

	}

	/**
	 * Computes the center of this octant.
	 *
	 * @param target - A target vector.
	 * @return The center.
	 */

	getCenter<V extends Vector3Like>(target: V): V {

		const { min } = this;
		const halfSize = this.size * 0.5;
		target.x = min.x + halfSize;
		target.y = min.y + halfSize;
		target.z = min.z + halfSize;
		return target;

	}

	/**
	 * Returns the size of this octant as a vector.
	 *
	 * @param target - A target vector.
	 * @return The size.
	 */

	getDimensions<V extends Vector3Like>(target: V): V {

		const { size } = this;
		target.x = size;
		target.y = size;
		target.z = size;
		return target;

	}

	/**
	 * Splits this octant into eight smaller ones.
	 */

	split(): void {

		const min = this.min;
		const mid = this.getCenter(c);
		const halfSize = this.size * 0.5;

		const children: CubicOctant<T>[] = [];
		this.children = children;

		for(let i = 0; i < 8; ++i) {

			const combination = layout[i];
			const child = new (this.constructor as typeof CubicOctant<T>)();

			child.min.x = (combination[0] === 0) ? min.x : mid.x;
			child.min.y = (combination[1] === 0) ? min.y : mid.y;
			child.min.z = (combination[2] === 0) ? min.z : mid.z;

			child.size = halfSize;
			children[i] = child;

		}

	}

}
