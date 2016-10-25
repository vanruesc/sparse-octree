/**
 * sparse-octree v2.4.1 build Oct 25 2016
 * https://github.com/vanruesc/sparse-octree
 * Copyright 2016 Raoul van Rüschen, Zlib
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
  typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
  (factory((global.OCTREE = global.OCTREE || {}),global.THREE));
}(this, (function (exports,THREE) { 'use strict';

  THREE = 'default' in THREE ? THREE['default'] : THREE;

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







  var get$1 = function get$1(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get$1(parent, property, receiver);
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



  var set$1 = function set$1(object, property, value, receiver) {
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent !== null) {
        set$1(parent, property, value, receiver);
      }
    } else if ("value" in desc && desc.writable) {
      desc.value = value;
    } else {
      var setter = desc.set;

      if (setter !== undefined) {
        setter.call(receiver, value);
      }
    }

    return value;
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
   * This class is a copy of THREE.Vector3. It can be removed as soon as three.js
   * starts supporting ES6 modules.
   *
   * @class Vector3
   * @constructor
   * @param {Number} [x=0] - The x value.
   * @param {Number} [y=0] - The y value.
   * @param {Number} [z=0] - The z value.
   */

  var Vector3 = function () {
  	function Vector3(x, y, z) {
  		classCallCheck(this, Vector3);


  		/**
     * The x component.
     *
     * @property x
     * @type Number
     */

  		this.x = x || 0;

  		/**
     * The y component.
     *
     * @property y
     * @type Number
     */

  		this.y = y || 0;

  		/**
     * The z component.
     *
     * @property z
     * @type Number
     */

  		this.z = z || 0;
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
  		value: function set(x, y, z) {

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
  		value: function toArray(array, offset) {

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
     * Adds a scalar to this vector.
     *
     * @method addScalar
     * @param {Vector3} s - The scalar to add.
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
     * @param {Vector3} s - The scalar to subtract.
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
     * @param {Vector3} s - A scalar.
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
     * @param {Vector3} s - A scalar.
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
     * Calculates the length squared of this vector.
     *
     * @method lengthSq
     * @return {Vector3} This vector.
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
     * @return {Vector3} This vector.
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
     * @return {Vector3} This vector.
     */

  	}, {
  		key: "distanceTo",
  		value: function distanceTo(v) {

  			return Math.sqrt(this.distanceToSquared(v));
  		}

  		/**
     * Calculates the distance squared to a given vector.
     *
     * @method distanceToSquared
     * @param {Vector3} v - A vector.
     * @return {Vector3} This vector.
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
  	function Octant(min, max) {
  		classCallCheck(this, Octant);


  		/**
     * The lower bounds of this octant.
     *
     * @property min
     * @type Vector3
     */

  		this.min = min !== undefined ? min : new Vector3();

  		/**
     * The upper bounds of the octant.
     *
     * @property max
     * @type Vector3
     */

  		this.max = max !== undefined ? max : new Vector3();

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
  				var min = arguments.length <= 0 || arguments[0] === undefined ? new Vector3() : arguments[0];
  				var size = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
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
  				get: function get() {
  						return this.min.clone().addScalar(this.size);
  				}
  		}]);
  		return CubicOctant;
  }();

  /**
   * A bounding box.
   *
   * This class is a copy of THREE.Box3. It can be removed as soon as three.js
   * starts supporting ES6 modules.
   *
   * @class Box3
   * @constructor
   */

  var Box3 = function () {
  	function Box3(min, max) {
  		classCallCheck(this, Box3);


  		/**
     * The min bounds.
     *
     * @property min
     * @type Vector3
     */

  		this.min = min !== undefined ? min : new Vector3(Infinity, Infinity, Infinity);

  		/**
     * The max bounds.
     *
     * @property max
     * @type Vector3
     */

  		this.max = max !== undefined ? max : new Vector3(-Infinity, -Infinity, -Infinity);
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
  		value: function set(min, max) {

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
   * A collection of utility functions for octree raycasting.
   *
   * Based on:
   *  "An Efficient Parametric Algorithm for Octree Traversal"
   *  by J. Revelles et al. (2000).
   *
   * @class Raycasting
   * @submodule core
   * @static
   */

  var Raycasting = function () {
  	function Raycasting() {
  		classCallCheck(this, Raycasting);
  	}

  	createClass(Raycasting, null, [{
  		key: "raycast",


  		/**
     * Finds the octants that intersect with the given ray.
     *
     * @method raycast
     * @static
     * @param {Octree} octree - An octree.
     * @param {Raycaster} raycaster - The raycaster.
     * @param {Array} octants - An array to be filled with the intersecting octants.
     */

  		value: function raycast(octree, raycaster, octants) {

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

  				raycastOctant(octree.root, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, octants);
  			}
  		}
  	}]);
  	return Raycasting;
  }();

  /**
   * An octree that subdivides space for fast spatial searches.
   *
   * @class Octree
   * @submodule core
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

  			var h0 = [this.root];
  			var h1 = [];

  			var depth = 0;
  			var octant = void 0,
  			    children = void 0;

  			while (h0.length > 0) {

  				octant = h0.pop();
  				children = octant.children;

  				if (children !== null) {
  					var _h;

  					(_h = h1).push.apply(_h, toConsumableArray(children));
  				}

  				if (h0.length === 0) {

  					h0 = h1;
  					h1 = [];

  					if (h0.length > 0) {
  						++depth;
  					}
  				}
  			}

  			return depth;
  		}

  		/**
     * Collects octants that lie inside the specified region.
     *
     * @method cull
     * @param {Frustum|Box3} region - A frustum or a bounding box.
     * @return {Array} The octants.
     */

  	}, {
  		key: "cull",
  		value: function cull(region) {

  			var result = [];
  			var heap = [this.root];
  			var box = new Box3();

  			var octant = void 0,
  			    children = void 0;

  			while (heap.length > 0) {

  				octant = heap.pop();
  				children = octant.children;

  				// Cache the computed max vector of cubic octants.
  				box.min = octant.min;
  				box.max = octant.max;

  				if (region.intersectsBox(box)) {

  					if (children !== null) {

  						heap.push.apply(heap, toConsumableArray(children));
  					} else {

  						result.push(octant);
  					}
  				}
  			}

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

  			var h0 = [this.root];
  			var h1 = [];

  			var octant = void 0,
  			    children = void 0;
  			var currentLevel = 0;

  			while (h0.length > 0) {

  				octant = h0.pop();
  				children = octant.children;

  				if (currentLevel === level) {

  					result.push(octant);
  				} else if (children !== null) {
  					var _h2;

  					(_h2 = h1).push.apply(_h2, toConsumableArray(children));
  				}

  				if (h0.length === 0) {

  					h0 = h1;
  					h1 = [];

  					if (++currentLevel > level) {
  						break;
  					}
  				}
  			}

  			return result;
  		}

  		/**
     * Finds the octants that intersect with the given ray.
     *
     * @method raycast
     * @param {Raycaster} raycaster - The raycaster.
     * @param {Array} intersects - An array to be filled with the intersecting octants.
     */

  	}, {
  		key: "raycast",
  		value: function raycast(raycaster, intersects) {

  			Raycasting.raycast(this, raycaster, intersects);
  		}
  	}, {
  		key: "min",
  		get: function get() {
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
  		get: function get() {
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
  		get: function get() {
  			return this.root.children;
  		}
  	}]);
  	return Octree;
  }();

  /**
   * An octree helper.
   *
   * The update method must be called manually to generate the octree geometry.
   *
   * @class OctreeHelper
   * @submodule core
   * @constructor
   * @extends Object3D
   * @param {Octree} [tree=null] - The octree to visualise.
   */

  var OctreeHelper = function (_THREE$Object3D) {
  		inherits(OctreeHelper, _THREE$Object3D);

  		function OctreeHelper() {
  				var tree = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
  				classCallCheck(this, OctreeHelper);

  				var _this = possibleConstructorReturn(this, (OctreeHelper.__proto__ || Object.getPrototypeOf(OctreeHelper)).call(this));

  				_this.name = "OctreeHelper";

  				/**
       * The octree.
       *
       * @property tree
       * @type Octree
       */

  				_this.tree = tree;

  				return _this;
  		}

  		/**
     * Creates the octree geometry.
     *
     * @method update
     * @throws {Error} An error is thrown if too many vertices are created.
     */

  		createClass(OctreeHelper, [{
  				key: "update",
  				value: function update() {

  						var vertexMap = new Map();
  						var depth = this.tree !== null ? this.tree.getDepth() : -1;

  						var connections = [
  						/* 0 */[1, 4],
  						/* 1 */[2, 5],
  						/* 2 */[3, 6],
  						/* 3 */[0, 7],
  						/* 4 */[5],
  						/* 5 */[6],
  						/* 6 */[7],
  						/* 7 */[4]];

  						var i = void 0,
  						    j = void 0,
  						    k = void 0,
  						    il = void 0,
  						    kl = void 0;
  						var octants = void 0,
  						    octant = void 0;

  						var vertices = void 0,
  						    v = void 0,
  						    c = void 0;
  						var entry = void 0,
  						    key = void 0;

  						var geometry = void 0,
  						    lineSegments = void 0,
  						    material = void 0;

  						var indexCount = void 0;
  						var indices = null;
  						var positions = null;

  						var level = 0;

  						// Remove existing geometry.
  						for (i = 0, il = this.children.length; i < il; ++i) {

  								this.children[i].geometry.dispose();
  								this.children[i].material.dispose();
  						}

  						while (this.children.length > 0) {

  								this.remove(this.children[0]);
  						}

  						while (level <= depth) {

  								octants = this.tree.findOctantsByLevel(level);

  								indexCount = 0;
  								vertexMap.clear();

  								for (i = 0, j = 0, il = octants.length; i < il; ++i) {

  										octant = octants[i];

  										vertices = [
  										/* 0 */[octant.max.x, octant.max.y, octant.max.z],
  										/* 1 */[octant.min.x, octant.max.y, octant.max.z],
  										/* 2 */[octant.min.x, octant.min.y, octant.max.z],
  										/* 3 */[octant.max.x, octant.min.y, octant.max.z],
  										/* 4 */[octant.max.x, octant.max.y, octant.min.z],
  										/* 5 */[octant.min.x, octant.max.y, octant.min.z],
  										/* 6 */[octant.min.x, octant.min.y, octant.min.z],
  										/* 7 */[octant.max.x, octant.min.y, octant.min.z]];

  										// Update the vertex map.
  										for (j = 0; j < 8; ++j) {

  												v = vertices[j];
  												c = connections[j];

  												key = v.toString();
  												entry = vertexMap.get(key);

  												// Prevent duplicates.
  												if (entry !== undefined) {

  														// Adopt unique connections.
  														for (k = 0, kl = c.length; k < kl; ++k) {

  																key = vertices[c[k]].toString();

  																if (entry.connectionKeys.indexOf(key) < 0) {

  																		entry.connectionKeys.push(key);
  																		++indexCount;
  																}
  														}
  												} else {

  														// No duplicate, create new entry.
  														entry = {
  																position: v,
  																connectionKeys: [],
  																index: vertexMap.size
  														};

  														for (k = 0, kl = c.length; k < kl; ++k) {

  																entry.connectionKeys.push(vertices[c[k]].toString());
  																++indexCount;
  														}

  														vertexMap.set(key, entry);
  												}
  										}
  								}

  								// Create the geometry for this level.
  								if (vertexMap.size < 65536) {

  										indices = new Uint16Array(indexCount * 2);
  										positions = new Float32Array(vertexMap.size * 3);

  										i = 0;j = 0;

  										var _iteratorNormalCompletion = true;
  										var _didIteratorError = false;
  										var _iteratorError = undefined;

  										try {
  												for (var _iterator = vertexMap.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
  														entry = _step.value;


  														v = entry.position;

  														positions[i++] = v[0];
  														positions[i++] = v[1];
  														positions[i++] = v[2];

  														c = entry.connectionKeys;

  														// Add the index pairs that describe the lines.
  														for (k = 0, kl = c.length; k < kl; ++k) {

  																indices[j++] = entry.index;
  																indices[j++] = vertexMap.get(c[k]).index;
  														}
  												}
  										} catch (err) {
  												_didIteratorError = true;
  												_iteratorError = err;
  										} finally {
  												try {
  														if (!_iteratorNormalCompletion && _iterator.return) {
  																_iterator.return();
  														}
  												} finally {
  														if (_didIteratorError) {
  																throw _iteratorError;
  														}
  												}
  										}

  										geometry = new THREE.BufferGeometry();
  										geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  										geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));

  										material = new THREE.LineBasicMaterial({
  												color: new THREE.Color(0xffffff * Math.random())
  										});

  										lineSegments = new THREE.LineSegments(geometry, material);

  										this.add(lineSegments);
  								} else {

  										throw new Error("Could not create geometry for octree depth level " + level + " (vertex count of " + vertexMap.size + " exceeds limit of 65536)");
  								}

  								++level;
  						}
  				}
  		}]);
  		return OctreeHelper;
  }(THREE.Object3D);

  /**
   * Core components.
   *
   * @module octree
   * @submodule core
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
     * Counts how many points are in this octant.
     *
     * @method countPoints
     * @return {Number} The amount of points.
     */

  		createClass(PointOctant, [{
  				key: "countPoints",
  				value: function countPoints() {

  						var heap = [this];

  						var result = 0;
  						var octant = void 0,
  						    children = void 0;

  						while (heap.length > 0) {

  								octant = heap.pop();
  								children = octant.children;

  								if (children !== null) {

  										heap.push.apply(heap, toConsumableArray(children));
  								} else if (octant.points !== null) {

  										result += octant.points.length;
  								}
  						}

  						return result;
  				}

  				/**
       * Computes the distance squared from this octant to the given point.
       *
       * @method distanceToSquared
       * @param {Vector3} p - A point.
       * @return {Number} The distance squared.
       */

  		}, {
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

  						var i = void 0,
  						    l = void 0;
  						var child = void 0,
  						    point = void 0,
  						    data = void 0;

  						if (children !== null) {

  								while (points.length > 0) {

  										point = points.pop();
  										data = this.data.pop();

  										for (i = 0, l = children.length; i < l; ++i) {

  												child = children[i];

  												if (child.contains(point, bias)) {

  														if (child.points === null) {

  																child.points = [];
  																child.data = [];
  														}

  														child.points.push(point);
  														child.data.push(data);

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

  				/**
       * Finds the closest point to the given one.
       *
       * @method findNearestPoint
       * @param {Vector3} p - The point.
       * @param {Number} maxDistance - The maximum distance.
       * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
       * @return {Object} An object representing the nearest point or null if there is none. The object has a point and a data property.
       */

  		}, {
  				key: "findNearestPoint",
  				value: function findNearestPoint(p, maxDistance, skipSelf) {

  						var points = this.points;
  						var children = this.children;

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

  												childResult = child.findNearestPoint(p, bestDist, skipSelf);

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
  														data: this.data[i]
  												};
  										}
  								}
  						}

  						return result;
  				}

  				/**
       * Finds points that are inside the specified radius around a given position.
       *
       * @method findPoints
       * @param {Vector3} p - A position.
       * @param {Number} r - A radius.
       * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
       * @param {Array} result - An array to be filled with objects, each containing a point and a data property.
       */

  		}, {
  				key: "findPoints",
  				value: function findPoints(p, r, skipSelf, result) {

  						var points = this.points;
  						var children = this.children;
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

  												child.findPoints(p, r, skipSelf, result);
  										}
  								}
  						} else if (points !== null) {

  								for (i = 0, l = points.length; i < l; ++i) {

  										point = points[i];
  										distSq = p.distanceToSquared(point);

  										if ((!skipSelf || distSq > 0.0) && distSq <= rSq) {

  												result.push({
  														point: point.clone(),
  														data: this.data[i]
  												});
  										}
  								}
  						}
  				}
  		}]);
  		return PointOctant;
  }(Octant);

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
  				var bias = arguments.length <= 2 || arguments[2] === undefined ? 0.0 : arguments[2];
  				var maxPoints = arguments.length <= 3 || arguments[3] === undefined ? 8 : arguments[3];
  				var maxDepth = arguments.length <= 4 || arguments[4] === undefined ? 8 : arguments[4];
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

  						return this.root.countPoints();
  				}

  				/**
       * Adds a point to the tree.
       *
       * @method add
       * @param {Vector3} p - A point.
       * @param {Object} data - An object that the point represents.
       */

  		}, {
  				key: "add",
  				value: function add(p, data) {

  						p = p.clone();

  						var heap = [this.root];
  						var currentLevel = 0;

  						var octant = void 0,
  						    children = void 0;
  						var i = void 0,
  						    l = void 0;

  						var exists = false;

  						if (data !== undefined && data !== null) {

  								while (heap.length > 0) {

  										octant = heap.pop();
  										children = octant.children;

  										if (octant.contains(p, this.bias)) {

  												heap = [];

  												if (children !== null) {
  														var _heap;

  														(_heap = heap).push.apply(_heap, toConsumableArray(children));

  														++currentLevel;
  												} else {

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
  														} else if (octant.points.length < this.maxPoints || currentLevel === this.maxDepth) {

  																octant.points.push(p);
  																octant.data.push(data);
  														} else {
  																var _heap2;

  																octant.split();
  																octant.redistribute(this.bias);

  																(_heap2 = heap).push.apply(_heap2, toConsumableArray(octant.children));

  																++currentLevel;
  														}
  												}
  										}
  								}
  						}
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

  						var heap = [this.root];
  						var parent = this.root;

  						var octant = void 0,
  						    children = void 0;

  						var i = void 0,
  						    l = void 0;
  						var points = void 0,
  						    data = void 0;
  						var point = void 0,
  						    last = void 0;

  						while (heap.length > 0) {

  								octant = heap.pop();
  								children = octant.children;

  								if (octant.contains(p, this.bias)) {

  										heap = [];

  										if (children !== null) {
  												var _heap3;

  												(_heap3 = heap).push.apply(_heap3, toConsumableArray(children));
  												parent = octant;
  										} else if (octant.points !== null) {

  												points = octant.points;
  												data = octant.data;

  												for (i = 0, l = points.length; i < l; ++i) {

  														point = points[i];

  														if (point.equals(p)) {

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

  																if (parent.countPoints() <= this.maxPoints) {

  																		parent.merge();
  																}

  																break;
  														}
  												}
  										}
  								}
  						}
  				}

  				/**
       * Retrieves the data of the point at the specified position.
       *
       * @method fetch
       * @param {Vector3} p - A position.
       * @return {Object} The data entry that is associated with the given point or null if it doesn't exist.
       */

  		}, {
  				key: "fetch",
  				value: function fetch(p) {

  						var heap = [this.root];

  						var result = null;

  						var octant = void 0,
  						    children = void 0;
  						var i = void 0,
  						    l = void 0;
  						var point = void 0;

  						while (heap.length > 0) {

  								octant = heap.pop();
  								children = octant.children;

  								if (octant.contains(p, this.bias)) {

  										heap = [];

  										if (children !== null) {
  												var _heap4;

  												(_heap4 = heap).push.apply(_heap4, toConsumableArray(children));
  										} else {

  												for (i = 0, l = octant.points.length; i < l; ++i) {

  														point = octant.points[i];

  														if (p.distanceToSquared(point) <= this.biasSquared) {

  																result = octant.data[i];

  																break;
  														}
  												}
  										}
  								}
  						}

  						return result;
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
  						var maxDistance = arguments.length <= 1 || arguments[1] === undefined ? Infinity : arguments[1];
  						var skipSelf = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];


  						return this.root.findNearestPoint(p, maxDistance, skipSelf);
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
  						var skipSelf = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];


  						var result = [];

  						this.root.findPoints(p, r, skipSelf, result);

  						return result;
  				}

  				/**
       * Finds the points that intersect with the given ray.
       *
       * @method raycast
       * @param {Raycaster} raycaster - The raycaster.
       * @param {Array} intersects - An array to be filled with the intersecting points.
       */

  		}, {
  				key: "raycast",
  				value: function raycast(raycaster, intersects) {

  						var octants = [];

  						get$1(PointOctree.prototype.__proto__ || Object.getPrototypeOf(PointOctree.prototype), "raycast", this).call(this, raycaster, octants);

  						if (octants.length > 0) {

  								// Collect intersecting points.
  								this.testPoints(octants, raycaster, intersects);
  						}
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
   * @module octree
   * @submodule points
   */

  /**
   * Exposure of the library components.
   *
   * @module octree
   * @main octree
   */

  exports.CubicOctant = CubicOctant;
  exports.Octant = Octant;
  exports.Octree = Octree;
  exports.OctreeHelper = OctreeHelper;
  exports.PATTERN = PATTERN;
  exports.Raycasting = Raycasting;
  exports.PointOctant = PointOctant;
  exports.PointOctree = PointOctree;

  Object.defineProperty(exports, '__esModule', { value: true });

})));