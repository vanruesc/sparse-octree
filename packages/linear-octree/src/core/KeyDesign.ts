import { Box3, EventDispatcher, Vector3, Vector4 } from "three";
import { Binary } from "../utils/Binary.js";
import { BaseEventMap } from "./BaseEventMap.js";
import { KeyIterator } from "./KeyIterator.js";

const DWORD_BITS = 32;
const RANGE_DWORD = Math.pow(2, DWORD_BITS);

const BITS = 53;
const HI_BITS = 21;
const LO_BITS = 32;

/**
 * A design for octant keys.
 *
 * 3D coordinates are packed into a single integer to obtain a unique key. This class describes the bit allotment for
 * each coordinate and provides methods for key packing and unpacking.
 *
 * See {@link KeyDesign.BITS} for the total amount of available bits.
 */

export class KeyDesign extends EventDispatcher<BaseEventMap> {

	/**
	 * Triggers when a key design has changed.
	 *
	 * @event
	 */

	static readonly EVENT_CHANGE = "change";

	/**
	 * The total amount of available bits for safe integers.
	 *
	 * JavaScript uses IEEE 754 binary64 Doubles for all numbers and, as a result, only supports 53-bit Integers natively.
	 *
	 * `BigInt` is not an option due to the following reasons:
	 *  - operations on `BigInt` are not constant time (unpredictable performance)
	 *  - only supports signed integers (no `>>>` operator)
	 *
	 * For more information see: http://2ality.com/2012/04/number-encoding.html
	 */

	static readonly BITS = BITS;

	/**
	 * The amount of available bits in the high DWord (21).
	 *
	 * In JavaScript, bit operations can only be applied to DWords (32-bit).
	 * All 53-bit keys must be split into a high and a low part for processing.
	 */

	static readonly HI_BITS = HI_BITS;

	/**
	 * The amount of available bits in the low DWord (32).
	 *
	 * In JavaScript, bit operations can only be applied to DWords (32-bit).
	 * All 53-bit keys must be split into a high and a low part for processing.
	 */

	static readonly LO_BITS = LO_BITS;

	/**
	 * The bit allotments.
	 */

	private readonly bits: Vector3;

	/**
	 * The key range.
	 */

	private readonly range: Vector4;

	/**
	 * A bit mask for the X-coordinate. The first item holds the low bits, the second one holds the high bits.
	 */

	private readonly maskX: [number, number];

	/**
	 * A bit mask for the Y-coordinate. The first item holds the low bits, the second one holds the high bits.
	 */

	private readonly maskY: [number, number];

	/**
	 * A bit mask for the Z-coordinate. The first item holds the low bits, the second one holds the high bits.
	 */

	private readonly maskZ: [number, number];

	/**
	 * Constructs a new key design.
	 *
	 * @param x - The amount of bits used for the X-coordinate.
	 * @param y - The amount of bits used for the Y-coordinate.
	 * @param z - The amount of bits used for the Z-coordinate.
	 */

	constructor(x = 8, y = x, z = x) {

		super();

		this.bits = new Vector3(0, 0, 0);
		this.range = new Vector4(1, 1, 1, 1);

		this.maskX = [0, 0];
		this.maskY = [0, 0];
		this.maskZ = [0, 0];

		this.set(x, y, z);

	}

	/**
	 * The amount of bits reserved for the X-coordinate.
	 */

	get x(): number { return this.bits.x; }

	/**
	 * The amount of bits reserved for the Y-coordinate.
	 */

	get y(): number { return this.bits.y; }

	/**
	 * The amount of bits reserved for the Z-coordinate.
	 */

	get z(): number { return this.bits.z; }

	/**
	 * The amount of distinct integers that can be represented with X bits.
	 */

	get rangeX(): number { return this.range.x; }

	/**
	 * The amount of distinct integers that can be represented with Y bits.
	 */

	get rangeY(): number { return this.range.y; }

	/**
	 * The amount of distinct integers that can be represented with Z bits.
	 */

	get rangeZ(): number { return this.range.z; }

	/**
	 * The amount of distinct integers that can be represented with X + Y bits.
	 */

	get rangeXY(): number { return this.range.w; }

	/**
	 * Returns the lower key coordinate bounds.
	 *
	 * @return The minimum coordinates (always 0).
	 */

	getMinKeyCoordinates(target: Vector3): Vector3 {

		return target.set(0, 0, 0);

	}

	/**
	 * Returns the upper key coordinate bounds.
	 *
	 * @return The maximum coordinates.
	 */

	getMaxKeyCoordinates(target: Vector3): Vector3 {

		const range = this.range;

		return target.set(
			Math.max(range.x - 1, 0),
			Math.max(range.y - 1, 0),
			Math.max(range.z - 1, 0)
		);

	}

	/**
	 * Creates bit masks for the extraction of coordinates from keys.
	 */

	private updateBitMasks(): void {

		const { maskX, maskY, maskZ } = this;

		const xBits = this.x;
		const yBits = this.y;
		const zBits = this.z;

		const xyBits = xBits + yBits;
		const xyzBits = xyBits + zBits;

		const hiShiftX = DWORD_BITS - Math.max(0, xBits - LO_BITS);
		const hiShiftY = DWORD_BITS - Math.max(0, yBits + xBits - LO_BITS);
		const hiShiftZ = DWORD_BITS - Math.max(0, zBits + yBits + xBits - LO_BITS);

		maskX[1] = (hiShiftX < DWORD_BITS) ? ~0 >>> hiShiftX : 0;
		maskX[0] = (xBits === 0) ? 0 : (~0 >>> Math.max(0, LO_BITS - xBits));

		maskY[1] = (((hiShiftY < DWORD_BITS) ? ~0 >>> hiShiftY : 0) & ~maskX[1]) >>> 0;
		maskY[0] = (xyBits === 0) ? 0 : (((~0 >>> Math.max(0, LO_BITS - xyBits)) & ~maskX[0]) >>> 0);

		maskZ[1] = (((hiShiftZ < DWORD_BITS) ? ~0 >>> hiShiftZ : 0) & ~maskY[1] & ~maskX[1]) >>> 0;
		maskZ[0] = (xyzBits === 0) ? 0 : (((~0 >>> Math.max(0, LO_BITS - xyzBits)) & ~maskY[0] & ~maskX[0]) >>> 0);

	}

	/**
	 * Sets the bit distribution.
	 *
	 * @throws If the bit allotment is invalid.
	 * @param x - The amount of bits used for the X-coordinate.
	 * @param y - The amount of bits used for the Y-coordinate.
	 * @param z - The amount of bits used for the Z-coordinate.
	 */

	set(x: number, y: number, z: number): void {

		x = Math.max(x, 0);
		y = Math.max(y, 0);
		z = Math.max(z, 0);

		if(x === this.x && y === this.y && z === this.z) {

			return;

		}

		if(x + y + z > BITS) {

			throw new Error(`Cannot use more than ${BITS} bits total`);

		}

		if(x > DWORD_BITS || y > DWORD_BITS || z > DWORD_BITS) {

			// Bit operations only work on DWord Numbers.
			throw new Error(`Cannot use more than ${DWORD_BITS} bits per coordinate`);

		}

		this.bits.set(x, y, z);
		this.range.set(2 ** x, 2 ** y, 2 ** z, 2 ** (x + y));
		this.updateBitMasks();
		this.dispatchEvent({ type: KeyDesign.EVENT_CHANGE });

	}

	/**
	 * Extracts the 3D coordinates from a given key.
	 *
	 * @param key - The key.
	 * @param target - A vector to store the result in.
	 * @return The extracted key coordinates.
	 */

	unpackKey(key: number, target: Vector3): Vector3 {

		const maskX = this.maskX;
		const maskY = this.maskY;
		const maskZ = this.maskZ;

		// Split the QWord key into a high and a low DWord.
		const hi = Math.trunc(key / RANGE_DWORD);
		const lo = key % RANGE_DWORD;

		return target.set(
			(hi & maskX[1]) * RANGE_DWORD + ((lo & maskX[0]) >>> 0),
			((hi & maskY[1]) * RANGE_DWORD + ((lo & maskY[0]) >>> 0)) / this.rangeX,
			((hi & maskZ[1]) * RANGE_DWORD + ((lo & maskZ[0]) >>> 0)) / this.rangeXY
		);

	}

	/**
	 * Packs key coordinates into a unique key.
	 *
	 * @throws If any value is out of bounds.
	 * @param x - The X-coordinate (Uint).
	 * @param y - The Y-coordinate (Uint).
	 * @param z - The Z-coordinate (Uint).
	 * @return The key.
	 */

	packKey(x: number, y: number, z: number): number {

		if(x >= this.rangeX) {

			throw new Error("X value out of bounds");

		}

		if(y >= this.rangeY) {

			throw new Error("Y value out of bounds");

		}

		if(z >= this.rangeZ) {

			throw new Error("Z value out of bounds");

		}

		return z * this.rangeXY + y * this.rangeX + x;

	}

	/**
	 * Calculates the bounds that contain the domain of this key design.
	 *
	 * The center of the bounds is (0, 0, 0).
	 *
	 * @param cellSize - The cell size.
	 * @param target - A box to store the result in.
	 * @return The bounds.
	 */

	calculateBounds(cellSize: Vector3, target: Box3): Box3 {

		const range = this.range;
		const bounds = target;

		bounds.max.set(range.x, range.y, range.z);
		bounds.max.divideScalar(2).multiply(cellSize);
		bounds.min.copy(bounds.max).negate();

		return bounds;

	}

	/**
	 * Returns a new key range iterator.
	 *
	 * The iterator returns all keys in the specified coordinate range, including those at min and max.
	 *
	 * @param min - The lower key index bounds (zero-based uint coordinates).
	 * @param max - The upper key index bounds (zero-based uint coordinates).
	 * @return An iterator.
	 */

	keyRange(min: Vector3, max: Vector3): KeyIterator {

		return new KeyIterator(this, min, max);

	}

	/**
	 * Checks if this key design equals another key design.
	 *
	 * @param keyDesign - A key design.
	 * @return Whether this key design equals the given one.
	 */

	equals(keyDesign: KeyDesign): boolean {

		return (this === keyDesign || (
			this.x === keyDesign.x &&
			this.y === keyDesign.y &&
			this.z === keyDesign.z
		));

	}

	/**
	 * Converts the information of this key design into a string.
	 *
	 * @return The key design as a string.
	 */

	override toString(): string {

		const maskX = this.maskX;
		const maskY = this.maskY;
		const maskZ = this.maskZ;

		return (

			"Key Design\n\n" +

			`Bits [X: ${this.x}, Y: ${this.y}, Z: ${this.z}]\n\n` +

			`HI-Mask X: ${Binary.toString(maskX[1], DWORD_BITS)} ${maskX[1]}\n` +
			`LO-Mask X: ${Binary.toString(maskX[0], DWORD_BITS)} ${maskX[0]}\n\n` +

			`HI-Mask Y: ${Binary.toString(maskY[1], DWORD_BITS)} ${maskY[1]}\n` +
			`LO-Mask Y: ${Binary.toString(maskY[0], DWORD_BITS)} ${maskY[0]}\n\n` +

			`HI-Mask Z: ${Binary.toString(maskZ[1], DWORD_BITS)} ${maskZ[1]}\n` +
			`LO-Mask Z: ${Binary.toString(maskZ[0], DWORD_BITS)} ${maskZ[0]}\n`

		);

	}

}
