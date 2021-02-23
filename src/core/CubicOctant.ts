import { Vector3 } from "three";
import { layout } from "./layout";

/**
 * A vector.
 */

const c = new Vector3();

/**
 * A cubic octant.
 */

export class CubicOctant<T> implements Node<T> {

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

	constructor(min = new Vector3(), size = 0) {

		this.min = min;
		this.size = size;
		this.data = null;
		this.children = null;

	}

	/**
	 * The upper bounds of this octant.
	 *
	 * Attention: Accessing this property creates a new vector!
	 */

	get max(): Vector3 {

		return this.min.clone().addScalar(this.size);

	}

	/**
	 * Computes the center of this octant.
	 *
	 * @param target - A target vector.
	 * @return The center.
	 */

	getCenter(target: Vector3): Vector3 {

		return target.copy(this.min).addScalar(this.size * 0.5);

	}

	/**
	 * Returns the size of this octant as a vector.
	 *
	 * @param target - A target vector.
	 * @return The size.
	 */

	getDimensions(target: Vector3): Vector3 {

		return target.set(this.size, this.size, this.size);

	}

	/**
	 * Splits this octant into eight smaller ones.
	 */

	split() {

		const min = this.min;
		const mid = this.getCenter(c);
		const halfSize = this.size * 0.5;

		const children = this.children = [
			null, null, null, null,
			null, null, null, null
		];

		for(let i = 0; i < 8; ++i) {

			const combination = layout[i];
			const child = new this.constructor() as CubicOctant<T>;

			child.min.set(
				(combination[0] === 0) ? min.x : mid.x,
				(combination[1] === 0) ? min.y : mid.y,
				(combination[2] === 0) ? min.z : mid.z
			);

			child.size = halfSize;
			children[i] = child;

		}

	}

}
