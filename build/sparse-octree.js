/**
 * sparse-octree v2.6.0 build Jan 12 2017
 * https://github.com/vanruesc/sparse-octree
 * Copyright 2017 Raoul van Rüschen, Zlib
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
  typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
  (factory((global.OCTREE = global.OCTREE || {}),global.THREE));
}(this, (function (exports,three) { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();







  var get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };











  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };



















  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

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

  var Vector3 = function () {
  	function Vector3() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		classCallCheck(this, Vector3);


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

  	createClass(Vector3, [{
  		key: "set",
  		value: function set$$1(x, y, z) {

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

  	}, {
  		key: "copy",
  		value: function copy(v) {

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

  	}, {
  		key: "fromArray",
  		value: function fromArray(array, offset) {

  			if (offset === undefined) {
  				offset = 0;
  			}

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

  	}, {
  		key: "toArray",
  		value: function toArray$$1(array, offset) {

  			if (array === undefined) {
  				array = [];
  			}
  			if (offset === undefined) {
  				offset = 0;
  			}

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

  	}, {
  		key: "equals",
  		value: function equals(v) {

  			return v.x === this.x && v.y === this.y && v.z === this.z;
  		}

  		/**
     * Clones this vector.
     *
     * @method clone
     * @return {Vector3} A clone of this vector.
     */

  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.x, this.y, this.z);
  		}

  		/**
     * Adds a vector to this one.
     *
     * @method add
     * @param {Vector3} v - The vector to add.
     * @return {Vector3} This vector.
     */

  	}, {
  		key: "add",
  		value: function add(v) {

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

  	}, {
  		key: "addScaledVector",
  		value: function addScaledVector(v, s) {

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

  	}, {
  		key: "addScalar",
  		value: function addScalar(s) {

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

  	}, {
  		key: "addVectors",
  		value: function addVectors(a, b) {

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

  	}, {
  		key: "sub",
  		value: function sub(v) {

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

  	}, {
  		key: "subScalar",
  		value: function subScalar(s) {

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

  	}, {
  		key: "subVectors",
  		value: function subVectors(a, b) {

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

  	}, {
  		key: "multiply",
  		value: function multiply(v) {

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

  	}, {
  		key: "multiplyScalar",
  		value: function multiplyScalar(s) {

  			if (isFinite(s)) {

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

  	}, {
  		key: "multiplyVectors",
  		value: function multiplyVectors(a, b) {

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

  	}, {
  		key: "divide",
  		value: function divide(v) {

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

  	}, {
  		key: "divideScalar",
  		value: function divideScalar(s) {

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

  	}, {
  		key: "divideVectors",
  		value: function divideVectors(a, b) {

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

  	}, {
  		key: "dot",
  		value: function dot(v) {

  			return this.x * v.x + this.y * v.y + this.z * v.z;
  		}

  		/**
     * Calculates the squared length of this vector.
     *
     * @method lengthSq
     * @return {Number} The squared length.
     */

  	}, {
  		key: "lengthSq",
  		value: function lengthSq() {

  			return this.x * this.x + this.y * this.y + this.z * this.z;
  		}

  		/**
     * Calculates the length of this vector.
     *
     * @method length
     * @return {Number} The length.
     */

  	}, {
  		key: "length",
  		value: function length() {

  			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  		}

  		/**
     * Calculates the distance to a given vector.
     *
     * @method distanceTo
     * @param {Vector3} v - A vector.
     * @return {Number} The distance.
     */

  	}, {
  		key: "distanceTo",
  		value: function distanceTo(v) {

  			return Math.sqrt(this.distanceToSquared(v));
  		}

  		/**
     * Calculates the squared distance to a given vector.
     *
     * @method distanceToSquared
     * @param {Vector3} v - A vector.
     * @return {Number} The squared distance.
     */

  	}, {
  		key: "distanceToSquared",
  		value: function distanceToSquared(v) {

  			var dx = this.x - v.x;
  			var dy = this.y - v.y;
  			var dz = this.z - v.z;

  			return dx * dx + dy * dy + dz * dz;
  		}

  		/**
     * Normalizes this vector.
     *
     * @method normalize
     * @return {Vector3} This vector.
     */

  	}, {
  		key: "normalize",
  		value: function normalize() {

  			return this.divideScalar(this.length());
  		}

  		/**
     * Adopts the min value for each component of this vector and the given one.
     *
     * @method min
     * @param {Vector3} v - A vector.
     * @return {Vector3} This vector.
     */

  	}, {
  		key: "min",
  		value: function min(v) {

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

  	}, {
  		key: "max",
  		value: function max(v) {

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

  	}, {
  		key: "clamp",
  		value: function clamp(min, max) {

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

  	}, {
  		key: "applyMatrix3",
  		value: function applyMatrix3(m) {

  			var x = this.x,
  			    y = this.y,
  			    z = this.z;
  			var e = m.elements;

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

  	}, {
  		key: "applyMatrix4",
  		value: function applyMatrix4(m) {

  			var x = this.x,
  			    y = this.y,
  			    z = this.z;
  			var e = m.elements;

  			this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
  			this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
  			this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

  			return this;
  		}
  	}]);
  	return Vector3;
  }();

  /**
   * An octant.
   *
   * @class Octant
   * @submodule core
   * @constructor
   * @param {Vector3} min - The lower bounds.
   * @param {Vector3} max - The upper bounds.
   */

  var Octant = function () {
  	function Octant() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
  		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();
  		classCallCheck(this, Octant);


  		/**
     * The lower bounds of this octant.
     *
     * @property min
     * @type Vector3
     */

  		this.min = min;

  		/**
     * The upper bounds of the octant.
     *
     * @property max
     * @type Vector3
     */

  		this.max = max;

  		/**
     * The children of this octant.
     *
     * @property children
     * @type Array
     * @default null
     */

  		this.children = null;
  	}

  	/**
    * Computes the center of this octant.
    *
    * @method getCenter
    * @return {Vector3} A new vector that describes the center of this octant.
    */

  	createClass(Octant, [{
  		key: "getCenter",
  		value: function getCenter() {
  			return this.min.clone().add(this.max).multiplyScalar(0.5);
  		}

  		/**
     * Computes the size of this octant.
     *
     * @method getDimensions
     * @return {Vector3} A new vector that describes the size of this octant.
     */

  	}, {
  		key: "getDimensions",
  		value: function getDimensions() {
  			return this.max.clone().sub(this.min);
  		}

  		/**
     * Splits this octant into eight smaller ones.
     *
     * @method split
     * @param {Array} [octants] - A list of octants to recycle.
     */

  	}, {
  		key: "split",
  		value: function split(octants) {

  			var min = this.min;
  			var max = this.max;
  			var mid = this.getCenter();

  			var i = void 0,
  			    j = void 0;
  			var l = 0;
  			var combination = void 0;

  			var halfDimensions = void 0;
  			var v = void 0,
  			    child = void 0,
  			    octant = void 0;

  			if (Array.isArray(octants)) {

  				halfDimensions = this.getDimensions().multiplyScalar(0.5);
  				v = [new Vector3(), new Vector3(), new Vector3()];
  				l = octants.length;
  			}

  			this.children = [];

  			for (i = 0; i < 8; ++i) {

  				combination = PATTERN[i];
  				octant = null;

  				if (l > 0) {

  					v[1].addVectors(min, v[0].fromArray(combination).multiply(halfDimensions));
  					v[2].addVectors(mid, v[0].fromArray(combination).multiply(halfDimensions));

  					// Find an octant that matches the current combination.
  					for (j = 0; j < l; ++j) {

  						child = octants[j];

  						if (child !== null && v[1].equals(child.min) && v[2].equals(child.max)) {

  							octant = child;
  							octants[j] = null;

  							break;
  						}
  					}
  				}

  				this.children.push(octant !== null ? octant : new this.constructor(new Vector3(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), new Vector3(combination[0] === 0 ? mid.x : max.x, combination[1] === 0 ? mid.y : max.y, combination[2] === 0 ? mid.z : max.z)));
  			}
  		}
  	}]);
  	return Octant;
  }();

  /**
   * A binary pattern that describes the standard octant layout:
   *
   * <pre>
   *    3____7
   *  2/___6/|
   *  | 1__|_5
   *  0/___4/
   * </pre>
   *
   * This common layout is crucial for positional assumptions.
   *
   * @property PATTERN
   * @type Array
   * @static
   * @final
   */

  var PATTERN = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];

  /**
   * Describes all possible octant corner connections.
   *
   * @property EDGES
   * @type Array
   * @static
   * @final
   */

  var EDGES = [

  // X-Axis.
  new Uint8Array([0, 4]), new Uint8Array([1, 5]), new Uint8Array([2, 6]), new Uint8Array([3, 7]),

  // Y-Axis.
  new Uint8Array([0, 2]), new Uint8Array([1, 3]), new Uint8Array([4, 6]), new Uint8Array([5, 7]),

  // Z-Axis.
  new Uint8Array([0, 1]), new Uint8Array([2, 3]), new Uint8Array([4, 5]), new Uint8Array([6, 7])];

  /**
   * A cubic octant.
   *
   * @class CubicOctant
   * @submodule core
   * @constructor
   * @param {Vector3} min - The lower bounds.
   * @param {Number} [size=0] - The size of the octant.
   */

  var CubicOctant = function () {
  		function CubicOctant() {
  				var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
  				var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  				classCallCheck(this, CubicOctant);


  				/**
       * The lower bounds of this octant.
       *
       * @property min
       * @type Vector3
       */

  				this.min = min;

  				/**
       * The size of this octant.
       *
       * @property size
       * @type Number
       */

  				this.size = size;

  				/**
       * The children of this octant.
       *
       * @property children
       * @type Array
       * @default null
       */

  				this.children = null;
  		}

  		/**
     * The upper bounds of this octant.
     *
     * @property max
     * @type Vector3
     */

  		createClass(CubicOctant, [{
  				key: "getCenter",


  				/**
       * Computes the center of this octant.
       *
       * @method getCenter
       * @return {Vector3} A new vector that describes the center of this octant.
       */

  				value: function getCenter() {
  						return this.min.clone().addScalar(this.size * 0.5);
  				}

  				/**
       * Returns the size of this octant as a vector.
       *
       * @method getDimensions
       * @return {Vector3} A new vector that describes the size of this octant.
       */

  		}, {
  				key: "getDimensions",
  				value: function getDimensions() {
  						return new Vector3(this.size, this.size, this.size);
  				}

  				/**
       * Splits this octant into eight smaller ones.
       *
       * @method split
       * @param {Array} [octants] - A list of octants to recycle.
       */

  		}, {
  				key: "split",
  				value: function split(octants) {

  						var min = this.min;
  						var mid = this.getCenter();
  						var halfSize = this.size * 0.5;

  						var i = void 0,
  						    j = void 0;
  						var l = 0;
  						var combination = void 0;

  						var v = void 0,
  						    child = void 0,
  						    octant = void 0;

  						if (Array.isArray(octants)) {

  								v = new Vector3();
  								l = octants.length;
  						}

  						this.children = [];

  						for (i = 0; i < 8; ++i) {

  								combination = PATTERN[i];
  								octant = null;

  								if (l > 0) {

  										v.fromArray(combination).multiplyScalar(halfSize).add(min);

  										// Find an octant that matches the current combination.
  										for (j = 0; j < l; ++j) {

  												child = octants[j];

  												if (child !== null && child.size === halfSize && v.equals(child.min)) {

  														octant = child;
  														octants[j] = null;

  														break;
  												}
  										}
  								}

  								this.children.push(octant !== null ? octant : new this.constructor(new Vector3(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), halfSize));
  						}
  				}
  		}, {
  				key: "max",
  				get: function get$$1() {
  						return this.min.clone().addScalar(this.size);
  				}
  		}]);
  		return CubicOctant;
  }();

  /**
   * A bounding box.
   *
   * @class Box3
   * @submodule math
   * @constructor
   * @param {Vector3} [min] - The lower bounds.
   * @param {Vector3} [max] - The upper bounds.
   */

  var Box3 = function () {
  	function Box3() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3(Infinity, Infinity, Infinity);
  		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3(-Infinity, -Infinity, -Infinity);
  		classCallCheck(this, Box3);


  		/**
     * The min bounds.
     *
     * @property min
     * @type Vector3
     */

  		this.min = min;

  		/**
     * The max bounds.
     *
     * @property max
     * @type Vector3
     */

  		this.max = max;
  	}

  	/**
    * Sets the values of this box.
    *
    * @method set
    * @param {Number} min - The min bounds.
    * @param {Number} max - The max bounds.
    * @return {Matrix3} This box.
    */

  	createClass(Box3, [{
  		key: "set",
  		value: function set$$1(min, max) {

  			this.min.copy(min);
  			this.max.copy(max);

  			return this;
  		}

  		/**
     * Copies the values of a given box.
     *
     * @method copy
     * @param {Matrix3} b - A box.
     * @return {Box3} This box.
     */

  	}, {
  		key: "copy",
  		value: function copy(b) {

  			this.min.copy(b.min);
  			this.max.copy(b.max);

  			return this;
  		}

  		/**
     * Clones this matrix.
     *
     * @method clone
     * @return {Matrix3} A clone of this matrix.
     */

  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}

  		/**
     * Expands this box by the given point.
     *
     * @method expandByPoint
     * @param {Matrix3} p - A point.
     * @return {Box3} This box.
     */

  	}, {
  		key: "expandByPoint",
  		value: function expandByPoint(p) {

  			this.min.min(p);
  			this.max.max(p);

  			return this;
  		}

  		/**
     * Expands this box by combining it with the given one.
     *
     * @method union
     * @param {Box3} b - A box.
     * @return {Box3} This box.
     */

  	}, {
  		key: "union",
  		value: function union(b) {

  			this.min.min(b.min);
  			this.max.max(b.max);

  			return this;
  		}

  		/**
     * Defines this box by the given points.
     *
     * @method setFromPoints
     * @param {Array} points - The points.
     * @return {Box3} This box.
     */

  	}, {
  		key: "setFromPoints",
  		value: function setFromPoints(points) {

  			var i = void 0,
  			    l = void 0;

  			for (i = 0, l = points.length; i < l; ++i) {

  				this.expandByPoint(points[i]);
  			}

  			return this;
  		}

  		/**
     * Defines this box by the given center and size.
     *
     * @method setFromCenterAndSize
     * @param {Vector3} center - The center.
     * @param {Number} size - The size.
     * @return {Box3} This box.
     */

  	}, {
  		key: "setFromCenterAndSize",
  		value: function setFromCenterAndSize(center, size) {

  			var halfSize = size.clone().multiplyScalar(0.5);

  			this.min.copy(center).sub(halfSize);
  			this.max.copy(center).add(halfSize);

  			return this;
  		}

  		/**
     * Checks if this box intersects with the given one.
     *
     * @method intersectsBox
     * @param {Matrix3} box - A box.
     * @return {Boolean} Whether the boxes intersect.
     */

  	}, {
  		key: "intersectsBox",
  		value: function intersectsBox(box) {

  			return !(box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y || box.max.z < this.min.z || box.min.z > this.max.z);
  		}
  	}]);
  	return Box3;
  }();

  /**
   * A basic iterator result.
   *
   * The next method of an iterator always has to return an object with
   * appropriate properties including done and value.
   *
   * @class IteratorResult
   * @constructor
   * @param {Vector3} [value=null] - A value.
   * @param {Vector3} [done=false] - Whether this result is past the end of the iterated sequence.
   */

  var IteratorResult = function () {
  	function IteratorResult() {
  		var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  		var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  		classCallCheck(this, IteratorResult);


  		/**
     * An arbitrary value returned by the iterator.
     *
     * @property value
     * @type Object
     * @default null
     */

  		this.value = value;

  		/**
     * Whether this result is past the end of the iterated sequence.
     *
     * @property done
     * @type Boolean
     * @default false
     */

  		this.done = done;
  	}

  	/**
    * Resets this iterator result.
    *
    * @method reset
    */

  	createClass(IteratorResult, [{
  		key: "reset",
  		value: function reset() {

  			this.value = null;
  			this.done = false;
  		}
  	}]);
  	return IteratorResult;
  }();

  /**
   * A computation helper.
   *
   * @property BOX3
   * @type Box3
   * @private
   * @static
   * @final
   */

  var BOX3$1 = new Box3();

  /**
   * An octree iterator.
   *
   * @class OctreeIterator
   * @submodule core
   * @implements Iterator
   * @constructor
   * @param {Octree} octree - An octree.
   * @param {Frustum|Box3} [region] - A cull region.
   */

  var OctreeIterator = function () {
  		function OctreeIterator(octree) {
  				var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  				classCallCheck(this, OctreeIterator);


  				/**
       * The octree.
       *
       * @property octree
       * @type Octree
       * @private
       */

  				this.octree = octree;

  				/**
       * A region used for octree culling.
       *
       * @property region
       * @type Frustum|Box3
       */

  				this.region = region;

  				/**
       * Whether this iterator should respect the cull region.
       *
       * @property cull
       * @type Boolean
       * @default false
       */

  				this.cull = region !== null;

  				/**
       * An iterator result.
       *
       * @property result
       * @type IteratorResult
       * @private
       */

  				this.result = new IteratorResult();

  				/**
       * An octant trace.
       *
       * @property trace
       * @type Array
       * @private
       */

  				this.trace = null;

  				/**
       * Iteration indices.
       *
       * @property indices
       * @type Array
       * @private
       */

  				this.indices = null;

  				this.reset();
  		}

  		/**
     * Resets this iterator.
     *
     * @method reset
     * @chainable
     * @return {OctreeIterator} This iterator.
     */

  		createClass(OctreeIterator, [{
  				key: "reset",
  				value: function reset() {

  						var root = this.octree.root;

  						this.trace = [];
  						this.indices = [];

  						if (root !== null) {

  								BOX3$1.min = root.min;
  								BOX3$1.max = root.max;

  								if (!this.cull || this.region.intersectsBox(BOX3$1)) {

  										this.trace.push(root);
  										this.indices.push(0);
  								}
  						}

  						this.result.reset();

  						return this;
  				}

  				/**
       * Iterates over the volume chunks.
       *
       * @method next
       * @return {IteratorResult} The next voxel.
       */

  		}, {
  				key: "next",
  				value: function next() {

  						var cull = this.cull;
  						var region = this.region;
  						var indices = this.indices;
  						var trace = this.trace;

  						var octant = null;
  						var depth = trace.length - 1;

  						var index = void 0,
  						    children = void 0,
  						    child = void 0;

  						while (octant === null && depth >= 0) {

  								index = indices[depth];
  								children = trace[depth].children;

  								++indices[depth];

  								if (index < 8) {

  										if (children !== null) {

  												child = children[index];

  												if (cull) {

  														BOX3$1.min = child.min;
  														BOX3$1.max = child.max;

  														if (!region.intersectsBox(BOX3$1)) {

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
  						this.result.done = octant === null;

  						return this.result;
  				}

  				/**
       * Called when this iterator will no longer be run to completion.
       *
       * @method return
       * @param {Object} value - An interator result value.
       * @return {IteratorResult} - A premature completion result.
       */

  		}, {
  				key: "return",
  				value: function _return(value) {

  						this.result.value = value;
  						this.result.done = true;

  						return this.result;
  				}

  				/**
       * Returns this iterator.
       *
       * @method Symbol.iterator
       * @return {VoxelIterator} An iterator.
       */

  		}, {
  				key: Symbol.iterator,
  				value: function value() {

  						return this;
  				}
  		}]);
  		return OctreeIterator;
  }();

  /**
   * Contains bytes used for bitwise operations. The last byte is used to store
   * raycasting flags.
   *
   * @property flags
   * @type Uint8Array
   * @private
   * @static
   * @final
   */

  var flags = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 0]);

  /**
   * A lookup-table containing octant ids. Used to determine the exit plane from
   * an octant.
   *
   * @property octantTable
   * @type Array
   * @private
   * @static
   * @final
   */

  var octantTable = [new Uint8Array([4, 2, 1]), new Uint8Array([5, 3, 8]), new Uint8Array([6, 8, 3]), new Uint8Array([7, 8, 8]), new Uint8Array([8, 6, 5]), new Uint8Array([8, 7, 8]), new Uint8Array([8, 8, 7]), new Uint8Array([8, 8, 8])];

  /**
   * Finds the entry plane of the first octant that a ray travels through.
   *
   * Determining the first octant requires knowing which of the t0's is the
   * largest. The tm's of the other axes must also be compared against that
   * largest t0.
   *
   * @method findEntryOctant
   * @private
   * @static
   * @param {Number} tx0 - Ray projection parameter.
   * @param {Number} ty0 - Ray projection parameter.
   * @param {Number} tz0 - Ray projection parameter.
   * @param {Number} txm - Ray projection parameter mean.
   * @param {Number} tym - Ray projection parameter mean.
   * @param {Number} tzm - Ray projection parameter mean.
   * @return {Number} The index of the first octant that the ray travels through.
   */

  function findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {

  	var entry = 0;

  	// Find the entry plane.
  	if (tx0 > ty0 && tx0 > tz0) {

  		// YZ-plane.
  		if (tym < tx0) {
  			entry = entry | 2;
  		}
  		if (tzm < tx0) {
  			entry = entry | 1;
  		}
  	} else if (ty0 > tz0) {

  		// XZ-plane.
  		if (txm < ty0) {
  			entry = entry | 4;
  		}
  		if (tzm < ty0) {
  			entry = entry | 1;
  		}
  	} else {

  		// XY-plane.
  		if (txm < tz0) {
  			entry = entry | 4;
  		}
  		if (tym < tz0) {
  			entry = entry | 2;
  		}
  	}

  	return entry;
  }

  /**
   * Finds the next octant that intersects with the ray based on the exit plane of
   * the current one.
   *
   * @method findNextOctant
   * @private
   * @static
   * @param {Number} currentOctant - The index of the current octant.
   * @param {Number} tx1 - Ray projection parameter.
   * @param {Number} ty1 - Ray projection parameter.
   * @param {Number} tz1 - Ray projection parameter.
   * @return {Number} The index of the next octant that the ray travels through.
   */

  function findNextOctant(currentOctant, tx1, ty1, tz1) {

  	var min = void 0;
  	var exit = 0;

  	// Find the exit plane.
  	if (tx1 < ty1) {

  		min = tx1;
  		exit = 0; // YZ-plane.
  	} else {

  		min = ty1;
  		exit = 1; // XZ-plane.
  	}

  	if (tz1 < min) {

  		exit = 2; // XY-plane.
  	}

  	return octantTable[currentOctant][exit];
  }

  /**
   * Finds all octants that intersect with the given ray.
   *
   * @method raycastOctant
   * @private
   * @static
   * @param {Octant} octant - The current octant.
   * @param {Number} tx0 - Ray projection parameter. Initial tx0 = (minX - rayOriginX) / rayDirectionX.
   * @param {Number} ty0 - Ray projection parameter. Initial ty0 = (minY - rayOriginY) / rayDirectionY.
   * @param {Number} tz0 - Ray projection parameter. Initial tz0 = (minZ - rayOriginZ) / rayDirectionZ.
   * @param {Number} tx1 - Ray projection parameter. Initial tx1 = (maxX - rayOriginX) / rayDirectionX.
   * @param {Number} ty1 - Ray projection parameter. Initial ty1 = (maxY - rayOriginY) / rayDirectionY.
   * @param {Number} tz1 - Ray projection parameter. Initial tz1 = (maxZ - rayOriginZ) / rayDirectionZ.
   * @param {Raycaster} raycaster - The raycaster.
   * @param {Array} intersects - An array to be filled with the intersecting octants.
   */

  function raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects) {

  	var children = octant.children;

  	var currentOctant = void 0;
  	var txm = void 0,
  	    tym = void 0,
  	    tzm = void 0;

  	if (tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

  		if (children === null) {

  			// Leaf.
  			intersects.push(octant);
  		} else {

  			// Compute means.
  			txm = 0.5 * (tx0 + tx1);
  			tym = 0.5 * (ty0 + ty1);
  			tzm = 0.5 * (tz0 + tz1);

  			currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

  			do {

  				/* The possibilities for the next node are passed in the same respective
       * order as the t-values. Hence, if the first value is found to be the
       * greatest, the fourth one will be returned. If the second value is the
       * greatest, the fifth one will be returned, etc.
       */

  				switch (currentOctant) {

  					case 0:
  						raycastOctant(children[flags[8]], tx0, ty0, tz0, txm, tym, tzm, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, txm, tym, tzm);
  						break;

  					case 1:
  						raycastOctant(children[flags[8] ^ flags[1]], tx0, ty0, tzm, txm, tym, tz1, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, txm, tym, tz1);
  						break;

  					case 2:
  						raycastOctant(children[flags[8] ^ flags[2]], tx0, tym, tz0, txm, ty1, tzm, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, txm, ty1, tzm);
  						break;

  					case 3:
  						raycastOctant(children[flags[8] ^ flags[3]], tx0, tym, tzm, txm, ty1, tz1, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, txm, ty1, tz1);
  						break;

  					case 4:
  						raycastOctant(children[flags[8] ^ flags[4]], txm, ty0, tz0, tx1, tym, tzm, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, tx1, tym, tzm);
  						break;

  					case 5:
  						raycastOctant(children[flags[8] ^ flags[5]], txm, ty0, tzm, tx1, tym, tz1, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, tx1, tym, tz1);
  						break;

  					case 6:
  						raycastOctant(children[flags[8] ^ flags[6]], txm, tym, tz0, tx1, ty1, tzm, raycaster, intersects);
  						currentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);
  						break;

  					case 7:
  						raycastOctant(children[flags[8] ^ flags[7]], txm, tym, tzm, tx1, ty1, tz1, raycaster, intersects);
  						// Far top right octant. No other octants can be reached from here.
  						currentOctant = 8;
  						break;

  				}
  			} while (currentOctant < 8);
  		}
  	}
  }

  /**
   * An octree raycaster.
   *
   * Based on:
   *  "An Efficient Parametric Algorithm for Octree Traversal"
   *  by J. Revelles et al. (2000).
   *
   * @class OctreeRaycaster
   * @submodule core
   * @static
   */

  var OctreeRaycaster = function () {
  	function OctreeRaycaster() {
  		classCallCheck(this, OctreeRaycaster);
  	}

  	createClass(OctreeRaycaster, null, [{
  		key: "intersectOctree",


  		/**
     * Finds the octants that intersect with the given ray. The intersecting
     * octants are sorted by distance, closest first.
     *
     * @method intersectOctree
     * @static
     * @param {Octree} octree - An octree.
     * @param {Raycaster} raycaster - A raycaster.
     * @param {Array} intersects - A list to be filled with intersecting octants.
     */

  		value: function intersectOctree(octree, raycaster, intersects) {

  			var dimensions = octree.getDimensions();
  			var halfDimensions = dimensions.clone().multiplyScalar(0.5);

  			// Translate the octree extents to the center of the octree.
  			var min = octree.min.clone().sub(octree.min);
  			var max = octree.max.clone().sub(octree.min);

  			var direction = raycaster.ray.direction.clone();
  			var origin = raycaster.ray.origin.clone();

  			// Translate the ray to the center of the octree.
  			origin.sub(octree.getCenter()).add(halfDimensions);

  			var invDirX = void 0,
  			    invDirY = void 0,
  			    invDirZ = void 0;
  			var tx0 = void 0,
  			    tx1 = void 0,
  			    ty0 = void 0,
  			    ty1 = void 0,
  			    tz0 = void 0,
  			    tz1 = void 0;

  			// Reset the last byte.
  			flags[8] = flags[0];

  			// Handle rays with negative directions.
  			if (direction.x < 0.0) {

  				origin.x = dimensions.x - origin.x;
  				direction.x = -direction.x;
  				flags[8] |= flags[4];
  			}

  			if (direction.y < 0.0) {

  				origin.y = dimensions.y - origin.y;
  				direction.y = -direction.y;
  				flags[8] |= flags[2];
  			}

  			if (direction.z < 0.0) {

  				origin.z = dimensions.z - origin.z;
  				direction.z = -direction.z;
  				flags[8] |= flags[1];
  			}

  			// Improve IEEE double stability.
  			invDirX = 1.0 / direction.x;
  			invDirY = 1.0 / direction.y;
  			invDirZ = 1.0 / direction.z;

  			// Project the ray to the root's boundaries.
  			tx0 = (min.x - origin.x) * invDirX;
  			tx1 = (max.x - origin.x) * invDirX;
  			ty0 = (min.y - origin.y) * invDirY;
  			ty1 = (max.y - origin.y) * invDirY;
  			tz0 = (min.z - origin.z) * invDirZ;
  			tz1 = (max.z - origin.z) * invDirZ;

  			// Check if the ray hits the octree.
  			if (Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1)) {

  				raycastOctant(octree.root, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects);
  			}
  		}
  	}]);
  	return OctreeRaycaster;
  }();

  /**
   * A computation helper.
   *
   * @property BOX3
   * @type Box3
   * @private
   * @static
   * @final
   */

  var BOX3 = new Box3();

  /**
   * Recursively calculates the depth of the given octree.
   *
   * @method getDepth
   * @private
   * @static
   * @param {Octant} octant - An octant.
   * @return {Number} The depth.
   */

  function _getDepth(octant) {

  	var children = octant.children;

  	var result = 0;
  	var i = void 0,
  	    l = void 0,
  	    d = void 0;

  	if (children !== null) {

  		for (i = 0, l = children.length; i < l; ++i) {

  			d = 1 + _getDepth(children[i]);

  			if (d > result) {

  				result = d;
  			}
  		}
  	}

  	return result;
  }

  /**
   * Recursively collects octants that lie inside the specified region.
   *
   * @method cull
   * @private
   * @static
   * @param {Octant} octant - An octant.
   * @param {Frustum|Box3} region - A region.
   * @param {Array} result - A list to be filled with octants that intersect with the region.
   */

  function _cull(octant, region, result) {

  	var children = octant.children;

  	var i = void 0,
  	    l = void 0;

  	BOX3.min = octant.min;
  	BOX3.max = octant.max;

  	if (region.intersectsBox(BOX3)) {

  		if (children !== null) {

  			for (i = 0, l = children.length; i < l; ++i) {

  				_cull(children[i], region, result);
  			}
  		} else {

  			result.push(octant);
  		}
  	}
  }

  /**
   * Recursively fetches all octants with the specified depth level.
   *
   * @method findOctantsByLevel
   * @private
   * @static
   * @param {Octant} octant - An octant.
   * @param {Number} level - The target depth level.
   * @param {Number} depth - The current depth level.
   * @param {Array} result - A list to be filled with the identified octants.
   */

  function _findOctantsByLevel(octant, level, depth, result) {

  	var children = octant.children;

  	var i = void 0,
  	    l = void 0;

  	if (depth === level) {

  		result.push(octant);
  	} else if (children !== null) {

  		++depth;

  		for (i = 0, l = children.length; i < l; ++i) {

  			_findOctantsByLevel(children[i], level, depth, result);
  		}
  	}
  }

  /**
   * An octree that subdivides space for fast spatial searches.
   *
   * @class Octree
   * @submodule core
   * @implements Iterable
   * @constructor
   * @param {Vector3} [min] - The lower bounds of the tree.
   * @param {Vector3} [max] - The upper bounds of the tree.
   */

  var Octree = function () {
  	function Octree(min, max) {
  		classCallCheck(this, Octree);


  		/**
     * The root octant.
     *
     * @property root
     * @type Octant
     * @default null
     */

  		this.root = min !== undefined && max !== undefined ? new Octant(min, max) : null;
  	}

  	/**
    * The lower bounds of the root octant.
    *
    * @property min
    * @type Vector3
    */

  	createClass(Octree, [{
  		key: "getCenter",


  		/**
     * Calculates the center of this octree.
     *
     * @method getCenter
     * @return {Vector3} A new vector that describes the center of this octree.
     */

  		value: function getCenter() {
  			return this.root.getCenter();
  		}

  		/**
     * Calculates the size of this octree.
     *
     * @method getDimensions
     * @return {Vector3} A new vector that describes the size of this octree.
     */

  	}, {
  		key: "getDimensions",
  		value: function getDimensions() {
  			return this.root.getDimensions();
  		}

  		/**
     * Calculates the current depth of this octree.
     *
     * @method getDepth
     * @return {Number} The depth.
     */

  	}, {
  		key: "getDepth",
  		value: function getDepth() {

  			return _getDepth(this.root);
  		}

  		/**
     * Recursively collects octants that intersect with the specified region.
     *
     * @method cull
     * @param {Frustum|Box3} region - A region.
     * @return {Array} The octants.
     */

  	}, {
  		key: "cull",
  		value: function cull(region) {

  			var result = [];

  			_cull(this.root, region, result);

  			return result;
  		}

  		/**
     * Fetches all octants with the specified depth level.
     *
     * @method findOctantsByLevel
     * @param {Number} level - The depth level.
     * @return {Array} The octants.
     */

  	}, {
  		key: "findOctantsByLevel",
  		value: function findOctantsByLevel(level) {

  			var result = [];

  			_findOctantsByLevel(this.root, level, 0, result);

  			return result;
  		}

  		/**
     * Finds the octants that intersect with the given ray. The intersecting
     * octants are sorted by distance, closest first.
     *
     * @method raycast
     * @param {Raycaster} raycaster - A raycaster.
     * @param {Array} [intersects] - A list to be filled with intersecting octants.
     * @return {Array} The intersecting octants.
     */

  	}, {
  		key: "raycast",
  		value: function raycast(raycaster) {
  			var intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


  			OctreeRaycaster.intersectOctree(this, raycaster, intersects);

  			return intersects;
  		}

  		/**
     * Returns an iterator that traverses the octree and returns leaf nodes.
     *
     * When a cull region is provided, the iterator will only return leaves that
     * intersect with that region.
     *
     * @method leaves
     * @param {Frustum|Box3} [region] - A cull region.
     * @return {OctreeIterator} An iterator.
     */

  	}, {
  		key: "leaves",
  		value: function leaves(region) {

  			return new OctreeIterator(this, region);
  		}

  		/**
     * Returns an iterator that traverses the octree and returns all leaf nodes.
     *
     * @method Symbol.iterator
     * @return {OctreeIterator} An iterator.
     */

  	}, {
  		key: Symbol.iterator,
  		value: function value() {

  			return new OctreeIterator(this);
  		}
  	}, {
  		key: "min",
  		get: function get$$1() {
  			return this.root.min;
  		}

  		/**
     * The upper bounds of the root octant.
     *
     * @property max
     * @type Vector3
     */

  	}, {
  		key: "max",
  		get: function get$$1() {
  			return this.root.max;
  		}

  		/**
     * The children of the root octant.
     *
     * @property children
     * @type Array
     */

  	}, {
  		key: "children",
  		get: function get$$1() {
  			return this.root.children;
  		}
  	}]);
  	return Octree;
  }();

  /**
   * Core components.
   *
   * @module sparse-octree
   * @submodule core
   */

  /**
   * An octree helper.
   *
   * @class OctreeHelper
   * @submodule helpers
   * @constructor
   * @extends Object3D
   * @param {Octree} [octree=null] - The octree to visualise.
   */

  var OctreeHelper = function (_Object3D) {
  		inherits(OctreeHelper, _Object3D);

  		function OctreeHelper() {
  				var octree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  				classCallCheck(this, OctreeHelper);

  				var _this = possibleConstructorReturn(this, (OctreeHelper.__proto__ || Object.getPrototypeOf(OctreeHelper)).call(this));

  				_this.name = "OctreeHelper";

  				/**
       * The octree.
       *
       * @property octree
       * @type Octree
       */

  				_this.octree = octree;

  				_this.update();

  				return _this;
  		}

  		/**
     * Creates octant geometry.
     *
     * @method createLineSegments
     * @private
     * @param {Array} octants - The octants.
     */

  		createClass(OctreeHelper, [{
  				key: "createLineSegments",
  				value: function createLineSegments(octants) {

  						var maxOctants = Math.pow(2, 16) / 8 - 1;
  						var group = new three.Object3D();

  						var material = new three.LineBasicMaterial({
  								color: 0xffffff * Math.random()
  						});

  						var octantCount = octants.length;
  						var vertexCount = void 0;
  						var length = void 0;

  						var indices = void 0,
  						    positions = void 0;
  						var octant = void 0,
  						    min = void 0,
  						    max = void 0;
  						var geometry = void 0;

  						var i = void 0,
  						    j = void 0,
  						    c = void 0,
  						    d = void 0,
  						    n = void 0;
  						var corner = void 0,
  						    edge = void 0;

  						// Create geometry in multiple runs to limit the amount of vertices.
  						for (i = 0, length = 0, n = Math.ceil(octantCount / maxOctants); n > 0; --n) {

  								length += octantCount < maxOctants ? octantCount : maxOctants;
  								octantCount -= maxOctants;

  								vertexCount = length * 8;
  								indices = new Uint16Array(vertexCount * 3);
  								positions = new Float32Array(vertexCount * 3);

  								// Don't reset i, continue where a previous run left off.
  								for (c = 0, d = 0; i < length; ++i) {

  										octant = octants[i];
  										min = octant.min;
  										max = octant.max;

  										for (j = 0; j < 12; ++j) {

  												edge = EDGES[j];

  												indices[d++] = c + edge[0];
  												indices[d++] = c + edge[1];
  										}

  										for (j = 0; j < 8; ++j, ++c) {

  												corner = PATTERN[j];

  												positions[c * 3] = corner[0] === 0 ? min.x : max.x;
  												positions[c * 3 + 1] = corner[1] === 0 ? min.y : max.y;
  												positions[c * 3 + 2] = corner[2] === 0 ? min.z : max.z;
  										}
  								}

  								geometry = new three.BufferGeometry();
  								geometry.setIndex(new three.BufferAttribute(indices, 1));
  								geometry.addAttribute("position", new three.BufferAttribute(positions, 3));

  								group.add(new three.LineSegments(geometry, material));
  						}

  						this.add(group);
  				}

  				/**
       * Updates the helper geometry.
       *
       * @method update
       */

  		}, {
  				key: "update",
  				value: function update() {

  						var depth = this.octree !== null ? this.octree.getDepth() : -1;

  						var level = 0;

  						// Remove existing geometry.
  						this.dispose();

  						while (level <= depth) {

  								this.createLineSegments(this.octree.findOctantsByLevel(level));

  								++level;
  						}
  				}

  				/**
       * Destroys this helper.
       *
       * @method dispose
       */

  		}, {
  				key: "dispose",
  				value: function dispose() {

  						var groups = this.children;

  						var group = void 0,
  						    children = void 0;
  						var i = void 0,
  						    j = void 0,
  						    il = void 0,
  						    jl = void 0;

  						for (i = 0, il = groups.length; i < il; ++i) {

  								group = groups[i];
  								children = group.children;

  								for (j = 0, jl = children.length; j < jl; ++j) {

  										children[j].geometry.dispose();
  										children[j].material.dispose();
  								}

  								while (children.length > 0) {

  										group.remove(children[0]);
  								}
  						}

  						while (groups.length > 0) {

  								this.remove(groups[0]);
  						}
  				}
  		}]);
  		return OctreeHelper;
  }(three.Object3D);

  /**
   * A collection of helpers.
   *
   * @module sparse-octree
   * @submodule helpers
   */

  /**
   * Math components.
   *
   * @module sparse-octree
   * @submodule math
   */

  /**
   * An octant that maintains points.
   *
   * @class PointOctant
   * @submodule points
   * @extends Octant
   * @constructor
   * @param {Vector3} min - The lower bounds.
   * @param {Vector3} max - The upper bounds.
   */

  var PointOctant = function (_Octant) {
  		inherits(PointOctant, _Octant);

  		function PointOctant(min, max) {
  				classCallCheck(this, PointOctant);

  				/**
       * The points that are inside this octant.
       *
       * @property points
       * @type Array
       */

  				var _this = possibleConstructorReturn(this, (PointOctant.__proto__ || Object.getPrototypeOf(PointOctant)).call(this, min, max));

  				_this.points = null;

  				/**
       * Point data.
       *
       * @property data
       * @type Array
       */

  				_this.data = null;

  				return _this;
  		}

  		/**
     * Computes the distance squared from this octant to the given point.
     *
     * @method distanceToSquared
     * @param {Vector3} p - A point.
     * @return {Number} The distance squared.
     */

  		createClass(PointOctant, [{
  				key: "distanceToSquared",
  				value: function distanceToSquared(p) {

  						var clampedPoint = p.clone().clamp(this.min, this.max);

  						return clampedPoint.sub(p).lengthSq();
  				}

  				/**
       * Computes the distance squared from the center of this octant to the given
       * point.
       *
       * @method distanceToCenterSquared
       * @param {Vector3} p - A point.
       * @return {Number} The distance squared.
       */

  		}, {
  				key: "distanceToCenterSquared",
  				value: function distanceToCenterSquared(p) {

  						var center = this.getCenter();

  						var dx = p.x - center.x;
  						var dy = p.y - center.x;
  						var dz = p.z - center.z;

  						return dx * dx + dy * dy + dz * dz;
  				}

  				/**
       * Checks if the given point lies inside this octant's boundaries.
       *
       * This method can also be used to check if this octant intersects a sphere by
       * providing a radius as bias.
       *
       * @method contains
       * @param {Vector3} p - A point.
       * @param {Number} bias - A padding that extends the boundaries temporarily.
       * @return {Boolean} Whether the given point lies inside this octant.
       */

  		}, {
  				key: "contains",
  				value: function contains(p, bias) {

  						var min = this.min;
  						var max = this.max;

  						return p.x >= min.x - bias && p.y >= min.y - bias && p.z >= min.z - bias && p.x <= max.x + bias && p.y <= max.y + bias && p.z <= max.z + bias;
  				}

  				/**
       * Redistributes existing points to child octants.
       *
       * @method redistribute
       * @param {Number} bias - A proximity threshold.
       */

  		}, {
  				key: "redistribute",
  				value: function redistribute(bias) {

  						var children = this.children;
  						var points = this.points;
  						var data = this.data;

  						var i = void 0,
  						    l = void 0;
  						var child = void 0,
  						    point = void 0,
  						    entry = void 0;

  						if (children !== null) {

  								while (points.length > 0) {

  										point = points.pop();
  										entry = data.pop();

  										for (i = 0, l = children.length; i < l; ++i) {

  												child = children[i];

  												if (child.contains(point, bias)) {

  														if (child.points === null) {

  																child.points = [];
  																child.data = [];
  														}

  														child.points.push(point);
  														child.data.push(entry);

  														break;
  												}
  										}
  								}
  						}

  						this.points = null;
  						this.data = null;
  				}

  				/**
       * Gathers all points from the children. The children are expected to be leaf
       * octants and will be dropped afterwards.
       *
       * @method merge
       * @private
       */

  		}, {
  				key: "merge",
  				value: function merge() {

  						var children = this.children;

  						var i = void 0,
  						    l = void 0;
  						var child = void 0;

  						if (children !== null) {

  								this.points = [];
  								this.data = [];

  								for (i = 0, l = children.length; i < l; ++i) {

  										child = children[i];

  										if (child.points !== null) {
  												var _points, _data;

  												(_points = this.points).push.apply(_points, toConsumableArray(child.points));
  												(_data = this.data).push.apply(_data, toConsumableArray(child.data));
  										}
  								}

  								this.children = null;
  						}
  				}
  		}]);
  		return PointOctant;
  }(Octant);

  /**
   * Recursively counts how many points are in the given octree.
   *
   * @method countPoints
   * @private
   * @static
   * @param {Octant} octant - An octant.
   * @return {Number} The amount of points.
   */

  function _countPoints(octant) {

  	var children = octant.children;

  	var result = 0;
  	var i = void 0,
  	    l = void 0;

  	if (children !== null) {

  		for (i = 0, l = children.length; i < l; ++i) {

  			result += _countPoints(children[i]);
  		}
  	} else if (octant.points !== null) {

  		result = octant.points.length;
  	}

  	return result;
  }

  /**
   * Recursively adds a point to the octree.
   *
   * @method add
   * @param {Octant} octant - An octant.
   * @param {Vector3} p - A point.
   * @param {Object} data - An object that the point represents.
   * @param {Number} depth - The current depth.
   * @param {Number} bias - A threshold for proximity checks.
   * @param {Number} maxPoints - Number of distinct points per octant before it splits up.
   * @param {Number} maxDepth - The maximum tree depth level, starting at 0.
   */

  function _add(octant, p, data, depth, bias, maxPoints, maxDepth) {

  	var children = octant.children;
  	var exists = false;
  	var done = false;
  	var i = void 0,
  	    l = void 0;

  	if (octant.contains(p, bias)) {

  		if (children === null) {

  			if (octant.points === null) {

  				octant.points = [];
  				octant.data = [];
  			} else {

  				for (i = 0, l = octant.points.length; !exists && i < l; ++i) {

  					exists = octant.points[i].equals(p);
  				}
  			}

  			if (exists) {

  				octant.data[i - 1] = data;

  				done = true;
  			} else if (octant.points.length < maxPoints || depth === maxDepth) {

  				octant.points.push(p.clone());
  				octant.data.push(data);

  				done = true;
  			} else {

  				octant.split();
  				octant.redistribute(bias);
  				children = octant.children;
  			}
  		}

  		if (children !== null) {

  			++depth;

  			for (i = 0, l = children.length; !done && i < l; ++i) {

  				done = _add(children[i], p, data, depth, bias, maxPoints, maxDepth);
  			}
  		}
  	}

  	return done;
  }

  /**
   * Recursively finds a point in the octree and removes it.
   *
   * @method remove
   * @param {Octant} octant - An octant.
   * @param {Octant} parent - The parent of the octant.
   * @param {Vector3} p - A point.
   * @param {Number} bias - A threshold for proximity checks.
   * @param {Number} maxPoints - Number of distinct points per octant before it splits up.
   */

  function _remove(octant, parent, p, bias, maxPoints) {

  	var children = octant.children;

  	var done = false;

  	var i = void 0,
  	    l = void 0;
  	var points = void 0,
  	    data = void 0,
  	    last = void 0;

  	if (octant.contains(p, bias)) {

  		if (children !== null) {

  			for (i = 0, l = children.length; !done && i < l; ++i) {

  				done = _remove(children[i], octant, p, bias, maxPoints);
  			}
  		} else if (octant.points !== null) {

  			points = octant.points;
  			data = octant.data;

  			for (i = 0, l = points.length; !done && i < l; ++i) {

  				if (points[i].equals(p)) {

  					last = l - 1;

  					// If the point is NOT the last one in the array:
  					if (i < last) {

  						// Overwrite with the last point and data entry.
  						points[i] = points[last];
  						data[i] = data[last];
  					}

  					// Drop the last entry.
  					points.pop();
  					data.pop();

  					if (parent !== null && _countPoints(parent) <= maxPoints) {

  						parent.merge();
  					}

  					done = true;
  				}
  			}
  		}
  	}

  	return done;
  }

  /**
   * Recursively finds a point in the octree and fetches the associated data.
   *
   * @method fetch
   * @param {Octant} octant - An octant.
   * @param {Vector3} p - A point.
   * @param {Number} bias - A threshold for proximity checks.
   * @param {Number} biasSquared - The threshold squared.
   * @return {Object} The data entry that is associated with the given point or null if it doesn't exist.
   */

  function _fetch(octant, p, bias, biasSquared) {

  	var children = octant.children;

  	var result = null;

  	var i = void 0,
  	    l = void 0;
  	var points = void 0;

  	if (octant.contains(p, bias)) {

  		if (children !== null) {

  			for (i = 0, l = children.length; result === null && i < l; ++i) {

  				result = _fetch(children[i], p, bias, biasSquared);
  			}
  		} else {

  			points = octant.points;

  			for (i = 0, l = points.length; result === null && i < l; ++i) {

  				if (p.distanceToSquared(points[i]) <= biasSquared) {

  					result = octant.data[i];
  				}
  			}
  		}
  	}

  	return result;
  }

  /**
   * Recursively finds the closest point to the given one.
   *
   * @method findNearestPoint
   * @private
   * @static
   * @param {Octant} octant - An octant.
   * @param {Vector3} p - The point.
   * @param {Number} maxDistance - The maximum distance.
   * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
   * @return {Object} An object representing the nearest point or null if there is none. The object has a point and a data property.
   */

  function _findNearestPoint(octant, p, maxDistance, skipSelf) {

  	var points = octant.points;
  	var children = octant.children;

  	var result = null;
  	var bestDist = maxDistance;

  	var i = void 0,
  	    l = void 0;
  	var point = void 0,
  	    distSq = void 0;

  	var sortedChildren = void 0;
  	var child = void 0,
  	    childResult = void 0;

  	if (children !== null) {

  		// Sort the children.
  		sortedChildren = children.map(function (child) {

  			// Precompute distances.
  			return {
  				octant: child,
  				distance: child.distanceToCenterSquared(p)
  			};
  		}).sort(function (a, b) {

  			// Smallest distance to p first, ASC.
  			return a.distance - b.distance;
  		});

  		// Traverse from closest to furthest.
  		for (i = 0, l = sortedChildren.length; i < l; ++i) {

  			// Unpack octant.
  			child = sortedChildren[i].octant;

  			if (child.contains(p, bestDist)) {

  				childResult = _findNearestPoint(child, p, bestDist, skipSelf);

  				if (childResult !== null) {

  					distSq = childResult.point.distanceToSquared(p);

  					if ((!skipSelf || distSq > 0.0) && distSq < bestDist) {

  						bestDist = distSq;
  						result = childResult;
  					}
  				}
  			}
  		}
  	} else if (points !== null) {

  		for (i = 0, l = points.length; i < l; ++i) {

  			point = points[i];
  			distSq = p.distanceToSquared(point);

  			if ((!skipSelf || distSq > 0.0) && distSq < bestDist) {

  				bestDist = distSq;

  				result = {
  					point: point.clone(),
  					data: octant.data[i]
  				};
  			}
  		}
  	}

  	return result;
  }

  /**
   * Recursively finds points that are inside the specified radius around a given
   * position.
   *
   * @method findPoints
   * @private
   * @static
   * @param {Octant} octant - An octant.
   * @param {Vector3} p - A position.
   * @param {Number} r - A radius.
   * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
   * @param {Array} result - An array to be filled with objects, each containing a point and a data property.
   */

  function _findPoints(octant, p, r, skipSelf, result) {

  	var points = octant.points;
  	var children = octant.children;
  	var rSq = r * r;

  	var i = void 0,
  	    l = void 0;

  	var point = void 0,
  	    distSq = void 0;
  	var child = void 0;

  	if (children !== null) {

  		for (i = 0, l = children.length; i < l; ++i) {

  			child = children[i];

  			if (child.contains(p, r)) {

  				_findPoints(child, p, r, skipSelf, result);
  			}
  		}
  	} else if (points !== null) {

  		for (i = 0, l = points.length; i < l; ++i) {

  			point = points[i];
  			distSq = p.distanceToSquared(point);

  			if ((!skipSelf || distSq > 0.0) && distSq <= rSq) {

  				result.push({
  					point: point.clone(),
  					data: octant.data[i]
  				});
  			}
  		}
  	}
  }

  /**
   * An octree that manages points.
   *
   * @class PointOctree
   * @submodule points
   * @extends Octree
   * @constructor
   * @param {Vector3} min - The lower bounds of the tree.
   * @param {Vector3} max - The upper bounds of the tree.
   * @param {Number} [bias=0.0] - A threshold for proximity checks.
   * @param {Number} [maxPoints=8] - Number of distinct points per octant before it splits up.
   * @param {Number} [maxDepth=8] - The maximum tree depth level, starting at 0.
   */

  var PointOctree = function (_Octree) {
  	inherits(PointOctree, _Octree);

  	function PointOctree(min, max) {
  		var bias = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;
  		var maxPoints = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 8;
  		var maxDepth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 8;
  		classCallCheck(this, PointOctree);

  		var _this = possibleConstructorReturn(this, (PointOctree.__proto__ || Object.getPrototypeOf(PointOctree)).call(this));

  		_this.root = new PointOctant(min, max);

  		/**
     * A threshold for proximity checks.
     *
     * @property bias
     * @type Number
     * @private
     * @default 0.0
     */

  		_this.bias = Math.max(0.0, bias);

  		/**
     * The proximity threshold squared.
     *
     * @property biasSquared
     * @type Number
     * @private
     * @default 0.0
     */

  		_this.biasSquared = _this.bias * _this.bias;

  		/**
     * Number of points per octant before a split occurs.
     *
     * This value works together with the maximum depth as a secondary limiting
     * factor. Smaller values cause splits to occur earlier which results in a
     * faster and deeper tree growth.
     *
     * @property maxPoints
     * @type Number
     * @private
     * @default 8
     */

  		_this.maxPoints = Math.max(1, Math.round(maxPoints));

  		/**
     * The maximum tree depth level.
     *
     * It's possible to use Infinity, but be aware that allowing infinitely
     * small octants can have a negative impact on performance.
     * Finding a value that works best for a specific scene is advisable.
     *
     * @property maxDepth
     * @type Number
     * @private
     * @default 8
     */

  		_this.maxDepth = Math.max(0, Math.round(maxDepth));

  		return _this;
  	}

  	/**
    * Counts how many points are in this octree.
    *
    * @method countPoints
    * @return {Number} The amount of points.
    */

  	createClass(PointOctree, [{
  		key: "countPoints",
  		value: function countPoints() {

  			return _countPoints(this.root);
  		}

  		/**
     * Adds a point to the octree.
     *
     * @method add
     * @param {Vector3} p - A point.
     * @param {Object} data - An object that the point represents.
     */

  	}, {
  		key: "add",
  		value: function add(p, data) {

  			_add(this.root, p, data, 0, this.bias, this.maxPoints, this.maxDepth);
  		}

  		/**
     * Removes a point from the tree.
     *
     * @method remove
     * @param {Vector3} p - A point.
     */

  	}, {
  		key: "remove",
  		value: function remove(p) {

  			_remove(this.root, null, p, this.bias, this.maxPoints);
  		}

  		/**
     * Retrieves the data of the specified point.
     *
     * @method fetch
     * @param {Vector3} p - A position.
     * @return {Object} The data entry that is associated with the given point or null if it doesn't exist.
     */

  	}, {
  		key: "fetch",
  		value: function fetch(p) {

  			return _fetch(this.root, p, this.bias, this.biasSquared);
  		}

  		/**
     * Finds the closest point to the given one.
     *
     * @method findNearestPoint
     * @param {Vector3} p - A point.
     * @param {Number} [maxDistance=Infinity] - An upper limit for the distance between the points.
     * @param {Boolean} [skipSelf=false] - Whether a point that is exactly at the given position should be skipped.
     * @return {Object} An object representing the nearest point or null if there is none. The object has a point and a data property.
     */

  	}, {
  		key: "findNearestPoint",
  		value: function findNearestPoint(p) {
  			var maxDistance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
  			var skipSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


  			return _findNearestPoint(this.root, p, maxDistance, skipSelf);
  		}

  		/**
     * Finds points that are in the specified radius around the given position.
     *
     * @method findPoints
     * @param {Vector3} p - A position.
     * @param {Number} r - A radius.
     * @param {Boolean} [skipSelf=false] - Whether a point that is exactly at the given position should be skipped.
     * @return {Array} An array of objects, each containing a point and a data property.
     */

  	}, {
  		key: "findPoints",
  		value: function findPoints(p, r) {
  			var skipSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


  			var result = [];

  			_findPoints(this.root, p, r, skipSelf, result);

  			return result;
  		}

  		/**
     * Finds the points that intersect with the given ray.
     *
     * @method raycast
     * @param {Raycaster} raycaster - The raycaster.
     * @param {Array} [intersects] - An array to be filled with the intersecting points.
     * @return {Array} The intersecting points.
     */

  	}, {
  		key: "raycast",
  		value: function raycast(raycaster) {
  			var intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


  			var octants = get(PointOctree.prototype.__proto__ || Object.getPrototypeOf(PointOctree.prototype), "raycast", this).call(this, raycaster);

  			if (octants.length > 0) {

  				// Collect intersecting points.
  				this.testPoints(octants, raycaster, intersects);
  			}

  			return intersects;
  		}

  		/**
     * Collects points that intersect with the given ray.
     *
     * @method testPoints
     * @param {Array} octants - An array containing octants that intersect with the ray.
     * @param {Raycaster} raycaster - The raycaster.
     * @param {Array} intersects - An array to be filled with the intersecting points.
     */

  	}, {
  		key: "testPoints",
  		value: function testPoints(octants, raycaster, intersects) {

  			var threshold = raycaster.params.Points.threshold;
  			var thresholdSq = threshold * threshold;

  			var intersectPoint = void 0;
  			var distance = void 0,
  			    distanceToRay = void 0;
  			var rayPointDistanceSq = void 0;

  			var i = void 0,
  			    j = void 0,
  			    il = void 0,
  			    jl = void 0;
  			var octant = void 0,
  			    points = void 0,
  			    point = void 0;

  			for (i = 0, il = octants.length; i < il; ++i) {

  				octant = octants[i];
  				points = octant.points;

  				if (points !== null) {

  					for (j = 0, jl = points.length; j < jl; ++j) {

  						point = points[j];
  						rayPointDistanceSq = raycaster.ray.distanceSqToPoint(point);

  						if (rayPointDistanceSq < thresholdSq) {

  							intersectPoint = raycaster.ray.closestPointToPoint(point);
  							distance = raycaster.ray.origin.distanceTo(intersectPoint);

  							if (distance >= raycaster.near && distance <= raycaster.far) {

  								distanceToRay = Math.sqrt(rayPointDistanceSq);

  								intersects.push({
  									distance: distance,
  									distanceToRay: distanceToRay,
  									point: intersectPoint.clone(),
  									object: octant.data[j]
  								});
  							}
  						}
  					}
  				}
  			}
  		}
  	}]);
  	return PointOctree;
  }(Octree);

  /**
   * Point-oriented octree components.
   *
   * @module sparse-octree
   * @submodule points
   */

  /**
   * Exposure of the library components.
   *
   * @module sparse-octree
   * @main sparse-octree
   */

  exports.CubicOctant = CubicOctant;
  exports.EDGES = EDGES;
  exports.Octant = Octant;
  exports.Octree = Octree;
  exports.OctreeIterator = OctreeIterator;
  exports.OctreeRaycaster = OctreeRaycaster;
  exports.PATTERN = PATTERN;
  exports.OctreeHelper = OctreeHelper;
  exports.Box3 = Box3;
  exports.Vector3 = Vector3;
  exports.PointOctant = PointOctant;
  exports.PointOctree = PointOctree;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
