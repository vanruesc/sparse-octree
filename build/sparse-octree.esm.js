/**
 * sparse-octree v6.0.0 build Wed Oct 23 2019
 * https://github.com/vanruesc/sparse-octree
 * Copyright 2019 Raoul van Rüschen, Zlib
 */
/**
 * Describes all possible octant corner connections.
 *
 * @type {Uint8Array[]}
 */

const edges = [

	// X-Axis.
	new Uint8Array([0, 4]),
	new Uint8Array([1, 5]),
	new Uint8Array([2, 6]),
	new Uint8Array([3, 7]),

	// Y-Axis.
	new Uint8Array([0, 2]),
	new Uint8Array([1, 3]),
	new Uint8Array([4, 6]),
	new Uint8Array([5, 7]),

	// Z-Axis.
	new Uint8Array([0, 1]),
	new Uint8Array([2, 3]),
	new Uint8Array([4, 5]),
	new Uint8Array([6, 7])

];

/**
 * A binary pattern that describes the standard octant layout:
 *
 * ```text
 *    3____7
 *  2/___6/|
 *  | 1__|_5
 *  0/___4/
 * ```
 *
 * This common layout is crucial for positional assumptions.
 *
 * @type {Uint8Array[]}
 */

const layout = [

	new Uint8Array([0, 0, 0]),
	new Uint8Array([0, 0, 1]),
	new Uint8Array([0, 1, 0]),
	new Uint8Array([0, 1, 1]),

	new Uint8Array([1, 0, 0]),
	new Uint8Array([1, 0, 1]),
	new Uint8Array([1, 1, 0]),
	new Uint8Array([1, 1, 1])

];

/**
 * math-ds v1.1.3 build Sat May 04 2019
 * https://github.com/vanruesc/math-ds
 * Copyright 2019 Raoul van Rüschen, Zlib
 */
/**
 * A vector with three components.
 */

class Vector3 {

	/**
	 * Constructs a new vector.
	 *
	 * @param {Number} [x=0] - The X component.
	 * @param {Number} [y=0] - The Y component.
	 * @param {Number} [z=0] - The Z component.
	 */

	constructor(x = 0, y = 0, z = 0) {

		/**
		 * The X component.
		 *
		 * @type {Number}
		 */

		this.x = x;

		/**
		 * The Y component.
		 *
		 * @type {Number}
		 */

		this.y = y;

		/**
		 * The Z component.
		 *
		 * @type {Number}
		 */

		this.z = z;

	}

	/**
	 * Sets the values of this vector
	 *
	 * @param {Number} x - The X component.
	 * @param {Number} y - The Y component.
	 * @param {Number} z - The Z component.
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
	 * Clones this vector.
	 *
	 * @return {Vector3} A clone of this vector.
	 */

	clone() {

		return new this.constructor(this.x, this.y, this.z);

	}

	/**
	 * Copies values from an array.
	 *
	 * @param {Number[]} array - An array.
	 * @param {Number} offset - An offset.
	 * @return {Vector3} This vector.
	 */

	fromArray(array, offset = 0) {

		this.x = array[offset];
		this.y = array[offset + 1];
		this.z = array[offset + 2];

		return this;

	}

	/**
	 * Stores this vector in an array.
	 *
	 * @param {Array} [array] - A target array.
	 * @param {Number} offset - An offset.
	 * @return {Number[]} The array.
	 */

	toArray(array = [], offset = 0) {

		array[offset] = this.x;
		array[offset + 1] = this.y;
		array[offset + 2] = this.z;

		return array;

	}

	/**
	 * Sets the values of this vector based on a spherical description.
	 *
	 * @param {Spherical} s - A spherical description.
	 * @return {Vector3} This vector.
	 */

	setFromSpherical(s) {

		this.setFromSphericalCoords(s.radius, s.phi, s.theta);

	}

	/**
	 * Sets the values of this vector based on spherical coordinates.
	 *
	 * @param {Number} radius - The radius.
	 * @param {Number} phi - The polar angle.
	 * @param {Number} theta - The angle around the equator of the sphere.
	 * @return {Vector3} This vector.
	 */

	setFromSphericalCoords(radius, phi, theta) {

		const sinPhiRadius = Math.sin(phi) * radius;

		this.x = sinPhiRadius * Math.sin(theta);
		this.y = Math.cos(phi) * radius;
		this.z = sinPhiRadius * Math.cos(theta);

		return this;

	}

	/**
	 * Sets the values of this vector based on a cylindrical description.
	 *
	 * @param {Cylindrical} c - A cylindrical description.
	 * @return {Vector3} This vector.
	 */

	setFromCylindrical(c) {

		this.setFromCylindricalCoords(c.radius, c.theta, c.y);

	}

	/**
	 * Sets the values of this vector based on cylindrical coordinates.
	 *
	 * @param {Number} radius - The radius.
	 * @param {Number} theta - Theta.
	 * @param {Number} y - The height.
	 * @return {Vector3} This vector.
	 */

	setFromCylindricalCoords(radius, theta, y) {

		this.x = radius * Math.sin(theta);
		this.y = y;
		this.z = radius * Math.cos(theta);

		return this;

	}

	/**
	 * Copies the values of a matrix column.
	 *
	 * @param {Matrix4} m - A 4x4 matrix.
	 * @param {Number} index - A column index of the range [0, 2].
	 * @return {Vector3} This vector.
	 */

	setFromMatrixColumn(m, index) {

		return this.fromArray(m.elements, index * 4);

	}

	/**
	 * Extracts the position from a matrix.
	 *
	 * @param {Matrix4} m - A 4x4 matrix.
	 * @return {Vector3} This vector.
	 */

	setFromMatrixPosition(m) {

		const me = m.elements;

		this.x = me[12];
		this.y = me[13];
		this.z = me[14];

		return this;

	}

	/**
	 * Extracts the scale from a matrix.
	 *
	 * @param {Matrix4} m - A 4x4 matrix.
	 * @return {Vector3} This vector.
	 */

	setFromMatrixScale(m) {

		const sx = this.setFromMatrixColumn(m, 0).length();
		const sy = this.setFromMatrixColumn(m, 1).length();
		const sz = this.setFromMatrixColumn(m, 2).length();

		this.x = sx;
		this.y = sy;
		this.z = sz;

		return this;

	}

	/**
	 * Adds a vector to this one.
	 *
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
	 * Adds a scalar to this vector.
	 *
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
	 * Adds a scaled vector to this one.
	 *
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
	 * Subtracts a vector from this vector.
	 *
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
	 * Subtracts a scalar from this vector.
	 *
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
	 * @param {Number} s - A scalar.
	 * @return {Vector3} This vector.
	 */

	multiplyScalar(s) {

		this.x *= s;
		this.y *= s;
		this.z *= s;

		return this;

	}

	/**
	 * Sets this vector to the product of two given vectors.
	 *
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
	 * @param {Number} s - A scalar.
	 * @return {Vector3} This vector.
	 */

	divideScalar(s) {

		this.x /= s;
		this.y /= s;
		this.z /= s;

		return this;

	}

	/**
	 * Sets this vector to the cross product of the given vectors.
	 *
	 * @param {Vector3} a - A vector.
	 * @param {Vector3} b - Another vector.
	 * @return {Vector3} This vector.
	 */

	crossVectors(a, b) {

		const ax = a.x, ay = a.y, az = a.z;
		const bx = b.x, by = b.y, bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;

	}

	/**
	 * Calculates the cross product of this vector and the given one.
	 *
	 * @param {Vector3} v - A vector.
	 * @return {Vector3} This vector.
	 */

	cross(v) {

		return this.crossVectors(this, v);

	}

	/**
	 * Applies a matrix to this direction vector.
	 *
	 * @param {Matrix4} m - A matrix.
	 * @return {Vector3} This vector.
	 */

	transformDirection(m) {

		const x = this.x, y = this.y, z = this.z;
		const e = m.elements;

		this.x = e[0] * x + e[4] * y + e[8] * z;
		this.y = e[1] * x + e[5] * y + e[9] * z;
		this.z = e[2] * x + e[6] * y + e[10] * z;

		return this.normalize();

	}

	/**
	 * Applies a matrix to this vector.
	 *
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

	/**
	 * Applies a quaternion to this vector.
	 *
	 * @param {Quaternion} q - A quaternion.
	 * @return {Vector3} This vector.
	 */

	applyQuaternion(q) {

		const x = this.x, y = this.y, z = this.z;
		const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

		// Calculate: quaternion * vector.
		const ix = qw * x + qy * z - qz * y;
		const iy = qw * y + qz * x - qx * z;
		const iz = qw * z + qx * y - qy * x;
		const iw = -qx * x - qy * y - qz * z;

		// Calculate: result * inverse quaternion.
		this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

		return this;

	}

	/**
	 * Negates this vector.
	 *
	 * @return {Vector3} This vector.
	 */

	negate() {

		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;

		return this;

	}

	/**
	 * Calculates the dot product with another vector.
	 *
	 * @param {Vector3} v - A vector.
	 * @return {Number} The dot product.
	 */

	dot(v) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	}

	/**
	 * Reflects this vector. The given plane normal is assumed to be normalized.
	 *
	 * @param {Vector3} n - A normal.
	 * @return {Vector3} This vector.
	 */

	reflect(n) {

		const nx = n.x;
		const ny = n.y;
		const nz = n.z;

		this.sub(n.multiplyScalar(2 * this.dot(n)));

		// Restore the normal.
		n.set(nx, ny, nz);

		return this;

	}

	/**
	 * Computes the angle to the given vector.
	 *
	 * @param {Vector3} v - A vector.
	 * @return {Number} The angle in radians.
	 */

	angleTo(v) {

		const theta = this.dot(v) / (Math.sqrt(this.lengthSquared() * v.lengthSquared()));

		// Clamp to avoid numerical problems.
		return Math.acos(Math.min(Math.max(theta, -1), 1));

	}

	/**
	 * Calculates the Manhattan length of this vector.
	 *
	 * @return {Number} The length.
	 */

	manhattanLength() {

		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);

	}

	/**
	 * Calculates the squared length of this vector.
	 *
	 * @return {Number} The squared length.
	 */

	lengthSquared() {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	}

	/**
	 * Calculates the length of this vector.
	 *
	 * @return {Number} The length.
	 */

	length() {

		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

	}

	/**
	 * Calculates the Manhattan distance to a given vector.
	 *
	 * @param {Vector3} v - A vector.
	 * @return {Number} The distance.
	 */

	manhattanDistanceTo(v) {

		return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);

	}

	/**
	 * Calculates the squared distance to a given vector.
	 *
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
	 * Calculates the distance to a given vector.
	 *
	 * @param {Vector3} v - A vector.
	 * @return {Number} The distance.
	 */

	distanceTo(v) {

		return Math.sqrt(this.distanceToSquared(v));

	}

	/**
	 * Normalizes this vector.
	 *
	 * @return {Vector3} This vector.
	 */

	normalize() {

		return this.divideScalar(this.length());

	}

	/**
	 * Sets the length of this vector.
	 *
	 * @param {Number} length - The new length.
	 * @return {Vector3} This vector.
	 */

	setLength(length) {

		return this.normalize().multiplyScalar(length);

	}

	/**
	 * Adopts the min value for each component of this vector and the given one.
	 *
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
	 * Adopts the max value for each component of this vector and the given one.
	 *
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
	 * @param {Vector3} min - The lower bounds. Assumed to be smaller than max.
	 * @param {Vector3} max - The upper bounds. Assumed to be greater than min.
	 * @return {Vector3} This vector.
	 */

	clamp(min, max) {

		this.x = Math.max(min.x, Math.min(max.x, this.x));
		this.y = Math.max(min.y, Math.min(max.y, this.y));
		this.z = Math.max(min.z, Math.min(max.z, this.z));

		return this;

	}

	/**
	 * Floors this vector.
	 *
	 * @return {Vector3} This vector.
	 */

	floor() {

		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);

		return this;

	}

	/**
	 * Ceils this vector.
	 *
	 * @return {Vector3} This vector.
	 */

	ceil() {

		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		this.z = Math.ceil(this.z);

		return this;

	}

	/**
	 * Rounds this vector.
	 *
	 * @return {Vector3} This vector.
	 */

	round() {

		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		this.z = Math.round(this.z);

		return this;

	}

	/**
	 * Lerps towards the given vector.
	 *
	 * @param {Vector3} v - The target vector.
	 * @param {Number} alpha - The lerp factor.
	 * @return {Vector3} This vector.
	 */

	lerp(v, alpha) {

		this.x += (v.x - this.x) * alpha;
		this.y += (v.y - this.y) * alpha;
		this.z += (v.z - this.z) * alpha;

		return this;

	}

	/**
	 * Sets this vector to the lerp result of the given vectors.
	 *
	 * @param {Vector3} v1 - A base vector.
	 * @param {Vector3} v2 - The target vector.
	 * @param {Number} alpha - The lerp factor.
	 * @return {Vector3} This vector.
	 */

	lerpVectors(v1, v2, alpha) {

		return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

	}

	/**
	 * Checks if this vector equals the given one.
	 *
	 * @param {Vector3} v - A vector.
	 * @return {Boolean} Whether this vector equals the given one.
	 */

	equals(v) {

		return (v.x === this.x && v.y === this.y && v.z === this.z);

	}

}

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const v = new Vector3();

/**
 * A list of points.
 *
 * @type {Vector3[]}
 * @private
 */

const points = [
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3()
];

/**
 * A 3D box.
 */

class Box3 {

	/**
	 * Constructs a new box.
	 *
	 * @param {Vector3} [min] - The lower bounds.
	 * @param {Vector3} [max] - The upper bounds.
	 */

	constructor(
		min = new Vector3(Infinity, Infinity, Infinity),
		max = new Vector3(-Infinity, -Infinity, -Infinity)
	) {

		/**
		 * The lower bounds.
		 *
		 * @type {Vector3}
		 */

		this.min = min;

		/**
		 * The upper bounds.
		 *
		 * @type {Vector3}
		 */

		this.max = max;

	}

	/**
	 * Sets the values of this box.
	 *
	 * @param {Vector3} min - The lower bounds.
	 * @param {Vector3} max - The upper bounds.
	 * @return {Box3} This box.
	 */

	set(min, max) {

		this.min.copy(min);
		this.max.copy(max);

		return this;

	}

	/**
	 * Copies the values of a given box.
	 *
	 * @param {Box3} b - A box.
	 * @return {Box3} This box.
	 */

	copy(b) {

		this.min.copy(b.min);
		this.max.copy(b.max);

		return this;

	}

	/**
	 * Clones this box.
	 *
	 * @return {Box3} A clone of this box.
	 */

	clone() {

		return new this.constructor().copy(this);

	}

	/**
	 * Makes this box empty.
	 *
	 * The lower bounds are set to infinity and the upper bounds to negative
	 * infinity to create an infinitely small box.
	 *
	 * @return {Box3} This box.
	 */

	makeEmpty() {

		this.min.x = this.min.y = this.min.z = Infinity;
		this.max.x = this.max.y = this.max.z = -Infinity;

		return this;

	}

	/**
	 * Indicates whether this box is truly empty.
	 *
	 * This is a more robust check for emptiness since the volume can get positive
	 * with two negative axes.
	 *
	 * @return {Box3} This box.
	 */

	isEmpty() {

		return (
			this.max.x < this.min.x ||
			this.max.y < this.min.y ||
			this.max.z < this.min.z
		);

	}

	/**
	 * Computes the center of this box.
	 *
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} A vector that describes the center of this box.
	 */

	getCenter(target = new Vector3()) {

		return !this.isEmpty() ?
			target.addVectors(this.min, this.max).multiplyScalar(0.5) :
			target.set(0, 0, 0);

	}

	/**
	 * Computes the size of this box.
	 *
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} A vector that describes the size of this box.
	 */

	getSize(target = new Vector3()) {

		return !this.isEmpty() ?
			target.subVectors(this.max, this.min) :
			target.set(0, 0, 0);

	}

	/**
	 * Computes the bounding box of the given sphere.
	 *
	 * @param {Sphere} sphere - A sphere.
	 * @return {Box3} This box.
	 */

	setFromSphere(sphere) {

		this.set(sphere.center, sphere.center);
		this.expandByScalar(sphere.radius);

		return this;

	}

	/**
	 * Expands this box by the given point.
	 *
	 * @param {Vector3} p - A point.
	 * @return {Box3} This box.
	 */

	expandByPoint(p) {

		this.min.min(p);
		this.max.max(p);

		return this;

	}

	/**
	 * Expands this box by the given vector.
	 *
	 * @param {Vector3} v - A vector.
	 * @return {Box3} This box.
	 */

	expandByVector(v) {

		this.min.sub(v);
		this.max.add(v);

		return this;

	}

	/**
	 * Expands this box by the given scalar.
	 *
	 * @param {Number} s - A scalar.
	 * @return {Box3} This box.
	 */

	expandByScalar(s) {

		this.min.addScalar(-s);
		this.max.addScalar(s);

		return this;

	}

	/**
	 * Defines this box by the given points.
	 *
	 * @param {Vector3[]} points - The points.
	 * @return {Box3} This box.
	 */

	setFromPoints(points) {

		let i, l;

		this.min.set(0, 0, 0);
		this.max.set(0, 0, 0);

		for(i = 0, l = points.length; i < l; ++i) {

			this.expandByPoint(points[i]);

		}

		return this;

	}

	/**
	 * Defines this box by the given center and size.
	 *
	 * @param {Vector3} center - The center.
	 * @param {Number} size - The size.
	 * @return {Box3} This box.
	 */

	setFromCenterAndSize(center, size) {

		const halfSize = v.copy(size).multiplyScalar(0.5);

		this.min.copy(center).sub(halfSize);
		this.max.copy(center).add(halfSize);

		return this;

	}

	/**
	 * Clamps the given point to the boundaries of this box.
	 *
	 * @param {Vector3} point - A point.
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} The clamped point.
	 */

	clampPoint(point, target = new Vector3()) {

		return target.copy(point).clamp(this.min, this.max);

	}

	/**
	 * Calculates the distance from this box to the given point.
	 *
	 * @param {Vector3} p - A point.
	 * @return {Number} The distance.
	 */

	distanceToPoint(p) {

		const clampedPoint = v.copy(p).clamp(this.min, this.max);

		return clampedPoint.sub(p).length();

	}

	/**
	 * Applies the given matrix to this box.
	 *
	 * @param {Matrix4} m - The matrix.
	 * @return {Box3} This box.
	 */

	applyMatrix4(m) {

		const min = this.min;
		const max = this.max;

		if(!this.isEmpty()) {

			points[0].set(min.x, min.y, min.z).applyMatrix4(m);
			points[1].set(min.x, min.y, max.z).applyMatrix4(m);
			points[2].set(min.x, max.y, min.z).applyMatrix4(m);
			points[3].set(min.x, max.y, max.z).applyMatrix4(m);
			points[4].set(max.x, min.y, min.z).applyMatrix4(m);
			points[5].set(max.x, min.y, max.z).applyMatrix4(m);
			points[6].set(max.x, max.y, min.z).applyMatrix4(m);
			points[7].set(max.x, max.y, max.z).applyMatrix4(m);

			this.setFromPoints(points);

		}

		return this;

	}

	/**
	 * Translates this box.
	 *
	 * @param {Vector3} offset - The offset.
	 * @return {Box3} This box.
	 */

	translate(offset) {

		this.min.add(offset);
		this.max.add(offset);

		return this;

	}

	/**
	 * Intersects this box with the given one.
	 *
	 * @param {Box3} b - A box.
	 * @return {Box3} This box.
	 */

	intersect(b) {

		this.min.max(b.min);
		this.max.min(b.max);

		/* Ensure that if there is no overlap, the result is fully empty to prevent
		subsequent intersections to erroneously return valid values. */
		if(this.isEmpty()) {

			this.makeEmpty();

		}

		return this;

	}

	/**
	 * Expands this box by combining it with the given one.
	 *
	 * @param {Box3} b - A box.
	 * @return {Box3} This box.
	 */

	union(b) {

		this.min.min(b.min);
		this.max.max(b.max);

		return this;

	}

	/**
	 * Checks if the given point lies inside this box.
	 *
	 * @param {Vector3} p - A point.
	 * @return {Boolean} Whether this box contains the point.
	 */

	containsPoint(p) {

		const min = this.min;
		const max = this.max;

		return (
			p.x >= min.x &&
			p.y >= min.y &&
			p.z >= min.z &&
			p.x <= max.x &&
			p.y <= max.y &&
			p.z <= max.z
		);

	}

	/**
	 * Checks if the given box lies inside this box.
	 *
	 * @param {Box3} b - A box.
	 * @return {Boolean} Whether this box contains the given one.
	 */

	containsBox(b) {

		const tMin = this.min;
		const tMax = this.max;
		const bMin = b.min;
		const bMax = b.max;

		return (
			tMin.x <= bMin.x && bMax.x <= tMax.x &&
			tMin.y <= bMin.y && bMax.y <= tMax.y &&
			tMin.z <= bMin.z && bMax.z <= tMax.z
		);

	}

	/**
	 * Checks if this box intersects the given one.
	 *
	 * @param {Box3} b - A box.
	 * @return {Boolean} Whether the boxes intersect.
	 */

	intersectsBox(b) {

		const tMin = this.min;
		const tMax = this.max;
		const bMin = b.min;
		const bMax = b.max;

		return (
			bMax.x >= tMin.x &&
			bMax.y >= tMin.y &&
			bMax.z >= tMin.z &&
			bMin.x <= tMax.x &&
			bMin.y <= tMax.y &&
			bMin.z <= tMax.z
		);

	}

	/**
	 * Checks if this box intersects the given sphere.
	 *
	 * @param {Sphere} s - A sphere.
	 * @return {Boolean} Whether the box intersects the sphere.
	 */

	intersectsSphere(s) {

		// Find the point in this box that is closest to the sphere's center.
		const closestPoint = this.clampPoint(s.center, v);

		// If that point is inside the sphere, it intersects this box.
		return (closestPoint.distanceToSquared(s.center) <= (s.radius * s.radius));

	}

	/**
	 * Checks if this box intersects the given plane.
	 *
	 * Computes the minimum and maximum dot product values. If those values are on
	 * the same side (back or front) of the plane, then there is no intersection.
	 *
	 * @param {Plane} p - A plane.
	 * @return {Boolean} Whether the box intersects the plane.
	 */

	intersectsPlane(p) {

		let min, max;

		if(p.normal.x > 0) {

			min = p.normal.x * this.min.x;
			max = p.normal.x * this.max.x;

		} else {

			min = p.normal.x * this.max.x;
			max = p.normal.x * this.min.x;

		}

		if(p.normal.y > 0) {

			min += p.normal.y * this.min.y;
			max += p.normal.y * this.max.y;

		} else {

			min += p.normal.y * this.max.y;
			max += p.normal.y * this.min.y;

		}

		if(p.normal.z > 0) {

			min += p.normal.z * this.min.z;
			max += p.normal.z * this.max.z;

		} else {

			min += p.normal.z * this.max.z;
			max += p.normal.z * this.min.z;

		}

		return (min <= -p.constant && max >= -p.constant);

	}

	/**
	 * Checks if this box equals the given one.
	 *
	 * @param {Box3} b - A box.
	 * @return {Boolean} Whether this box equals the given one.
	 */

	equals(b) {

		return (b.min.equals(this.min) && b.max.equals(this.max));

	}

}

/**
 * A list of vectors.
 *
 * @type {Vector3[]}
 * @private
 */

const v$4 = [
	new Vector3(),
	new Vector3(),
	new Vector3(),
	new Vector3()
];

/**
 * A ray.
 */

class Ray {

	/**
	 * Constructs a new ray.
	 *
	 * @param {Vector3} [origin] - The origin.
	 * @param {Vector3} [direction] - The direction.
	 */

	constructor(origin = new Vector3(), direction = new Vector3()) {

		/**
		 * The origin.
		 *
		 * @type {Vector3}
		 */

		this.origin = origin;

		/**
		 * The direction.
		 *
		 * @type {Vector3}
		 */

		this.direction = direction;

	}

	/**
	 * Sets the origin and the direction.
	 *
	 * @param {Vector3} origin - The origin.
	 * @param {Vector3} direction - The direction. Should be normalized.
	 * @return {Ray} This ray.
	 */

	set(origin, direction) {

		this.origin.copy(origin);
		this.direction.copy(direction);

		return this;

	}

	/**
	 * Copies the given ray.
	 *
	 * @param {Ray} r - A ray.
	 * @return {Ray} This ray.
	 */

	copy(r) {

		this.origin.copy(r.origin);
		this.direction.copy(r.direction);

		return this;

	}

	/**
	 * Clones this ray.
	 *
	 * @return {Ray} The cloned ray.
	 */

	clone() {

		return new this.constructor().copy(this);

	}

	/**
	 * Computes a point along the ray based on a given scalar t.
	 *
	 * @param {Number} t - The scalar.
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} The point.
	 */

	at(t, target = new Vector3()) {

		return target.copy(this.direction).multiplyScalar(t).add(this.origin);

	}

	/**
	 * Rotates this ray to look at the given target.
	 *
	 * @param {Vector3} target - A point to look at.
	 * @return {Ray} This ray.
	 */

	lookAt(target) {

		this.direction.copy(target).sub(this.origin).normalize();

		return this;

	}

	/**
	 * Moves the origin along the ray by a given scalar t.
	 *
	 * @param {Number} t - The scalar.
	 * @return {Ray} This ray.
	 */

	recast(t) {

		this.origin.copy(this.at(t, v$4[0]));

		return this;

	}

	/**
	 * Finds the closest point along this ray to a given point.
	 *
	 * @param {Vector3} p - A point.
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} The point.
	 */

	closestPointToPoint(p, target = new Vector3()) {

		const directionDistance = target.subVectors(p, this.origin).dot(this.direction);

		return (directionDistance >= 0.0) ?
			target.copy(this.direction).multiplyScalar(directionDistance).add(this.origin) :
			target.copy(this.origin);

	}

	/**
	 * Calculates the squared distance from this ray to the given point.
	 *
	 * @param {Vector3} p - The point.
	 * @return {Number} The squared distance.
	 */

	distanceSquaredToPoint(p) {

		const directionDistance = v$4[0].subVectors(p, this.origin).dot(this.direction);

		// Check if the point is behind the ray.
		return (directionDistance < 0.0) ?
			this.origin.distanceToSquared(p) :
			v$4[0].copy(this.direction).multiplyScalar(directionDistance).add(this.origin).distanceToSquared(p);

	}

	/**
	 * Calculates the distance from this ray to the given point.
	 *
	 * @param {Vector3} p - The point.
	 * @return {Number} The distance.
	 */

	distanceToPoint(p) {

		return Math.sqrt(this.distanceSquaredToPoint(p));

	}

	/**
	 * Calculates the distance from this ray to the given plane.
	 *
	 * @param {Plane} p - The plane.
	 * @return {Number} The distance, or null if the denominator is zero.
	 */

	distanceToPlane(p) {

		const denominator = p.normal.dot(this.direction);

		const t = (denominator !== 0.0) ?
			-(this.origin.dot(p.normal) + p.constant) / denominator :
			((p.distanceToPoint(this.origin) === 0.0) ? 0.0 : -1.0);

		return (t >= 0.0) ? t : null;

	}

	/**
	 * Calculates the distance from this ray to a given line segment.
	 *
	 * Based on:
	 *  http://www.geometrictools.com/GTEngine/Include/Mathematics/GteDistRaySegment.h
	 *
	 * @param {Vector3} v0 - The start of the segment.
	 * @param {Vector3} v1 - The end of the segment.
	 * @param {Vector3} [pointOnRay] - If provided, the point on this Ray that is closest to the segment will be stored in this vector.
	 * @param {Vector3} [pointOnSegment] - If provided, the point on the line segment that is closest to this ray will be stored in this vector.
	 * @return {Number} The smallest distance between the ray and the segment defined by v0 and v1.
	 */

	distanceSquaredToSegment(v0, v1, pointOnRay, pointOnSegment) {

		const segCenter = v$4[0].copy(v0).add(v1).multiplyScalar(0.5);
		const segDir = v$4[1].copy(v1).sub(v0).normalize();
		const diff = v$4[2].copy(this.origin).sub(segCenter);

		const segExtent = v0.distanceTo(v1) * 0.5;
		const a01 = -this.direction.dot(segDir);
		const b0 = diff.dot(this.direction);
		const b1 = -diff.dot(segDir);
		const c = diff.lengthSq();
		const det = Math.abs(1.0 - a01 * a01);

		let s0, s1, extDet, invDet, sqrDist;

		if(det > 0.0) {

			// The ray and segment are not parallel.
			s0 = a01 * b1 - b0;
			s1 = a01 * b0 - b1;
			extDet = segExtent * det;

			if(s0 >= 0.0) {

				if(s1 >= -extDet) {

					if(s1 <= extDet) {

						// Region 0.
						// Minimum at interior points of ray and segment.
						invDet = 1.0 / det;
						s0 *= invDet;
						s1 *= invDet;
						sqrDist = s0 * (s0 + a01 * s1 + 2.0 * b0) + s1 * (a01 * s0 + s1 + 2.0 * b1) + c;

					} else {

						// Region 1.
						s1 = segExtent;
						s0 = Math.max(0.0, -(a01 * s1 + b0));
						sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;

					}

				} else {

					// Region 5.
					s1 = -segExtent;
					s0 = Math.max(0.0, -(a01 * s1 + b0));
					sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;

				}

			} else {

				if(s1 <= -extDet) {

					// Region 4.
					s0 = Math.max(0.0, -(-a01 * segExtent + b0));
					s1 = (s0 > 0.0) ? -segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
					sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;

				} else if(s1 <= extDet) {

					// Region 3.
					s0 = 0.0;
					s1 = Math.min(Math.max(-segExtent, -b1), segExtent);
					sqrDist = s1 * (s1 + 2.0 * b1) + c;

				} else {

					// Region 2.
					s0 = Math.max(0.0, -(a01 * segExtent + b0));
					s1 = (s0 > 0.0) ? segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
					sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;

				}

			}

		} else {

			// Ray and segment are parallel.
			s1 = (a01 > 0.0) ? -segExtent : segExtent;
			s0 = Math.max(0.0, -(a01 * s1 + b0));
			sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;

		}

		if(pointOnRay !== undefined) {

			pointOnRay.copy(this.direction).multiplyScalar(s0).add(this.origin);

		}

		if(pointOnSegment !== undefined) {

			pointOnSegment.copy(segDir).multiplyScalar(s1).add(segCenter);

		}

		return sqrDist;

	}

	/**
	 * Finds the point where this ray intersects the given sphere.
	 *
	 * @param {Sphere} s - A sphere.
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} The point of intersection, or null if there is none.
	 */

	intersectSphere(s, target = new Vector3()) {

		const ab = v$4[0].subVectors(s.center, this.origin);
		const tca = ab.dot(this.direction);
		const d2 = ab.dot(ab) - tca * tca;
		const radius2 = s.radius * s.radius;

		let result = null;
		let thc, t0, t1;

		if(d2 <= radius2) {

			thc = Math.sqrt(radius2 - d2);

			// t0 = first intersection point - entrance on front of sphere.
			t0 = tca - thc;

			// t1 = second intersection point - exit point on back of sphere.
			t1 = tca + thc;

			// Check if both t0 and t1 are behind the ray - if so, return null.
			if(t0 >= 0.0 || t1 >= 0.0) {

				/* Check if t0 is behind the ray. If it is, the ray is inside the
				sphere, so return the second exit point scaled by t1 in order to always
				return an intersection point that is in front of the ray. If t0 is in
				front of the ray, return the first collision point scaled by t0. */
				result = (t0 < 0.0) ? this.at(t1, target) : this.at(t0, target);

			}

		}

		return result;

	}

	/**
	 * Determines whether this ray intersects the given sphere.
	 *
	 * @param {Sphere} s - A sphere.
	 * @return {Boolean} Whether this ray intersects the given sphere.
	 */

	intersectsSphere(s) {

		return (this.distanceSqToPoint(s.center) <= (s.radius * s.radius));

	}

	/**
	 * Finds the point where this ray intersects the given plane.
	 *
	 * @param {Plane} p - A plane.
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} The point of intersection, or null if there is none.
	 */

	intersectPlane(p, target = new Vector3()) {

		const t = this.distanceToPlane(p);

		return (t === null) ? null : this.at(t, target);

	}

	/**
	 * Determines whether this ray intersects the given plane.
	 *
	 * @param {Plane} p - A plane.
	 * @return {Boolean} Whether this ray intersects the given plane.
	 */

	intersectsPlane(p) {

		const distanceToPoint = p.distanceToPoint(this.origin);

		return (distanceToPoint === 0.0 || p.normal.dot(this.direction) * distanceToPoint < 0.0);

	}

	/**
	 * Finds the point where this ray intersects the given box.
	 *
	 * @param {Plane} b - A box.
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} The point of intersection, or null if there is none.
	 */

	intersectBox(b, target = new Vector3()) {

		const origin = this.origin;
		const direction = this.direction;
		const min = b.min;
		const max = b.max;

		const invDirX = 1.0 / direction.x;
		const invDirY = 1.0 / direction.y;
		const invDirZ = 1.0 / direction.z;

		let result = null;
		let tmin, tmax, tymin, tymax, tzmin, tzmax;

		if(invDirX >= 0.0) {

			tmin = (min.x - origin.x) * invDirX;
			tmax = (max.x - origin.x) * invDirX;

		} else {

			tmin = (max.x - origin.x) * invDirX;
			tmax = (min.x - origin.x) * invDirX;

		}

		if(invDirY >= 0.0) {

			tymin = (min.y - origin.y) * invDirY;
			tymax = (max.y - origin.y) * invDirY;

		} else {

			tymin = (max.y - origin.y) * invDirY;
			tymax = (min.y - origin.y) * invDirY;

		}

		if(tmin <= tymax && tymin <= tmax) {

			/* Handle the case where tmin or tmax is NaN (result of 0 * Infinity).
			Note: x !== x returns true if x is NaN. */
			if(tymin > tmin || tmin !== tmin) {

				tmin = tymin;

			}

			if(tymax < tmax || tmax !== tmax) {

				tmax = tymax;

			}

			if(invDirZ >= 0.0) {

				tzmin = (min.z - origin.z) * invDirZ;
				tzmax = (max.z - origin.z) * invDirZ;

			} else {

				tzmin = (max.z - origin.z) * invDirZ;
				tzmax = (min.z - origin.z) * invDirZ;

			}

			if(tmin <= tzmax && tzmin <= tmax) {

				if(tzmin > tmin || tmin !== tmin) {

					tmin = tzmin;

				}

				if(tzmax < tmax || tmax !== tmax) {

					tmax = tzmax;

				}

				// Return the closest point (positive side).
				if(tmax >= 0.0) {

					result = this.at((tmin >= 0.0) ? tmin : tmax, target);

				}

			}

		}

		return result;

	}

	/**
	 * Determines whether this ray intersects the given box.
	 *
	 * @param {Box3} b - A box.
	 * @return {Boolean} Whether this ray intersects the given box.
	 */

	intersectsBox(b) {

		return (this.intersectBox(b, v$4[0]) !== null);

	}

	/**
	 * Finds the point where this ray intersects the given triangle.
	 *
	 * Based on:
	 *  http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h
	 *
	 * @param {Vector3} a - A triangle vertex.
	 * @param {Vector3} b - A triangle vertex.
	 * @param {Vector3} c - A triangle vertex.
	 * @param {Boolean} [backfaceCulling=false] - Whether backface culling should be considered.
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} The point of intersection, or null if there is none.
	 */

	intersectTriangle(a, b, c, backfaceCulling, target) {

		const direction = this.direction;

		// Compute the offset origin, edges, and normal.
		const diff = v$4[0];
		const edge1 = v$4[1];
		const edge2 = v$4[2];
		const normal = v$4[3];

		let result = null;
		let DdN, sign, DdQxE2, DdE1xQ, QdN;

		edge1.subVectors(b, a);
		edge2.subVectors(c, a);
		normal.crossVectors(edge1, edge2);

		/* Solve Q + t * D = b1 * E1 + b2 * E2
		 * (Q = kDiff, D = ray direction, E1 = kEdge1, E2 = kEdge2,
		 * N = Cross(E1, E2)):
		 *
		 *   | Dot(D, N) | * b1 = sign(Dot(D, N)) * Dot(D, Cross(Q, E2))
		 *   | Dot(D, N) | * b2 = sign(Dot(D, N)) * Dot(D, Cross(E1, Q))
		 *   | Dot(D, N) | * t = -sign(Dot(D, N)) * Dot(Q, N)
		 */

		DdN = direction.dot(normal);

		// Discard coplanar constellations and cull backfaces.
		if(DdN !== 0.0 && !(backfaceCulling && DdN > 0.0)) {

			if(DdN > 0.0) {

				sign = 1.0;

			} else {

				sign = -1.0;
				DdN = -DdN;

			}

			diff.subVectors(this.origin, a);
			DdQxE2 = sign * direction.dot(edge2.crossVectors(diff, edge2));

			// b1 < 0, no intersection.
			if(DdQxE2 >= 0.0) {

				DdE1xQ = sign * direction.dot(edge1.cross(diff));

				// b2 < 0, or b1 + b2 > 1, no intersection.
				if(DdE1xQ >= 0.0 && DdQxE2 + DdE1xQ <= DdN) {

					// The line intersects the triangle, check if the ray does.
					QdN = -sign * diff.dot(normal);

					// t < 0, no intersection.
					if(QdN >= 0.0) {

						// Ray intersects triangle.
						result = this.at(QdN / DdN, target);

					}

				}

			}

		}

		return result;

	}

	/**
	 * Applies the given matrix to this ray.
	 *
	 * @param {Matrix4} m - A matrix.
	 * @return {Ray} This ray.
	 */

	applyMatrix4(m) {

		this.origin.applyMatrix4(m);
		this.direction.transformDirection(m);

		return this;

	}

	/**
	 * Checks if this ray equals the given one.
	 *
	 * @param {Ray} r - A ray.
	 * @return {Boolean} Whether the rays are equal.
	 */

	equals(r) {

		return (r.origin.equals(this.origin) && r.direction.equals(this.direction));

	}

}

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const c = new Vector3();

/**
 * A cubic octant.
 *
 * @implements {Node}
 */

class CubicOctant {

	/**
	 * Constructs a new cubic octant.
	 *
	 * @param {Vector3} [min] - The lower bounds.
	 * @param {Number} [size=0] - The size of the octant.
	 */

	constructor(min = new Vector3(), size = 0) {

		/**
		 * The lower bounds of this octant.
		 *
		 * @type {Vector3}
		 */

		this.min = min;

		/**
		 * The size of this octant.
		 *
		 * @type {Number}
		 */

		this.size = size;

		/**
		 * The children of this octant.
		 *
		 * @type {CubicOctant[]}
		 */

		this.children = null;

	}

	/**
	 * The upper bounds of this octant.
	 *
	 * Attention: Accessing this property creates a new vector!
	 *
	 * @type {Vector3}
	 */

	get max() {

		return this.min.clone().addScalar(this.size);

	}

	/**
	 * Computes the center of this octant.
	 *
	 * @param {Vector3} target - A target vector.
	 * @return {Vector3} The center.
	 */

	getCenter(target) {

		return target.copy(this.min).addScalar(this.size * 0.5);

	}

	/**
	 * Returns the size of this octant as a vector.
	 *
	 * @param {Vector3} target - A target vector.
	 * @return {Vector3} The size.
	 */

	getDimensions(target) {

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

		let i, combination;

		for(i = 0; i < 8; ++i) {

			combination = layout[i];

			children[i] = new this.constructor(

				new Vector3(
					(combination[0] === 0) ? min.x : mid.x,
					(combination[1] === 0) ? min.y : mid.y,
					(combination[2] === 0) ? min.z : mid.z
				),

				halfSize

			);

		}

	}

}

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const c$1 = new Vector3();

/**
 * An octant.
 *
 * @implements {Node}
 */

class Octant {

	/**
	 * Constructs a new octant.
	 *
	 * @param {Vector3} [min] - The lower bounds.
	 * @param {Vector3} [max] - The upper bounds.
	 */

	constructor(min = new Vector3(), max = new Vector3()) {

		/**
		 * The lower bounds of this octant.
		 *
		 * @type {Vector3}
		 */

		this.min = min;

		/**
		 * The upper bounds of the octant.
		 *
		 * @type {Vector3}
		 */

		this.max = max;

		/**
		 * The children of this octant.
		 *
		 * @type {Octant[]}
		 */

		this.children = null;

	}

	/**
	 * Computes the center of this octant.
	 *
	 * @param {Vector3} target - A target vector.
	 * @return {Vector3} The center.
	 */

	getCenter(target) {

		return target.addVectors(this.min, this.max).multiplyScalar(0.5);

	}

	/**
	 * Computes the size of this octant.
	 *
	 * @param {Vector3} target - A target vector.
	 * @return {Vector3} The size.
	 */

	getDimensions(target) {

		return target.subVectors(this.max, this.min);

	}

	/**
	 * Splits this octant into eight smaller ones.
	 */

	split() {

		const min = this.min;
		const max = this.max;
		const mid = this.getCenter(c$1);

		const children = this.children = [
			null, null, null, null,
			null, null, null, null
		];

		let i, combination;

		for(i = 0; i < 8; ++i) {

			combination = layout[i];

			children[i] = new this.constructor(

				new Vector3(
					(combination[0] === 0) ? min.x : mid.x,
					(combination[1] === 0) ? min.y : mid.y,
					(combination[2] === 0) ? min.z : mid.z
				),

				new Vector3(
					(combination[0] === 0) ? mid.x : max.x,
					(combination[1] === 0) ? mid.y : max.y,
					(combination[2] === 0) ? mid.z : max.z
				)

			);

		}

	}

}

/**
 * A collection of ray-point intersection data.
 */

class RayPointIntersection {

	/**
	 * Constructs new ray-point intersection data.
	 *
	 * @param {Number} distance - The distance from the origin of the ray to the point.
	 * @param {Number} distanceToRay - The distance from the point to the ray.
	 * @param {Vector3} point - The point.
	 * @param {Object} [object=null] - The point's data.
	 */

	constructor(distance, distanceToRay, point, object = null) {

		/**
		 * The distance from the origin of the ray to the point.
		 *
		 * @type {Number}
		 */

		this.distance = distance;

		/**
		 * The shortest distance from the point to the ray.
		 *
		 * @type {Number}
		 */

		this.distanceToRay = distanceToRay;

		/**
		 * The point.
		 *
		 * @type {Vector3}
		 */

		this.point = point;

		/**
		 * The point's data.
		 *
		 * @type {Object}
		 */

		this.object = object;

	}

}

/**
 * Collects points that intersect with the given ray.
 *
 * @param {PointOctant[]} octants - An array containing octants that intersect with the ray.
 * @param {Raycaster} raycaster - The raycaster.
 * @param {RayPointIntersection[]} intersects - An array to be filled with intersecting points.
 */

function testPoints(octants, raycaster, intersects) {

	const threshold = raycaster.params.Points.threshold;
	const thresholdSq = threshold * threshold;

	let intersectPoint;
	let distance, distanceToRay;
	let rayPointDistanceSq;

	let i, j, il, jl;
	let octant, points, point;

	for(i = 0, il = octants.length; i < il; ++i) {

		octant = octants[i];
		points = octant.points;

		if(points !== null) {

			for(j = 0, jl = points.length; j < jl; ++j) {

				point = points[j];
				rayPointDistanceSq = raycaster.ray.distanceSqToPoint(point);

				if(rayPointDistanceSq < thresholdSq) {

					intersectPoint = raycaster.ray.closestPointToPoint(point, new Vector3());
					distance = raycaster.ray.origin.distanceTo(intersectPoint);

					if(distance >= raycaster.near && distance <= raycaster.far) {

						distanceToRay = Math.sqrt(rayPointDistanceSq);

						intersects.push(new RayPointIntersection(
							distance,
							distanceToRay,
							intersectPoint,
							octant.data[j]
						));

					}

				}

			}

		}

	}

}

/**
 * A container for raycasting flags.
 */

class Flags {

	/**
	 * Creates a new container for raycasting flags.
	 */

	constructor() {

		/**
		 * The current flags.
		 *
		 * @type {Number}
		 */

		this.value = 0;

	}

}

/**
 * Finds the entry plane of the first octant that a ray travels through.
 *
 * Determining the first octant requires knowing which of the t0s is the
 * largest. The tms of the other axes must also be compared against that
 * largest t0.
 *
 * @param {Number} tx0 - Ray projection parameter.
 * @param {Number} ty0 - Ray projection parameter.
 * @param {Number} tz0 - Ray projection parameter.
 * @param {Number} txm - Ray projection parameter mean.
 * @param {Number} tym - Ray projection parameter mean.
 * @param {Number} tzm - Ray projection parameter mean.
 * @return {Number} The index of the first octant that the ray travels through.
 */

function findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {

	let entry = 0;

	// Find the entry plane.
	if(tx0 > ty0 && tx0 > tz0) {

		// YZ-plane.
		if(tym < tx0) {

			entry |= 2;

		}

		if(tzm < tx0) {

			entry |= 1;

		}

	} else if(ty0 > tz0) {

		// XZ-plane.
		if(txm < ty0) {

			entry |= 4;

		}

		if(tzm < ty0) {

			entry |= 1;

		}

	} else {

		// XY-plane.
		if(txm < tz0) {

			entry |= 4;

		}

		if(tym < tz0) {

			entry |= 2;

		}

	}

	return entry;

}

/**
 * A lookup-table containing octant ids. Used to determine the exit plane from
 * an octant.
 *
 * @type {Uint8Array[]}
 * @private
 */

const octantTable = [

	new Uint8Array([4, 2, 1]),
	new Uint8Array([5, 3, 8]),
	new Uint8Array([6, 8, 3]),
	new Uint8Array([7, 8, 8]),
	new Uint8Array([8, 6, 5]),
	new Uint8Array([8, 7, 8]),
	new Uint8Array([8, 8, 7]),
	new Uint8Array([8, 8, 8])

];

/**
 * Finds the next octant that intersects with the ray based on the exit plane of
 * the current one.
 *
 * @param {Number} currentOctant - The index of the current octant.
 * @param {Number} tx1 - Ray projection parameter.
 * @param {Number} ty1 - Ray projection parameter.
 * @param {Number} tz1 - Ray projection parameter.
 * @return {Number} The index of the next octant that the ray travels through.
 */

function findNextOctant(currentOctant, tx1, ty1, tz1) {

	let min;
	let exit = 0;

	// Find the exit plane.
	if(tx1 < ty1) {

		min = tx1;
		exit = 0; // YZ-plane.

	} else {

		min = ty1;
		exit = 1; // XZ-plane.

	}

	if(tz1 < min) {

		exit = 2; // XY-plane.

	}

	return octantTable[currentOctant][exit];

}

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const v$1 = new Vector3();

/**
 * A box.
 *
 * @type {Box3}
 * @private
 */

const b = new Box3();

/**
 * A box.
 *
 * @type {Box3}
 * @private
 */

const d = new Box3();

/**
 * A ray.
 *
 * @type {Ray}
 * @private
 */

const r = new Ray();

/**
 * Calculates ray projection parameters for the given octree and ray setup.
 *
 * @param {Octree} octree - The octree.
 * @param {Ray} ray - A ray.
 * @param {Flags} flags - Raycasting flags.
 * @return {Number[]} The ray parameters tx0, tx1, ty0, ty1, tz0 and tz1, or null if the ray doesn't hit the octree.
 */

function intersectOctree(octree, ray, flags) {

	// Translate the octant extents to the scene origin.
	const min = b.min.set(0, 0, 0);
	const max = b.max.subVectors(octree.max, octree.min);

	const dimensions = octree.getDimensions(d.min);
	const halfDimensions = d.max.copy(dimensions).multiplyScalar(0.5);

	const origin = r.origin.copy(ray.origin);
	const direction = r.direction.copy(ray.direction);

	let invDirX, invDirY, invDirZ;
	let tx0, tx1, ty0, ty1, tz0, tz1;

	// Translate the ray to the center of the octant.
	origin.sub(octree.getCenter(v$1)).add(halfDimensions);

	// Reset all flags.
	flags.value = 0;

	// Handle rays with negative directions.
	if(direction.x < 0.0) {

		origin.x = dimensions.x - origin.x;
		direction.x = -direction.x;
		flags.value |= 4;

	}

	if(direction.y < 0.0) {

		origin.y = dimensions.y - origin.y;
		direction.y = -direction.y;
		flags.value |= 2;

	}

	if(direction.z < 0.0) {

		origin.z = dimensions.z - origin.z;
		direction.z = -direction.z;
		flags.value |= 1;

	}

	// Improve IEEE double stability.
	invDirX = 1.0 / direction.x;
	invDirY = 1.0 / direction.y;
	invDirZ = 1.0 / direction.z;

	// Project the ray to the octant's boundaries.
	tx0 = (min.x - origin.x) * invDirX;
	tx1 = (max.x - origin.x) * invDirX;
	ty0 = (min.y - origin.y) * invDirY;
	ty1 = (max.y - origin.y) * invDirY;
	tz0 = (min.z - origin.z) * invDirZ;
	tz1 = (max.z - origin.z) * invDirZ;

	// Check if the ray hits the octree.
	return (Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1)) ?
		[tx0, ty0, tz0, tx1, ty1, tz1] : null;

}

/**
 * Raycasting flags.
 *
 * @type {Flags}
 */

const flags = new Flags();

/**
 * Finds all octants that intersect with the given ray.
 *
 * @private
 * @param {Octant} octant - The current octant.
 * @param {Number} tx0 - A ray projection parameter.
 * @param {Number} ty0 - A ray projection parameter.
 * @param {Number} tz0 - A ray projection parameter.
 * @param {Number} tx1 - A ray projection parameter.
 * @param {Number} ty1 - A ray projection parameter.
 * @param {Number} tz1 - A ray projection parameter.
 * @param {Array} intersects - An array to be filled with the intersecting octants.
 */

function raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, intersects) {

	if(tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

		const children = octant.children;

		if(children === null) {

			// Leaf.
			intersects.push(octant);

		} else {

			// Compute means.
			const txm = 0.5 * (tx0 + tx1);
			const tym = 0.5 * (ty0 + ty1);
			const tzm = 0.5 * (tz0 + tz1);

			const f = flags.value;
			let currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

			/* The possibilities for the next node are passed in the same respective
			order as the t-values. Hence, if the first value is found to be the
			greatest, the fourth one will be returned. If the second value is the
			greatest, the fifth one will be returned, etc. */

			do {

				switch(currentOctant) {

					case 0:
						raycastOctant(children[f], tx0, ty0, tz0, txm, tym, tzm, intersects);
						currentOctant = findNextOctant(currentOctant, txm, tym, tzm);
						break;

					case 1:
						raycastOctant(children[f ^ 1], tx0, ty0, tzm, txm, tym, tz1, intersects);
						currentOctant = findNextOctant(currentOctant, txm, tym, tz1);
						break;

					case 2:
						raycastOctant(children[f ^ 2], tx0, tym, tz0, txm, ty1, tzm, intersects);
						currentOctant = findNextOctant(currentOctant, txm, ty1, tzm);
						break;

					case 3:
						raycastOctant(children[f ^ 3], tx0, tym, tzm, txm, ty1, tz1, intersects);
						currentOctant = findNextOctant(currentOctant, txm, ty1, tz1);
						break;

					case 4:
						raycastOctant(children[f ^ 4], txm, ty0, tz0, tx1, tym, tzm, intersects);
						currentOctant = findNextOctant(currentOctant, tx1, tym, tzm);
						break;

					case 5:
						raycastOctant(children[f ^ 5], txm, ty0, tzm, tx1, tym, tz1, intersects);
						currentOctant = findNextOctant(currentOctant, tx1, tym, tz1);
						break;

					case 6:
						raycastOctant(children[f ^ 6], txm, tym, tz0, tx1, ty1, tzm, intersects);
						currentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);
						break;

					case 7:
						raycastOctant(children[f ^ 7], txm, tym, tzm, tx1, ty1, tz1, intersects);
						// Far top right octant. No other octants can be reached from here.
						currentOctant = 8;
						break;

				}

			} while(currentOctant < 8);

		}

	}

}

/**
 * A raycaster for pointer-based octrees.
 *
 * Reference:
 *  "An Efficient Parametric Algorithm for Octree Traversal"
 *  by J. Revelles et al. (2000)
 */

class OctreeRaycaster {

	/**
	 * Finds (pseudo) leaf octants that intersect with the given ray.
	 *
	 * @param {Octree} octree - An octree.
	 * @param {Ray} ray - A ray.
	 * @param {Octant[]} [intersects] - An optional target list to be filled with the intersecting octants.
	 * @return {Octant[]} The intersecting octants. Sorted by distance, closest first.
	 */

	static intersectOctree(octree, ray, intersects = []) {

		const parameters = intersectOctree(octree, ray, flags);

		if(parameters !== null) {

			raycastOctant(octree.root, ...parameters, intersects);

		}

	}

}

/**
 * A basic iterator result.
 *
 * The next method of an iterator always has to return an object with
 * appropriate properties including done and value.
 */

class IteratorResult {

	/**
	 * Constructs a new iterator result.
	 *
	 * @param {Vector3} [value=null] - A value.
	 * @param {Vector3} [done=false] - Whether this result is past the end of the iterated sequence.
	 */

	constructor(value = null, done = false) {

		/**
		 * An arbitrary value returned by the iterator.
		 *
		 * @type {Object}
		 */

		this.value = value;

		/**
		 * Whether this result is past the end of the iterated sequence.
		 *
		 * @type {Boolean}
		 */

		this.done = done;

	}

	/**
	 * Resets this iterator result.
	 */

	reset() {

		this.value = null;
		this.done = false;

	}

}

/**
 * A 3D box.
 *
 * @type {Box3}
 * @private
 */

const b$1 = new Box3();

/**
 * An octree iterator.
 *
 * @implements {Iterator}
 * @implements {Iterable}
 */

class OctreeIterator {

	/**
	 * Constructs a new octant iterator.
	 *
	 * @param {Octree} octree - An octree.
	 * @param {Frustum|Box3} [region=null] - A cull region.
	 */

	constructor(octree, region = null) {

		/**
		 * The octree.
		 *
		 * @type {Octree}
		 * @private
		 */

		this.octree = octree;

		/**
		 * A region used for octree culling.
		 *
		 * @type {Frustum|Box3}
		 */

		this.region = region;

		/**
		 * Whether this iterator should respect the cull region.
		 *
		 * @type {Boolean}
		 */

		this.cull = (region !== null);

		/**
		 * An iterator result.
		 *
		 * @type {IteratorResult}
		 * @private
		 */

		this.result = new IteratorResult();

		/**
		 * An octant trace.
		 *
		 * @type {Octant[]}
		 * @private
		 */

		this.trace = null;

		/**
		 * Iteration indices.
		 *
		 * @type {Number[]}
		 * @private
		 */

		this.indices = null;

		this.reset();

	}

	/**
	 * Resets this iterator.
	 *
	 * @return {OctreeIterator} This iterator.
	 */

	reset() {

		const root = this.octree.root;

		this.trace = [];
		this.indices = [];

		if(root !== null) {

			b$1.min = root.min;
			b$1.max = root.max;

			if(!this.cull || this.region.intersectsBox(b$1)) {

				this.trace.push(root);
				this.indices.push(0);

			}

		}

		this.result.reset();

		return this;

	}

	/**
	 * Iterates over the leaf octants.
	 *
	 * @return {IteratorResult} The next leaf octant.
	 */

	next() {

		const cull = this.cull;
		const region = this.region;
		const indices = this.indices;
		const trace = this.trace;

		let octant = null;
		let depth = trace.length - 1;

		let index, children, child;

		while(octant === null && depth >= 0) {

			index = indices[depth]++;
			children = trace[depth].children;

			if(index < 8) {

				if(children !== null) {

					child = children[index];

					if(cull) {

						b$1.min = child.min;
						b$1.max = child.max;

						if(!region.intersectsBox(b$1)) {

							// Cull this octant.
							continue;

						}

					}

					trace.push(child);
					indices.push(0);

					++depth;

				} else {

					octant = trace.pop();
					indices.pop();

				}

			} else {

				trace.pop();
				indices.pop();

				--depth;

			}

		}

		this.result.value = octant;
		this.result.done = (octant === null);

		return this.result;

	}

	/**
	 * Called when this iterator will no longer be run to completion.
	 *
	 * @param {Object} value - An interator result value.
	 * @return {IteratorResult} - A premature completion result.
	 */

	return(value) {

		this.result.value = value;
		this.result.done = true;

		return this.result;

	}

	/**
	 * Returns this iterator.
	 *
	 * @return {Iterator} An iterator.
	 */

	[Symbol.iterator]() {

		return this;

	}

}

/**
 * A 3D box.
 *
 * @type {Box3}
 * @private
 */

const b$2 = new Box3();

/**
 * Recursively calculates the depth of the given octree.
 *
 * @private
 * @param {Node} octant - An octant.
 * @return {Number} The depth.
 */

function getDepth(octant) {

	const children = octant.children;

	let result = 0;
	let i, l, d;

	if(children !== null) {

		for(i = 0, l = children.length; i < l; ++i) {

			d = 1 + getDepth(children[i]);

			if(d > result) {

				result = d;

			}

		}

	}

	return result;

}

/**
 * Recursively collects octants that lie inside the specified region.
 *
 * @private
 * @param {Node} octant - An octant.
 * @param {Frustum|Box3} region - A region.
 * @param {Node[]} result - A list to be filled with octants that intersect with the region.
 */

function cull(octant, region, result) {

	const children = octant.children;

	let i, l;

	b$2.min = octant.min;
	b$2.max = octant.max;

	if(region.intersectsBox(b$2)) {

		if(children !== null) {

			for(i = 0, l = children.length; i < l; ++i) {

				cull(children[i], region, result);

			}

		} else {

			result.push(octant);

		}

	}

}

/**
 * Recursively fetches all octants with the specified depth level.
 *
 * @private
 * @param {Node} octant - An octant.
 * @param {Number} level - The target depth level.
 * @param {Number} depth - The current depth level.
 * @param {Node[]} result - A list to be filled with the identified octants.
 */

function findNodesByLevel(octant, level, depth, result) {

	const children = octant.children;

	let i, l;

	if(depth === level) {

		result.push(octant);

	} else if(children !== null) {

		++depth;

		for(i = 0, l = children.length; i < l; ++i) {

			findNodesByLevel(children[i], level, depth, result);

		}

	}

}

/**
 * A pointer-based octree that subdivides space for fast spatial searches.
 *
 * @implements {Iterable}
 * @implements {Node}
 * @implements {Tree}
 */

class Octree {

	/**
	 * Constructs a new octree.
	 *
	 * @param {Node} root - The root node. See {@link Octant} or {@link CubicOctant}.
	 */

	constructor(root) {

		/**
		 * The root octant.
		 *
		 * @type {Node}
		 * @protected
		 */

		this.root = root;

	}

	/**
	 * The lower bounds of the root octant.
	 *
	 * @type {Vector3}
	 */

	get min() {

		return this.root.min;

	}

	/**
	 * The upper bounds of the root octant.
	 *
	 * @type {Vector3}
	 */

	get max() {

		return this.root.max;

	}

	/**
	 * The children of the root node.
	 *
	 * @type {Node[]}
	 */

	get children() {

		return this.root.children;

	}

	/**
	 * Calculates the center of this octree.
	 *
	 * @param {Vector3} target - A target vector.
	 * @return {Vector3} A vector that describes the center of this octree.
	 */

	getCenter(target) {

		return this.root.getCenter(target);

	}

	/**
	 * Calculates the size of this octree.
	 *
	 * @param {Vector3} target - A target vector.
	 * @return {Vector3} A vector that describes the size of this octree.
	 */

	getDimensions(target) {

		return this.root.getDimensions(target);

	}

	/**
	 * Recursively collects nodes that intersect with the specified region.
	 *
	 * @param {Frustum|Box3} region - A region.
	 * @return {Node[]} The nodes.
	 */

	cull(region) {

		const result = [];

		cull(this.root, region, result);

		return result;

	}

	/**
	 * Calculates the current depth of this octree.
	 *
	 * @return {Number} The depth.
	 */

	getDepth() {

		return getDepth(this.root);

	}

	/**
	 * Fetches all nodes of a specific depth level.
	 *
	 * @param {Number} level - The depth level.
	 * @return {Node[]} The nodes.
	 */

	findNodesByLevel(level) {

		const result = [];

		findNodesByLevel(this.root, level, 0, result);

		return result;

	}

	/**
	 * Finds the nodes that intersect with the given ray. The intersecting
	 * nodes are sorted by distance, closest first.
	 *
	 * @param {Raycaster} raycaster - A raycaster.
	 * @param {Node[]} [intersects] - An optional target list to be filled with the intersecting nodes.
	 * @return {Node[]} The intersecting nodes.
	 */

	raycast(raycaster, intersects = []) {

		OctreeRaycaster.intersectOctree(this, raycaster.ray, intersects);

		return intersects;

	}

	/**
	 * Returns an iterator that traverses the octree and returns leaf nodes.
	 *
	 * When a cull region is provided, the iterator will only return leaves that
	 * intersect with that region.
	 *
	 * @param {Frustum|Box3} [region] - A cull region.
	 * @return {Iterator} An iterator.
	 */

	leaves(region) {

		return new OctreeIterator(this, region);

	}

	/**
	 * Returns an iterator that traverses the octree and returns all leaf nodes.
	 *
	 * @return {Iterator} An iterator.
	 */

	[Symbol.iterator]() {

		return new OctreeIterator(this);

	}

}

/**
 * A point.
 *
 * @type {Vector3}
 * @private
 */

const p = new Vector3();

/**
 * An octant that maintains points.
 */

class PointOctant extends Octant {

	/**
	 * Constructs a new point octant.
	 *
	 * @param {Vector3} [min] - The lower bounds.
	 * @param {Vector3} [max] - The upper bounds.
	 */

	constructor(min, max) {

		super(min, max);

		/**
		 * The points.
		 *
		 * @type {Vector3[]}
		 */

		this.points = null;

		/**
		 * Point data.
		 *
		 * @type {Array}
		 */

		this.data = null;

	}

	/**
	 * Calculates the distance squared from this octant to the given point.
	 *
	 * @param {Vector3} point - A point.
	 * @return {Number} The distance squared.
	 */

	distanceToSquared(point) {

		const clampedPoint = p.copy(point).clamp(this.min, this.max);

		return clampedPoint.sub(point).lengthSquared();

	}

	/**
	 * Calculates the distance squared from the center of this octant to the given
	 * point.
	 *
	 * @param {Vector3} point - A point.
	 * @return {Number} The distance squared.
	 */

	distanceToCenterSquared(point) {

		const center = this.getCenter(p);

		const dx = point.x - center.x;
		const dy = point.y - center.x;
		const dz = point.z - center.z;

		return dx * dx + dy * dy + dz * dz;

	}

	/**
	 * Checks if the given point lies inside this octant's boundaries.
	 *
	 * This method can also be used to check if this octant intersects a sphere by
	 * providing a radius as bias.
	 *
	 * @param {Vector3} point - A point.
	 * @param {Number} bias - A padding that extends the boundaries temporarily.
	 * @return {Boolean} Whether the given point lies inside this octant.
	 */

	contains(point, bias) {

		const min = this.min;
		const max = this.max;

		return (
			point.x >= min.x - bias &&
			point.y >= min.y - bias &&
			point.z >= min.z - bias &&
			point.x <= max.x + bias &&
			point.y <= max.y + bias &&
			point.z <= max.z + bias
		);

	}

	/**
	 * Redistributes the points of this octant to its children.
	 *
	 * Has no effect if there are no points or if this octant has no children.
	 *
	 * @param {Number} bias - A proximity threshold.
	 */

	redistribute(bias) {

		const children = this.children;
		const points = this.points;
		const data = this.data;

		let i, j, il, jl;
		let child, point, entry;

		if(children !== null && points !== null) {

			for(i = 0, il = points.length; i < il; ++i) {

				point = points[i];
				entry = data[i];

				for(j = 0, jl = children.length; j < jl; ++j) {

					child = children[j];

					if(child.contains(point, bias)) {

						if(child.points === null) {

							child.points = [];
							child.data = [];

						}

						child.points.push(point);
						child.data.push(entry);

						break;

					}

				}

			}

			this.points = null;
			this.data = null;

		}

	}

	/**
	 * Deletes all child nodes and collects their points.
	 */

	merge() {

		const children = this.children;

		if(children !== null) {

			let points = [];
			let data = [];

			let i, l, child;

			for(i = 0, l = children.length; i < l; ++i) {

				child = children[i];

				if(child.points !== null) {

					points = points.concat(child.points);
					data = data.concat(child.data);

				}

			}

			/** @ignore */
			this.children = null;
			this.points = points;
			this.data = data;

		}

	}

}

/**
 * Recursively counts how many points are in the given octant.
 *
 * @private
 * @param {Octant} octant - An octant.
 * @return {Number} The amount of points.
 */

function countPoints(octant) {

	const children = octant.children;

	let result = 0;
	let i, l;

	if(children !== null) {

		for(i = 0, l = children.length; i < l; ++i) {

			result += countPoints(children[i]);

		}

	} else if(octant.points !== null) {

		result = octant.points.length;

	}

	return result;

}

/**
 * Recursively inserts a point into the octree.
 *
 * @private
 * @param {Vector3} point - A point.
 * @param {Object} data - An object that the point represents.
 * @param {Octree} octree - The octree.
 * @param {Octant} octant - The current octant.
 * @param {Number} depth - The current depth.
 * @return {Boolean} Whether the operation was successful.
 */

function insert(point, data, octree, octant, depth) {

	let children = octant.children;
	let exists = false;
	let done = false;
	let i, l;

	if(octant.contains(point, octree.bias)) {

		if(children === null) {

			if(octant.points === null) {

				octant.points = [];
				octant.data = [];

			} else {

				for(i = 0, l = octant.points.length; !exists && i < l; ++i) {

					exists = octant.points[i].equals(point);

				}

			}

			if(exists) {

				octant.data[i - 1] = data;
				done = true;

			} else if(octant.points.length < octree.maxPoints || depth === octree.maxDepth) {

				octant.points.push(point.clone());
				octant.data.push(data);
				++octree.pointCount;
				done = true;

			} else {

				octant.split();
				octant.redistribute(octree.bias);
				children = octant.children;

			}

		}

		if(children !== null) {

			++depth;

			for(i = 0, l = children.length; !done && i < l; ++i) {

				done = insert(point, data, octree, children[i], depth);

			}

		}

	}

	return done;

}

/**
 * Recursively finds a point in the octree and removes it.
 *
 * @private
 * @param {Vector3} point - A point.
 * @param {Octree} octree - The octree.
 * @param {Octant} octant - The current octant.
 * @param {Octant} parent - The parent of the current octant.
 * @return {Object} The data entry of the removed point or null if it didn't exist.
 */

function remove(point, octree, octant, parent) {

	const children = octant.children;

	let result = null;

	let i, l;
	let points, data, last;

	if(octant.contains(point, octree.bias)) {

		if(children !== null) {

			for(i = 0, l = children.length; result === null && i < l; ++i) {

				result = remove(point, octree, children[i], octant);

			}

		} else if(octant.points !== null) {

			points = octant.points;
			data = octant.data;

			for(i = 0, l = points.length; i < l; ++i) {

				if(points[i].equals(point)) {

					last = l - 1;
					result = data[i];

					// If the point is NOT the last one in the array:
					if(i < last) {

						// Overwrite with the last point and data entry.
						points[i] = points[last];
						data[i] = data[last];

					}

					// Drop the last entry.
					points.pop();
					data.pop();

					--octree.pointCount;

					if(parent !== null && countPoints(parent) <= octree.maxPoints) {

						parent.merge();

					}

					break;

				}

			}

		}

	}

	return result;

}

/**
 * Recursively finds a point in the octree and fetches the associated data.
 *
 * @private
 * @param {Vector3} point - A point.
 * @param {Octree} octree - The octree.
 * @param {Octant} octant - The current octant octant.
 * @return {Object} The data entry that is associated with the given point or null if it doesn't exist.
 */

function get(point, octree, octant) {

	const children = octant.children;

	let result = null;

	let i, l;
	let points;

	if(octant.contains(point, octree.bias)) {

		if(children !== null) {

			for(i = 0, l = children.length; result === null && i < l; ++i) {

				result = get(point, octree, children[i]);

			}

		} else if(octant.points !== null) {

			points = octant.points;

			for(i = 0, l = points.length; result === null && i < l; ++i) {

				if(point.equals(points[i])) {

					result = octant.data[i];

				}

			}

		}

	}

	return result;

}

/**
 * Recursively moves an existing point to a new position.
 *
 * @private
 * @param {Vector3} point - The point.
 * @param {Vector3} position - The new position.
 * @param {Octree} octree - The octree.
 * @param {Octant} octant - The current octant.
 * @param {Octant} parent - The parent of the current octant.
 * @param {Number} depth - The current depth.
 * @return {Object} The data entry of the updated point or null if it didn't exist.
 */

function move(point, position, octree, octant, parent, depth) {

	const children = octant.children;

	let result = null;

	let i, l;
	let points;

	if(octant.contains(point, octree.bias)) {

		if(octant.contains(position, octree.bias)) {

			// The point and the new position both fall into the current octant.
			if(children !== null) {

				++depth;

				for(i = 0, l = children.length; result === null && i < l; ++i) {

					result = move(point, position, octree, children[i], octant, depth);

				}

			} else if(octant.points !== null) {

				// No divergence - the point can be updated in place.
				points = octant.points;

				for(i = 0, l = points.length; i < l; ++i) {

					if(point.equals(points[i])) {

						// The point exists! Update its position.
						points[i].copy(position);
						result = octant.data[i];

						break;

					}

				}

			}

		} else {

			// Retrieve the point and remove it.
			result = remove(point, octree, octant, parent);

			// Go back to the parent octant and add the updated point.
			insert(position, result, octree, parent, depth - 1);

		}

	}

	return result;

}

/**
 * Recursively finds the closest point to the given one.
 *
 * @private
 * @param {Vector3} point - The point.
 * @param {Number} maxDistance - The maximum distance.
 * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
 * @param {Octant} octant - The current octant.
 * @return {Object} An object representing the nearest point or null if there is none.
 * @property {Vector3} point - The nearest point.
 * @property {Object} data - The data that belongs to the point.
 * @property {Number} distance - The distance to the given point.
 */

function findNearestPoint(point, maxDistance, skipSelf, octant) {

	let result = null;
	let bestDistance = maxDistance;
	let i, l;

	if(octant.children !== null) {

		// Sort the children: smallest distance to the point first, ASC.
		const sortedChildren = octant.children.map((child) => {

			// Precompute distances.
			return {
				octant: child,
				distance: child.distanceToCenterSquared(point)
			};

		}).sort((a, b) => a.distance - b.distance);

		let child, intermediateResult;

		// Traverse from closest to furthest.
		for(i = 0, l = sortedChildren.length; i < l; ++i) {

			child = sortedChildren[i].octant;

			if(child.contains(point, bestDistance)) {

				intermediateResult = findNearestPoint(point, bestDistance, skipSelf, child);

				if(intermediateResult !== null) {

					bestDistance = intermediateResult.distance;
					result = intermediateResult;

					if(bestDistance === 0.0) {

						break;

					}

				}

			}

		}

	} else if(octant.points !== null) {

		const points = octant.points;

		let index = -1;
		let distance;

		for(i = 0, l = points.length; i < l; ++i) {

			if(points[i].equals(point)) {

				if(!skipSelf) {

					bestDistance = 0.0;
					index = i;
					break;

				}

			} else {

				distance = point.distanceTo(points[i]);

				if(distance < bestDistance) {

					bestDistance = distance;
					index = i;

				}

			}

		}

		if(index >= 0) {

			result = {
				point: points[index],
				data: octant.data[index],
				distance: bestDistance
			};

		}

	}

	return result;

}

/**
 * Recursively finds points that are inside the specified radius around a given
 * position.
 *
 * @private
 * @param {Vector3} point - A position.
 * @param {Number} radius - A radius.
 * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
 * @param {Octant} octant - The current octant.
 * @param {Array<Object>} result - An array to be filled with objects.
 * @property {Vector3} point - A point.
 * @property {Object} data - The data that belongs to the point.
 */

function findPoints(point, radius, skipSelf, octant, result) {

	const children = octant.children;

	let i, l;

	if(children !== null) {

		let child;

		for(i = 0, l = children.length; i < l; ++i) {

			child = children[i];

			if(child.contains(point, radius)) {

				findPoints(point, radius, skipSelf, child, result);

			}

		}

	} else if(octant.points !== null) {

		const points = octant.points;
		const rSq = radius * radius;

		let p;

		for(i = 0, l = points.length; i < l; ++i) {

			p = points[i];

			if(p.equals(point)) {

				if(!skipSelf) {

					result.push({
						point: p.clone(),
						data: octant.data[i]
					});

				}

			} else if(p.distanceToSquared(point) <= rSq) {

				result.push({
					point: p.clone(),
					data: octant.data[i]
				});

			}

		}

	}

}

/**
 * An octree that manages points.
 */

class PointOctree extends Octree {

	/**
	 * Constructs a new point octree.
	 *
	 * @param {Vector3} [min] - The lower bounds of the tree.
	 * @param {Vector3} [max] - The upper bounds of the tree.
	 * @param {Number} [bias=0.0] - An octant boundary bias. The octree is considered "loose" with a bias greater than 0.
	 * @param {Number} [maxPoints=8] - Number of distinct points per octant before it splits up.
	 * @param {Number} [maxDepth=8] - The maximum tree depth level, starting at 0.
	 */

	constructor(min, max, bias = 0.0, maxPoints = 8, maxDepth = 8) {

		super(new PointOctant(min, max));

		/**
		 * An octant boundary bias.
		 *
		 * @type {Number}
		 * @private
		 */

		this.bias = Math.max(0.0, bias);

		/**
		 * The number of points per octant before a split occurs.
		 *
		 * This value works together with the maximum depth as a secondary limiting
		 * factor. Smaller values cause splits to occur earlier which results in a
		 * faster and deeper tree growth.
		 *
		 * @type {Number}
		 * @private
		 */

		this.maxPoints = Math.max(1, Math.round(maxPoints));

		/**
		 * The maximum tree depth level.
		 *
		 * It's possible to use Infinity, but keep in mind that allowing infinitely
		 * small octants can have a severely negative impact on performance.
		 * Finding a value that works best for a specific scene is advisable.
		 *
		 * @type {Number}
		 * @private
		 */

		this.maxDepth = Math.max(0, Math.round(maxDepth));

		/**
		 * The amount of points that are currently in this octree.
		 *
		 * @type {Number}
		 */

		this.pointCount = 0;

	}

	/**
	 * Counts how many points are in the given octant.
	 *
	 * @param {Octant} octant - An octant.
	 * @return {Number} The amount of points.
	 */

	countPoints(octant) {

		return countPoints(octant);

	}

	/**
	 * Puts a point into the octree.
	 *
	 * @param {Vector3} point - A point. If it's already in the octree, the data entry will be updated.
	 * @param {Object} data - A data object that belongs to the point.
	 * @return {Boolean} Whether the operation was successful.
	 */

	insert(point, data) {

		return insert(point, data, this, this.root, 0);

	}

	/**
	 * Removes a point from the tree.
	 *
	 * @param {Vector3} point - A point.
	 * @return {Object} The data entry of the removed point or null if it didn't exist.
	 */

	remove(point) {

		return remove(point, this, this.root, null);

	}

	/**
	 * Retrieves the data of the specified point.
	 *
	 * @param {Vector3} point - A position.
	 * @return {Object} The data entry that is associated with the given point or null if it doesn't exist.
	 */

	get(point) {

		return get(point, this, this.root);

	}

	/**
	 * Moves an existing point to a new position. Has no effect if the point
	 * doesn't exist.
	 *
	 * @param {Vector3} point - The point.
	 * @param {Vector3} position - The new position.
	 * @return {Object} The data entry of the updated point or null if it didn't exist.
	 */

	move(point, position) {

		return move(point, position, this, this.root, null, 0);

	}

	/**
	 * Finds the closest point to the given one.
	 *
	 * @param {Vector3} point - A point.
	 * @param {Number} [maxDistance=Infinity] - An upper limit for the distance between the points.
	 * @param {Boolean} [skipSelf=false] - Whether a point that is exactly at the given position should be skipped.
	 * @return {Object} An object representing the nearest point or null if there is none.
	 * @property {Vector3} point - The nearest point.
	 * @property {Object} data - The data that belongs to the point.
	 * @property {Number} distance - The distance to the given point.
	 */

	findNearestPoint(point, maxDistance = Infinity, skipSelf = false) {

		const result = findNearestPoint(point, maxDistance, skipSelf, this.root);

		if(result !== null) {

			result.point = result.point.clone();

		}

		return result;

	}

	/**
	 * Finds points that are in the specified radius around the given position.
	 *
	 * @param {Vector3} point - A position.
	 * @param {Number} radius - A radius.
	 * @param {Boolean} [skipSelf=false] - Whether a point that is exactly at the given position should be skipped.
	 * @return {Array<Object>} An array of objects.
	 * @property {Vector3} point - A point.
	 * @property {Object} data - The data that belongs to the point.
	 */

	findPoints(point, radius, skipSelf = false) {

		const result = [];

		findPoints(point, radius, skipSelf, this.root, result);

		return result;

	}

	/**
	 * Finds the points that intersect with the given ray.
	 *
	 * @param {Raycaster} raycaster - The raycaster.
	 * @param {Array} [intersects] - An array to be filled with the intersecting points.
	 * @return {RayPointIntersection[]} The intersecting points.
	 */

	raycast(raycaster, intersects = []) {

		const octants = super.raycast(raycaster);

		if(octants.length > 0) {

			testPoints(octants, raycaster, intersects);

		}

		return intersects;

	}

}

export { CubicOctant, Flags, Octant, Octree, OctreeIterator, OctreeRaycaster, PointOctant, PointOctree, RayPointIntersection, edges, findEntryOctant, findNextOctant, intersectOctree, layout, testPoints };
