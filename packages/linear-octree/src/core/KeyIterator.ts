import { Vector3 } from "three";
import { KeyDesign } from "./KeyDesign.js";

/**
 * A key range iterator.
 */

export class KeyIterator implements Iterator<number>, Iterable<number> {

	/**
	 * The key design.
	 */

	private readonly keyDesign: KeyDesign;

	/**
	 * The lower index bounds.
	 */

	private readonly min: Vector3;

	/**
	 * The upper index bounds.
	 */

	private readonly max: Vector3;

	/**
	 * The base key coordinates.
	 */

	private readonly keyBase: Vector3;

	/**
	 * The current key iteration coordinates.
	 */

	private readonly key: Vector3;

	/**
	 * The iteration limits.
	 */

	private readonly limit: Vector3;

	/**
	 * An iterator result.
	 */

	private result!: IteratorResult<number>;

	/**
	 * Constructs a new key iterator.
	 *
	 * This iterator returns all keys in the specified coordinate range, including those at min and max.
	 *
	 * @param keyDesign - A key design.
	 * @param min - The lower index bounds (zero-based uint coordinates).
	 * @param max - The upper index bounds (zero-based uint coordinates).
	 */

	constructor(keyDesign: KeyDesign, min: Vector3, max: Vector3) {

		this.keyDesign = keyDesign;
		this.min = min;
		this.max = max;
		this.keyBase = new Vector3();
		this.key = new Vector3();
		this.limit = new Vector3();

		this.reset();

	}

	reset(): KeyIterator {

		const keyDesign = this.keyDesign;
		const keyBase = this.keyBase;
		const limit = this.limit;
		const key = this.key;
		const min = this.min;
		const max = this.max;

		if(min.x >= 0 && min.y >= 0 && min.z >= 0 && min.x <= max.x && min.y <= max.y && min.z <= max.z) {

			keyBase.set(min.x, min.y * keyDesign.rangeX, min.z * keyDesign.rangeXY);
			limit.set(max.x, max.y * keyDesign.rangeX, max.z * keyDesign.rangeXY);
			key.copy(keyBase);

		} else {

			// The range is invalid, return no keys.
			keyBase.set(1, 1, 1);
			limit.set(0, 0, 0);
			key.copy(keyBase);

			throw new Error("Invalid key range");

		}

		this.result = {
			done: false,
			value: -1
		};

		return this;

	}

	next(): IteratorResult<number> {

		const result = this.result;
		const keyDesign = this.keyDesign;
		const keyBase = this.keyBase;
		const limit = this.limit;
		const key = this.key;

		if(key.z <= limit.z) {

			// Put the key pieces together.
			result.value = key.z + key.y + key.x;

			// Advance the key coordinates.
			++key.x;

			if(key.x > limit.x) {

				key.x = keyBase.x;
				key.y += keyDesign.rangeX;

				if(key.y > limit.y) {

					key.y = keyBase.y;
					key.z += keyDesign.rangeXY;

				}

			}

		} else {

			result.value = -1;
			result.done = true;

		}

		return result;

	}

	return(value: number): IteratorResult<number> {

		this.result.value = value;
		this.result.done = true;

		return this.result;

	}

	[Symbol.iterator](): Iterator<number> {

		return this;

	}

}
