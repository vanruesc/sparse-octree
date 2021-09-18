import { Vector3 } from "three";
import { DataContainer } from "./DataContainer";
import { Node } from "./Node";
import { layout } from "./layout";

const c = new Vector3();

/**
 * An octant.
 *
 * @param T - The type of the data.
 */

export class Octant<T> implements Node, DataContainer<T> {

	min: Vector3;
	max: Vector3;
	children: Node[];
	data: T;

	/**
	 * Constructs a new octant.
	 *
	 * @param min - The lower bounds.
	 * @param max - The upper bounds.
	 */

	constructor(min = new Vector3(), max = new Vector3()) {

		this.min = min;
		this.max = max;
		this.children = null;
		this.data = null;

	}

	getCenter(result: Vector3): Vector3 {

		return result.addVectors(this.min, this.max).multiplyScalar(0.5);

	}

	getDimensions(result: Vector3): Vector3 {

		return result.subVectors(this.max, this.min);

	}

	/**
	 * Splits this octant into eight smaller ones.
	 */

	split(): void {

		const min = this.min;
		const max = this.max;
		const mid = this.getCenter(c);

		const children: Node[] = this.children = [
			null, null, null, null,
			null, null, null, null
		];

		for(let i = 0; i < 8; ++i) {

			const combination = layout[i];
			const child = new (<typeof Octant> this.constructor)();

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
