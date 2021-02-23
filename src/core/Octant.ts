import { Vector3 } from "three";
import { layout } from "./layout";
import { Node } from "./Node";

/**
 * A vector.
 */

const c = new Vector3();

/**
 * An octant.
 */

export class Octant<T> implements Node<T> {

	/**
	 * Constructs a new octant.
	 *
	 * @param min - The lower bounds.
	 * @param max - The upper bounds.
	 */

	constructor(min = new Vector3(), max = new Vector3()) {

		this.min = min;
		this.max = max;
		this.data = null;
		this.children = null;

	}

	/**
	 * Calculates the center of this octant.
	 *
	 * @param target - A target vector.
	 * @return The center.
	 */

	getCenter(target: Vector3): Vector3 {

		return target.addVectors(this.min, this.max).multiplyScalar(0.5);

	}

	/**
	 * Calculates the size of this octant.
	 *
	 * @param target - A target vector.
	 * @return The size.
	 */

	getDimensions(target: Vector3): Vector3 {

		return target.subVectors(this.max, this.min);

	}

	/**
	 * Splits this octant into eight smaller ones.
	 */

	split() {

		const min = this.min;
		const max = this.max;
		const mid = this.getCenter(c);

		const children = this.children = [
			null, null, null, null,
			null, null, null, null
		];

		for(let i = 0; i < 8; ++i) {

			const combination = layout[i];
			const child = new this.constructor() as Octant<T>;

			child.min.set(
				(combination[0] === 0) ? min.x : mid.x,
				(combination[1] === 0) ? min.y : mid.y,
				(combination[2] === 0) ? min.z : mid.z
			);

			child.max.set(
				(combination[0] === 0) ? mid.x : max.x,
				(combination[1] === 0) ? mid.y : max.y,
				(combination[2] === 0) ? mid.z : max.z
			);

			children[i] = child;

		}

	}

}
