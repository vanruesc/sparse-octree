import { Vector3 } from "../math/Vector3.js";
import { Vector3Like } from "../math/Vector3Like.js";
import { DataContainer } from "./DataContainer.js";
import { Node } from "./Node.js";
import { layout } from "./layout.js";

const c = /* @__PURE__ */ new Vector3();

/**
 * An octant.
 *
 * @param T - The type of the data.
 */

export class Octant<T = unknown> implements Node, DataContainer<T> {

	min: Vector3Like;
	max: Vector3Like;
	children: Octant<T>[] | null;
	data: T | null;

	/**
	 * Constructs a new octant.
	 *
	 * @param min - The lower bounds.
	 * @param max - The upper bounds.
	 */

	constructor(min?: Vector3Like, max?: Vector3Like) {

		this.min = (min === undefined) ? new Vector3() : Vector3.from(min);
		this.max = (max === undefined) ? new Vector3() : Vector3.from(max);
		this.children = null;
		this.data = null;

	}

	getCenter<V extends Vector3Like>(result: V): V {

		const { min, max } = this;
		result.x = (min.x + max.x) * 0.5;
		result.y = (min.y + max.y) * 0.5;
		result.z = (min.z + max.z) * 0.5;
		return result;

	}

	getDimensions<V extends Vector3Like>(result: V): V {

		const { min, max } = this;
		result.x = max.x - min.x;
		result.y = max.y - min.y;
		result.z = max.z - min.z;
		return result;

	}

	/**
	 * Splits this octant into eight smaller ones.
	 *
	 * @remarks The current child octants will be discarded.
	 */

	split(): void {

		const min = this.min;
		const max = this.max;
		const mid = this.getCenter(c);

		const children: Octant<T>[] = [];
		this.children = children;

		for(let i = 0; i < 8; ++i) {

			const combination = layout[i];
			const child = new (this.constructor as typeof Octant<T>)();

			child.min.x = (combination[0] === 0) ? min.x : mid.x;
			child.min.y = (combination[1] === 0) ? min.y : mid.y;
			child.min.z = (combination[2] === 0) ? min.z : mid.z;

			child.max.x = (combination[0] === 0) ? mid.x : max.x;
			child.max.y = (combination[1] === 0) ? mid.y : max.y;
			child.max.z = (combination[2] === 0) ? mid.z : max.z;

			children[i] = child;

		}

	}

}
