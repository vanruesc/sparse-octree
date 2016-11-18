/**
 * A vector with three components.
 *
 * @class Vector3
 * @submodule math
 * @constructor
 * @param {Number} [x=0] - The x value.
 * @param {Number} [y=0] - The y value.
 * @param {Number} [z=0] - The z value.
 */

export class Vector3 {

	constructor(x = 0, y = 0, z = 0) {

		/**
		 * The x component.
		 *
		 * @property x
		 * @type Number
		 */

		this.x = x;

		/**
		 * The y component.
		 *
		 * @property y
		 * @type Number
		 */

		this.y = y;

		/**
		 * The z component.
		 *
		 * @property z
		 * @type Number
		 */

		this.z = z;

	}

	/**
	 * Sets the values of this vector
	 *
	 * @method set
	 * @param {Number} x - The x value.
	 * @param {Number} y - The y value.
	 * @param {Number} z - The z value.
	 * @return {Vector3} This vector.
	 */

	set(x, y, z) {

		this.x = x;
		this.y = y;
		this.z = z;

		return this;

	}

	/**
	 * Copies the values of another vector.
	 *
	 * @method copy
	 * @param {Vector3} v - A vector.
	 * @return {Vector3} This vector.
	 */

	copy(v) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;

	}

	/**
	 * Copies values from an array.
	 *
	 * @method fromArray
	 * @param {Array} array - An array.
	 * @param {Number} offset - An offset.
	 * @return {Vector3} This vector.
	 */

	fromArray(array, offset) {

		if(offset === undefined) { offset = 0; }

		this.x = array[offset];
		this.y = array[offset + 1];
		this.z = array[offset + 2];

		return this;

	}

	/**
	 * Stores this vector in an array.
	 *
	 * @method toArray
	 * @param {Array} [array] - A target array.
	 * @param {Number} offset - An offset.
	 * @return {Vector3} The array.
	 */

	toArray(array, offset) {

		if(array === undefined) { array = []; }
		if(offset === undefined) { offset = 0; }

		array[offset] = this.x;
		array[offset + 1] = this.y;
		array[offset + 2] = this.z;

		return array;

	}

	/**
	 * Checks if this vector equals the given one.
	 *
	 * @method equals
	 * @param {Vector3} v - A vector.
	 * @return {Boolean} Whether this vector equals the given one.
	 */

	equals(v) {

		return (v.x === this.x && v.y === this.y && v.z === this.z);

	}

	/**
	 * Clones this vector.
	 *
	 * @method clone
	 * @return {Vector3} A clone of this vector.
	 */

	clone() {

		return new this.constructor(this.x, this.y, this.z);

	}

	/**
	 * Adds a vector to this one.
	 *
	 * @method add
	 * @param {Vector3} v - The vector to add.
	 * @return {Vector3} This vector.
	 */

	add(v) {

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	}

	/**
	 * Adds a scaled vector to this one.
	 *
	 * @method addScaledVector
	 * @param {Vector3} v - The vector to scale and add.
	 * @param {Number} s - A scalar.
	 * @return {Vector3} This vector.
	 */

	addScaledVector(v, s) {

		this.x += v.x * s;
		this.y += v.y * s;
		this.z += v.z * s;

		return this;

	}

	/**
	 * Adds a scalar to this vector.
	 *
	 * @method addScalar
	 * @param {Number} s - The scalar to add.
	 * @return {Vector3} This vector.
	 */

	addScalar(s) {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;

	}

	/**
	 * Sets this vector to the sum of two given vectors.
	 *
	 * @method addVectors
	 * @param {Vector3} a - A vector.
	 * @param {Vector3} b - Another vector.
	 * @return {Vector3} This vector.
	 */

	addVectors(a, b) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;

		return this;

	}

	/**
	 * Subtracts a vector from this vector.
	 *
	 * @method sub
	 * @param {Vector3} v - The vector to subtract.
	 * @return {Vector3} This vector.
	 */

	sub(v) {

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;

	}

	/**
	 * Subtracts a scalar to this vector.
	 *
	 * @method subScalar
	 * @param {Number} s - The scalar to subtract.
	 * @return {Vector3} This vector.
	 */

	subScalar(s) {

		this.x -= s;
		this.y -= s;
		this.z -= s;

		return this;

	}

	/**
	 * Sets this vector to the difference between two given vectors.
	 *
	 * @method subVectors
	 * @param {Vector3} a - A vector.
	 * @param {Vector3} b - A second vector.
	 * @return {Vector3} This vector.
	 */

	subVectors(a, b) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;

	}

	/**
	 * Multiplies this vector with another vector.
	 *
	 * @method multiply
	 * @param {Vector3} v - A vector.
	 * @return {Vector3} This vector.
	 */

	multiply(v) {

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;

		return this;

	}

	/**
	 * Multiplies this vector with a given scalar.
	 *
	 * @method multiplyScalar
	 * @param {Number} s - A scalar.
	 * @return {Vector3} This vector.
	 */

	multiplyScalar(s) {

		if(isFinite(s)) {

			this.x *= s;
			this.y *= s;
			this.z *= s;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;

		}

		return this;

	}

	/**
	 * Sets this vector to the product of two given vectors.
	 *
	 * @method multiplyVectors
	 * @param {Vector3} a - A vector.
	 * @param {Vector3} b - Another vector.
	 * @return {Vector3} This vector.
	 */

	multiplyVectors(a, b) {

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;

	}

	/**
	 * Divides this vector by another vector.
	 *
	 * @method divide
	 * @param {Vector3} v - A vector.
	 * @return {Vector3} This vector.
	 */

	divide(v) {

		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;

		return this;

	}

	/**
	 * Divides this vector by a given scalar.
	 *
	 * @method divideScalar
	 * @param {Number} s - A scalar.
	 * @return {Vector3} This vector.
	 */

	divideScalar(s) {

		return this.multiplyScalar(1 / s);

	}

	/**
	 * Sets this vector to the quotient of two given vectors.
	 *
	 * @method divideVectors
	 * @param {Vector3} a - A vector.
	 * @param {Vector3} b - Another vector.
	 * @return {Vector3} This vector.
	 */

	divideVectors(a, b) {

		this.x = a.x / b.x;
		this.y = a.y / b.y;
		this.z = a.z / b.z;

		return this;

	}

	/**
	 * Calculates the dot product with another vector.
	 *
	 * @method dot
	 * @param {Vector3} v - A vector.
	 * @return {Number} The dot product.
	 */

	dot(v) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	}

	/**
	 * Calculates the squared length of this vector.
	 *
	 * @method lengthSq
	 * @return {Number} The squared length.
	 */

	lengthSq() {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	}

	/**
	 * Calculates the length of this vector.
	 *
	 * @method length
	 * @return {Number} The length.
	 */

	length() {

		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

	}

	/**
	 * Calculates the distance to a given vector.
	 *
	 * @method distanceTo
	 * @param {Vector3} v - A vector.
	 * @return {Number} The distance.
	 */

	distanceTo(v) {

		return Math.sqrt(this.distanceToSquared(v));

	}

	/**
	 * Calculates the squared distance to a given vector.
	 *
	 * @method distanceToSquared
	 * @param {Vector3} v - A vector.
	 * @return {Number} The squared distance.
	 */

	distanceToSquared(v) {

		const dx = this.x - v.x;
		const dy = this.y - v.y;
		const dz = this.z - v.z;

		return dx * dx + dy * dy + dz * dz;

	}

	/**
	 * Normalizes this vector.
	 *
	 * @method normalize
	 * @return {Vector3} This vector.
	 */

	normalize() {

		return this.divideScalar(this.length());

	}

	/**
	 * Adopts the min value for each component of this vector and the given one.
	 *
	 * @method min
	 * @param {Vector3} v - A vector.
	 * @return {Vector3} This vector.
	 */

	min(v) {

		this.x = Math.min(this.x, v.x);
		this.y = Math.min(this.y, v.y);
		this.z = Math.min(this.z, v.z);

		return this;

	}

	/**
	 * adopts the max value for each component of this vector and the given one.
	 *
	 * @method max
	 * @param {Vector3} v - A vector.
	 * @return {Vector3} This vector.
	 */

	max(v) {

		this.x = Math.max(this.x, v.x);
		this.y = Math.max(this.y, v.y);
		this.z = Math.max(this.z, v.z);

		return this;

	}

	/**
	 * Clamps this vector.
	 *
	 * @method clamp
	 * @param {Vector3} min - A vector, assumed to be smaller than max.
	 * @param {Vector3} max - A vector, assumed to be greater than min.
	 * @return {Vector3} This vector.
	 */

	clamp(min, max) {

		this.x = Math.max(min.x, Math.min(max.x, this.x));
		this.y = Math.max(min.y, Math.min(max.y, this.y));
		this.z = Math.max(min.z, Math.min(max.z, this.z));

		return this;

	}

	/**
	 * Applies a matrix to this vector.
	 *
	 * @method applyMatrix3
	 * @param {Matrix3} m - A matrix.
	 * @return {Vector3} This vector.
	 */

	applyMatrix3(m) {

		const x = this.x, y = this.y, z = this.z;
		const e = m.elements;

		this.x = e[0] * x + e[3] * y + e[6] * z;
		this.y = e[1] * x + e[4] * y + e[7] * z;
		this.z = e[2] * x + e[5] * y + e[8] * z;

		return this;

	}

	/**
	 * Applies a matrix to this vector.
	 *
	 * @method applyMatrix4
	 * @param {Matrix4} m - A matrix.
	 * @return {Vector3} This vector.
	 */

	applyMatrix4(m) {

		const x = this.x, y = this.y, z = this.z;
		const e = m.elements;

		this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
		this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
		this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

		return this;

	}

}
