import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Binary, KeyDesign } from "linear-octree";
import { Vector3 } from "three";

// Enables verbose logging.
const DEBUG = false;

describe("KeyDesign", () => {

	it("(experiment) concatenating 32bit integers", () => {

		const hi = 0b00000000000111111111111111111111;
		const lo = 0b11111111111111111111111111111111;

		const i = (hi * Math.pow(2, 32)) + lo;

		if(DEBUG) {

			console.log("i53, left-padded to 64:\n", Binary.toString(i), i, "\n");

		}

		assert.equal(hi, Math.pow(2, KeyDesign.HI_BITS) - 1);
		assert.equal(lo, Math.pow(2, KeyDesign.LO_BITS) - 1);
		assert.equal(i, Math.pow(2, KeyDesign.BITS) - 1);

	});

	it("can be instantiated", () => {

		assert.doesNotThrow(() => new KeyDesign());

	});

	it("extracting specific BITS from a 53bit integer", () => {

		const xBits = 20;
		const yBits = 15;
		const zBits = 17;

		const keyDesign = new KeyDesign(xBits, yBits, zBits);
		const keyCoordinates = new Vector3();

		const key = 0b0000000000011111111111111111111111111111111111111111111111111111;
		keyDesign.unpackKey(key, keyCoordinates);

		if(DEBUG) {

			console.log("Input:", Binary.toString(key, KeyDesign.BITS), key, "\n");
			console.log(keyDesign.toString(), "\n");

		}

		assert.equal(key, Math.pow(2, KeyDesign.HI_BITS + KeyDesign.LO_BITS) - 1);
		assert.equal(keyCoordinates.x, Math.pow(2, xBits) - 1, "X");
		assert.equal(keyCoordinates.y, (Math.pow(2, yBits) - 1), "Y");
		assert.equal(keyCoordinates.z, (Math.pow(2, zBits) - 1), "Z");

	});

	it("storing values in specific bit slots of a 53bit integer", () => {

		const xBits = 21;
		const yBits = 11;
		const zBits = 21;

		const keyDesign = new KeyDesign(xBits, yBits, zBits);
		const keyCoordinates = new Vector3();

		const x = 42;
		const y = 23;
		const z = 11;

		const key = keyDesign.packKey(x, y, z);
		keyDesign.unpackKey(key, keyCoordinates);

		if(DEBUG) {

			console.log("Input X:", Binary.toString(x), x);
			console.log("Input Y:", Binary.toString(y), y);
			console.log("Input Z:", Binary.toString(z), z);
			console.log("Key (i53):", Binary.toString(key, KeyDesign.BITS), key, "\n");
			console.log(keyDesign.toString(), "\n");

		}

		const rangeX = Math.pow(2, xBits);
		const rangeXY = Math.pow(2, xBits + yBits);

		assert.equal(key, z * rangeXY + y * rangeX + x, "incorrect key");
		assert.equal(keyCoordinates.x, x, "X");
		assert.equal(keyCoordinates.y, y, "Y");
		assert.equal(keyCoordinates.z, z, "Z");

	});

	it("handles bit allotment edge cases", () => {

		const keyDesign = new KeyDesign(0, 1, 0);
		const keyCoordinates = new Vector3();

		const x = 0;
		const y = 1;
		const z = 0;

		const key = keyDesign.packKey(x, y, z);
		keyDesign.unpackKey(key, keyCoordinates);

		if(DEBUG) {

			console.log("Input X:", Binary.toString(x), x);
			console.log("Input Y:", Binary.toString(y), y);
			console.log("Input Z:", Binary.toString(z), z);
			console.log("Key (i53):", Binary.toString(key, KeyDesign.BITS), key, "\n");
			console.log(keyDesign.toString());

		}

		assert.equal(keyCoordinates.x, x, "X");
		assert.equal(keyCoordinates.y, y, "Y");
		assert.equal(keyCoordinates.z, z, "Z");

	});

	it("can unpack with zero bits", () => {

		const keyDesign = new KeyDesign(0, 0, 0);
		assert.doesNotThrow(() => keyDesign.unpackKey(0, new Vector3()));

	});

	it("blocks bad values", () => {

		const keyDesign = new KeyDesign(1, 1, 1);

		assert.doesNotThrow(() => keyDesign.set(0, 0, 0));
		assert.doesNotThrow(() => keyDesign.set(32, 0, 0));
		assert.throws(() => keyDesign.set(33, 0, 0));
		assert.throws(() => keyDesign.set(32, 32, 32));

		keyDesign.set(0, 0, 0);

		assert.doesNotThrow(() => keyDesign.packKey(0, 0, 0));
		assert.throws(() => keyDesign.packKey(1, 0, 0));

	});

});
