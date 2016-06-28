/**
 * sparse-octree v0.1.5 build Jun 28 2016
 * https://github.com/vanruesc/sparse-octree
 * Copyright 2016 Raoul van Rüschen, Zlib
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
  typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
  (factory((global.OCTREE = global.OCTREE || {}),global.THREE));
}(this, function (exports,THREE) { 'use strict';

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

  /**
   * A vector with three components.
   *
   * This class is a copy of THREE.Vector3. It can be removed  as soon as three.js 
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
   * @constructor
   * @param {Vector3} min - The lower bounds.
   * @param {Vector3} max - The upper bounds.
   * @param {Number} level - The depth level.
   */

  var Octant = function () {
  		function Octant(min, max, level) {
  				classCallCheck(this, Octant);


  				/**
       * The lower bounds of this octant.
       *
       * @property min
       * @type Vector3
       * @final
       */

  				this.min = min !== undefined ? min : new Vector3();

  				/**
       * The upper bounds of the octant.
       *
       * @property max
       * @type Vector3
       * @final
       */

  				this.max = max !== undefined ? max : new Vector3();

  				/**
       * The depth level of this octant.
       *
       * @property level
       * @type Number
       * @final
       */

  				this.level = level !== undefined ? level : 0;

  				/**
       * The amount of points in this octant.
       *
       * @property totalPoints
       * @type Number
       */

  				this.totalPoints = 0;

  				/**
       * The points that are inside this node.
       *
       * @property points
       * @type Array
       */

  				this.points = null;

  				/**
       * Additional data that is kept in sets for individual points.
       *
       * @property dataSets
       * @type Array
       */

  				this.dataSets = null;

  				/**
       * The children of this node.
       *
       * @property children
       * @type Array
       */

  				this.children = null;
  		}

  		/**
     * Computes the center of this octant.
     *
     * @method center
     * @return {Vector3} The center of this octant.
     */

  		createClass(Octant, [{
  				key: "center",
  				value: function center() {

  						return this.min.clone().add(this.max).multiplyScalar(0.5);
  				}

  				/**
       * Computes the size of this octant.
       *
       * @method size
       * @return {Vector3} The size of this octant.
       */

  		}, {
  				key: "size",
  				value: function size() {

  						return this.max.clone().sub(this.min);
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

  						var center = this.center();

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
       * @method containsPoint
       * @param {Vector3} p - A point.
       * @param {Number} bias - A padding that extends the boundaries temporarily.
       * @return {Boolean} Whether the given point lies inside this octant.
       */

  		}, {
  				key: "containsPoint",
  				value: function containsPoint(p, bias) {

  						var min = this.min;
  						var max = this.max;

  						return p.x >= min.x - bias && p.y >= min.y - bias && p.z >= min.z - bias && p.x <= max.x + bias && p.y <= max.y + bias && p.z <= max.z + bias;
  				}

  				/**
       * Collects leaf octants that lie inside the given frustum.
       *
       * @method cull
       * @param {Frustum} frustum - A frustum.
       * @param {Array} intersects - An array to be filled with the intersecting octants.
       */

  		}, {
  				key: "cull",
  				value: function cull(frustum, intersects) {

  						var i = void 0,
  						    l = void 0;

  						if (frustum.intersectsBox(this)) {

  								if (this.children !== null) {

  										for (i = 0, l = this.children.length; i < l; ++i) {

  												this.children[i].cull(frustum, intersects);
  										}
  								} else if (this.totalPoints > 0) {

  										intersects.push(this);
  								}
  						}
  				}

  				/**
       * Adds a given point to this node. If this octant isn't a leaf node, the 
       * point will be added to a child octant.
       *
       * @method add
       * @param {Vector3} p - A point.
       * @param {Object} [data] - An object that will be associated with the point.
       * @return {Boolean} Whether the point was a unique addition.
       */

  		}, {
  				key: "add",
  				value: function add(p, data) {

  						var unique = false;
  						var hit = false;

  						var i = void 0,
  						    l = void 0;
  						var points = void 0,
  						    point = void 0;

  						if (this.children !== null) {

  								unique = this.addToChild(p, data);
  						} else {

  								if (this.totalPoints === 0) {

  										this.points = [];
  										this.dataSets = [];
  								}

  								points = this.points;

  								// @todo: improve time complexity of duplicate check.
  								for (i = 0, l = this.totalPoints; !hit && i < l; ++i) {

  										point = points[i];
  										hit = point.equals(p);
  								}

  								if (hit) {

  										// Aggregate data of duplicates.
  										if (data !== undefined) {

  												this.dataSets[i - 1].add(data);
  										}
  								} else {

  										unique = true;

  										if (this.totalPoints === Octant.maxPoints && this.level < Octant.maxDepth) {

  												// At maximum capacity and can still split.
  												this.split();
  												this.addToChild(p, data);
  										} else {

  												// Count distinct points in leaf nodes.
  												this.totalPoints = this.points.push(p);
  												this.dataSets.push(new Set());

  												if (data !== undefined) {

  														this.dataSets[this.totalPoints - 1].add(data);
  												}
  										}
  								}
  						}

  						return unique;
  				}

  				/**
       * Adds the given point to a child node that covers the point's position.
       *
       * @method addToChild
       * @private
       * @param {Vector3} p - A point.
       * @param {Object} [data] - An object that will be associated with the point.
       * @return {Boolean} Whether the point was a unique addition.
       */

  		}, {
  				key: "addToChild",
  				value: function addToChild(p, data) {

  						var unique = false;
  						var hit = false;

  						var i = void 0,
  						    l = void 0;

  						for (i = 0, l = this.children.length; !hit && i < l; ++i) {

  								hit = this.children[i].containsPoint(p, Octant.bias);

  								if (hit) {

  										unique = this.children[i].add(p, data);

  										if (unique) {

  												// Register addition in parent node.
  												++this.totalPoints;
  										}
  								}
  						}

  						return unique;
  				}

  				/**
       * Splits this octant up into eight smaller ones.
       *
       * @method split
       * @private
       */

  		}, {
  				key: "split",
  				value: function split() {

  						var min = this.min;
  						var mid = this.center();
  						var max = this.max;

  						var nextLevel = this.level + 1;

  						var i = void 0,
  						    l = void 0;
  						var point = void 0,
  						    data = void 0;

  						/* The order is important for raycasting.
         *
         *    3____7
         *  2/___6/|
         *  | 1__|_5
         *  0/___4/
         *
         */

  						this.children = [new this.constructor(min, mid, nextLevel), new this.constructor(new Vector3(min.x, min.y, mid.z), new Vector3(mid.x, mid.y, max.z), nextLevel), new this.constructor(new Vector3(min.x, mid.y, min.z), new Vector3(mid.x, max.y, mid.z), nextLevel), new this.constructor(new Vector3(min.x, mid.y, mid.z), new Vector3(mid.x, max.y, max.z), nextLevel), new this.constructor(new Vector3(mid.x, min.y, min.z), new Vector3(max.x, mid.y, mid.z), nextLevel), new this.constructor(new Vector3(mid.x, min.y, mid.z), new Vector3(max.x, mid.y, max.z), nextLevel), new this.constructor(new Vector3(mid.x, mid.y, min.z), new Vector3(max.x, max.y, mid.z), nextLevel), new this.constructor(mid, max, nextLevel)];

  						// Distribute existing points to the new children.
  						i = this.totalPoints - 1;
  						this.totalPoints = 0;

  						while (i >= 0) {

  								point = this.points[i];

  								if (this.dataSets[i].size > 0) {

  										// Unfold data aggregations. Each entry is one point.
  										var _iteratorNormalCompletion = true;
  										var _didIteratorError = false;
  										var _iteratorError = undefined;

  										try {
  												for (var _iterator = this.dataSets[i].values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
  														data = _step.value;


  														this.addToChild(point, data);
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
  								} else {

  										this.addToChild(point);
  								}

  								--i;
  						}

  						this.points = null;
  						this.dataSets = null;
  				}

  				/**
       * Removes the given point from this octant. If this octant is not a leaf 
       * node, the point will be removed from a child node. If no data is provided, 
       * the point and all its respective data entries will be removed completely.
       *
       * @method remove
       * @param {Vector3} p - The point.
       * @param {Object} [data] - An object that is associated with the point.
       * @return {Boolean} Whether the removed point was unique.
       */

  		}, {
  				key: "remove",
  				value: function remove(p, data) {

  						var points = this.points;
  						var dataSets = this.dataSets;

  						var unique = false;

  						var i = void 0,
  						    l = void 0;
  						var point = void 0,
  						    last = void 0;

  						var dataSet = null;

  						if (this.children !== null) {

  								unique = this.removeFromChild(p, data);

  								if (this.totalPoints <= Octant.maxPoints) {

  										this.merge();
  								}
  						} else if (this.totalPoints > 0) {

  								for (i = 0, l = this.totalPoints; dataSet === null && i < l; ++i) {

  										point = points[i];

  										if (point.equals(p)) {

  												// Found it.
  												dataSet = dataSets[i];

  												if (data !== undefined) {

  														dataSet.delete(data);
  												} else {

  														dataSet.clear();
  												}

  												if (dataSet.size === 0) {

  														unique = true;
  														last = l - 1;

  														// If the point is NOT the last one in the array:
  														if (i < last) {

  																// Overwrite with the last point...
  																points[i] = points[last];

  																// ...and data set.
  																dataSets[i] = dataSets[last];
  														}

  														// Drop the last entry.
  														points.pop();
  														dataSets.pop();

  														// Register deletion in leaf node.
  														--this.totalPoints;
  												}
  										}
  								}
  						}

  						return unique;
  				}

  				/**
       * Removes the given point from a child node.
       *
       * @method removeFromChild
       * @private
       * @param {Vector3} p - The point.
       * @param {Object} [data] - An object that is associated with the point.
       * @return {Boolean} Whether the removed point was unique.
       */

  		}, {
  				key: "removeFromChild",
  				value: function removeFromChild(p, data) {

  						var unique = false;
  						var hit = false;

  						var i = void 0,
  						    l = void 0;

  						for (i = 0, l = this.children.length; !hit && i < l; ++i) {

  								hit = this.children[i].containsPoint(p, Octant.bias);

  								if (hit) {

  										unique = this.children[i].remove(p, data);

  										if (unique) {

  												// Register deletion in parent node.
  												--this.totalPoints;
  										}
  								}
  						}

  						return unique;
  				}

  				/**
       * Gathers all points from the children. The children are expected to be leaf 
       * nodes and will be dropped afterwards.
       *
       * @method merge
       * @private
       */

  		}, {
  				key: "merge",
  				value: function merge() {

  						var i = void 0,
  						    j = void 0,
  						    il = void 0,
  						    jl = void 0;
  						var child = void 0,
  						    id1 = void 0,
  						    id2 = void 0;

  						this.totalPoints = 0;
  						this.points = [];
  						this.dataSets = [];

  						for (i = 0, il = this.children.length; i < il; ++i) {

  								child = this.children[i];

  								for (j = 0, jl = child.totalPoints; j < jl; ++j) {

  										this.totalPoints = this.points.push(child.points[j]);
  										this.dataSets.push(child.dataSets[j]);
  								}
  						}

  						this.children = null;
  				}

  				/**
       * Refreshes this octant and its children to make sure that all constraints 
       * are satisfied.
       *
       * @method update
       */

  		}, {
  				key: "update",
  				value: function update() {

  						var children = this.children;

  						var i = void 0,
  						    l = void 0;

  						if (children !== null) {

  								// Start from the bottom.
  								for (i = 0, l = children.length; i < l; ++i) {

  										children[i].update();
  								}

  								if (this.totalPoints <= Octant.maxPoints || this.level >= Octant.maxDepth) {

  										// All points fit into one octant or the level is too high.
  										this.merge();
  								}
  						} else if (this.totalPoints > Octant.maxPoints && this.level < Octant.maxDepth) {

  								// Exceeding maximum capacity.
  								this.split();
  						}
  				}

  				/**
       * Retrieves the data of the point at the specified position.
       *
       * @method fetch
       * @param {Vector3} p - A position.
       * @return {Set} A set of data entries that are associated with the given point or null if it doesn't exist.
       */

  		}, {
  				key: "fetch",
  				value: function fetch(p) {

  						var result = null;
  						var hit = false;

  						var i = void 0,
  						    l = void 0;
  						var point = void 0;

  						if (this.containsPoint(p, Octant.bias)) {

  								if (this.children !== null) {

  										for (i = 0, l = this.children.length; result === null && i < l; ++i) {

  												result = this.children[i].fetch(p);
  										}
  								} else {

  										for (i = 0, l = this.totalPoints; !hit && i < l; ++i) {

  												point = this.points[i];
  												hit = p.distanceToSquared(point) <= Octant.biasSquared;

  												if (hit) {

  														result = this.dataSets[i];
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

  						// Only consider leaf nodes.
  						if (children === null) {

  								for (i = 0, l = this.totalPoints; i < l; ++i) {

  										point = points[i];
  										distSq = p.distanceToSquared(point);

  										if ((!skipSelf || distSq > 0.0) && distSq <= bestDist) {

  												bestDist = distSq;

  												result = {
  														point: point.clone(),
  														data: this.dataSets[i]
  												};
  										}
  								}
  						} else {

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

  										if (child.totalPoints > 0 && child.containsPoint(p, bestDist)) {

  												childResult = child.findNearestPoint(p, bestDist, skipSelf);

  												if (childResult !== null) {

  														distSq = childResult.point.distanceToSquared(p);

  														if ((!skipSelf || distSq > 0.0) && distSq <= bestDist) {

  																bestDist = distSq;
  																result = childResult;
  														}
  												}
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

  						// Only consider leaf nodes.
  						if (children === null) {

  								for (i = 0, l = this.totalPoints; i < l; ++i) {

  										point = points[i];
  										distSq = p.distanceToSquared(point);

  										if ((!skipSelf || distSq > 0.0) && distSq <= rSq) {

  												result.push({
  														point: point.clone(),
  														data: this.dataSets[i]
  												});
  										}
  								}
  						} else {

  								// The order of the children is irrelevant.
  								for (i = 0, l = children.length; i < l; ++i) {

  										child = children[i];

  										if (child.totalPoints > 0 && child.containsPoint(p, r)) {

  												child.findPoints(p, r, skipSelf, result);
  										}
  								}
  						}
  				}

  				/**
       * Fetches all octants with the specified level.
       *
       * @method getOctantsByLevel
       * @param {Number} level - The depth level.
       * @param {Array} result - An array to be filled with octants. Empty octants will be excluded.
       */

  		}, {
  				key: "getOctantsByLevel",
  				value: function getOctantsByLevel(level, result) {

  						var i = void 0,
  						    l = void 0;

  						if (this.level === level) {

  								if (this.totalPoints > 0 || this.children !== null) {

  										result.push(this);
  								}
  						} else if (this.children !== null) {

  								for (i = 0, l = this.children.length; i < l; ++i) {

  										this.children[i].getOctantsByLevel(level, result);
  								}
  						}
  				}

  				/**
       * Finds the current tree depth recursively.
       *
       * @method getDepth
       * @return {Number} The depth.
       */

  		}, {
  				key: "getDepth",
  				value: function getDepth() {

  						var result = 0;
  						var depth = void 0;
  						var i = void 0,
  						    l = void 0;

  						if (this.children !== null) {

  								for (i = 0, l = this.children.length; i < l; ++i) {

  										depth = 1 + this.children[i].getDepth();

  										if (depth > result) {

  												result = depth;
  										}
  								}
  						}

  						return result;
  				}
  		}]);
  		return Octant;
  }();

  /**
   * A threshold for proximity checks.
   *
   * @property bias
   * @type Number
   * @static
   * @default 0.0
   */

  Octant.bias = 0.0;

  /**
   * The proximity threshold squared.
   *
   * @property biasSquared
   * @type Number
   * @static
   * @default 0.0
   */

  Octant.biasSquared = 0.0;

  /**
   * The maximum tree depth level.
   *
   * @property maxDepth
   * @type Number
   * @static
   * @default 8
   */

  Octant.maxDepth = 8;

  /**
   * Number of points per octant before a split occurs.
   *
   * @property maxPoints
   * @type Number
   * @static
   * @default 8
   */

  Octant.maxPoints = 8;

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
   * Determines the entry plane of the first octant that a ray travels through.
   *
   * Determining the first octant requires knowing which of the t0's is the 
   * largest. The tm's of the other axes must also be compared against that 
   * largest t0.
   *
   * @method getFirstOctant
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

  function getFirstOctant(tx0, ty0, tz0, txm, tym, tzm) {

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
   * Fetches the next octant for raycasting based on the exit plane of the current 
   * one.
   *
   * @method getNextOctant
   * @private
   * @static
   * @param {Number} currentOctant - The index of the current octant.
   * @param {Number} tx1 - Ray projection parameter.
   * @param {Number} ty1 - Ray projection parameter.
   * @param {Number} tz1 - Ray projection parameter.
   * @return {Number} The index of the next octant that the ray travels through.
   */

  function getNextOctant(currentOctant, tx1, ty1, tz1) {

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
   * @param {Octant} octant - the current octant.
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

  			currentOctant = getFirstOctant(tx0, ty0, tz0, txm, tym, tzm);

  			do {

  				/* The possibilities for the next node are passed in the same 
       * respective order as the t-values. Hence, if the first parameter is 
       * found as the greatest, the fourth one will be returned. If the 2nd 
       * parameter is the greatest, the 5th will be returned, etc.
       */

  				switch (currentOctant) {

  					case 0:
  						raycastOctant(children[flags[8]], tx0, ty0, tz0, txm, tym, tzm, raycaster, intersects);
  						currentOctant = getNextOctant(currentOctant, txm, tym, tzm);
  						break;

  					case 1:
  						raycastOctant(children[flags[8] ^ flags[1]], tx0, ty0, tzm, txm, tym, tz1, raycaster, intersects);
  						currentOctant = getNextOctant(currentOctant, txm, tym, tz1);
  						break;

  					case 2:
  						raycastOctant(children[flags[8] ^ flags[2]], tx0, tym, tz0, txm, ty1, tzm, raycaster, intersects);
  						currentOctant = getNextOctant(currentOctant, txm, ty1, tzm);
  						break;

  					case 3:
  						raycastOctant(children[flags[8] ^ flags[3]], tx0, tym, tzm, txm, ty1, tz1, raycaster, intersects);
  						currentOctant = getNextOctant(currentOctant, txm, ty1, tz1);
  						break;

  					case 4:
  						raycastOctant(children[flags[8] ^ flags[4]], txm, ty0, tz0, tx1, tym, tzm, raycaster, intersects);
  						currentOctant = getNextOctant(currentOctant, tx1, tym, tzm);
  						break;

  					case 5:
  						raycastOctant(children[flags[8] ^ flags[5]], txm, ty0, tzm, tx1, tym, tz1, raycaster, intersects);
  						currentOctant = getNextOctant(currentOctant, tx1, tym, tz1);
  						break;

  					case 6:
  						raycastOctant(children[flags[8] ^ flags[6]], txm, tym, tz0, tx1, ty1, tzm, raycaster, intersects);
  						currentOctant = getNextOctant(currentOctant, tx1, ty1, tzm);
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

  			var root = octree.root;

  			var size = root.size().clone();
  			var halfSize = size.clone().multiplyScalar(0.5);

  			// Translate the octree extents to the center of the octree.
  			var min = root.min.clone().sub(root.min);
  			var max = root.max.clone().sub(root.min);

  			var direction = raycaster.ray.direction.clone();
  			var origin = raycaster.ray.origin.clone();

  			// Translate the ray to the center of the octree.
  			origin.sub(root.center()).add(halfSize);

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

  				origin.x = size.x - origin.x;
  				direction.x = -direction.x;
  				flags[8] |= flags[4];
  			}

  			if (direction.y < 0.0) {

  				origin.y = size.y - origin.y;
  				direction.y = -direction.y;
  				flags[8] |= flags[2];
  			}

  			if (direction.z < 0.0) {

  				origin.z = size.z - origin.z;
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

  				raycastOctant(root, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, octants);
  			}
  		}

  		/**
     * Collects points that intersect with the ray.
     *
     * @method testPoints
     * @static
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
  			    point = void 0,
  			    dataSet = void 0,
  			    data = void 0;

  			for (i = 0, il = octants.length; i < il; ++i) {

  				octant = octants[i];

  				for (j = 0, jl = octant.totalPoints; j < jl; ++j) {

  					point = octant.points[j];
  					rayPointDistanceSq = raycaster.ray.distanceSqToPoint(point);

  					if (rayPointDistanceSq < thresholdSq) {

  						intersectPoint = raycaster.ray.closestPointToPoint(point);
  						distance = raycaster.ray.origin.distanceTo(intersectPoint);

  						if (distance >= raycaster.near && distance <= raycaster.far) {

  							dataSet = octant.dataSets[j];
  							distanceToRay = Math.sqrt(rayPointDistanceSq);

  							if (dataSet.size > 0) {

  								// Unfold data aggregation.
  								var _iteratorNormalCompletion = true;
  								var _didIteratorError = false;
  								var _iteratorError = undefined;

  								try {
  									for (var _iterator = dataSet[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
  										data = _step.value;


  										intersects.push({
  											distance: distance,
  											distanceToRay: distanceToRay,
  											point: intersectPoint.clone(),
  											object: data
  										});
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
  							} else {

  								intersects.push({
  									distance: distance,
  									distanceToRay: distanceToRay,
  									point: intersectPoint.clone(),
  									object: null
  								});
  							}
  						}
  					}
  				}
  			}
  		}
  	}]);
  	return Raycasting;
  }();

  /**
   * An octree that subdivides space into regular cells for fast spatial searches.
   *
   * @class Octree
   * @constructor
   * @param {Vector3} min - The lower bounds of the tree.
   * @param {Vector3} max - The upper bounds of the tree.
   * @param {Number} [bias=0.0] - A threshold for proximity checks.
   * @param {Number} [maxPoints=8] - Number of distinct points per octant before it splits up.
   * @param {Number} [maxDepth=8] - The maximum tree depth level, starting at 0.
   */

  var Octree = function () {
  	function Octree(min, max, bias, maxPoints, maxDepth) {
  		classCallCheck(this, Octree);


  		/**
     * The root node.
     *
     * @property root
     * @type Octant
     * @private
     * @final
     */

  		this.root = new Octant(min, max, 0);

  		// Octant settings.
  		this.bias = bias;
  		this.maxDepth = maxDepth;
  		this.maxPoints = maxPoints;
  	}

  	/**
    * The children of the root node.
    *
    * @property children
    * @type Array
    */

  	createClass(Octree, [{
  		key: "add",


  		/**
     * Adds a point to the tree.
     *
     * @method add
     * @param {Vector3} p - A point.
     * @param {Object} [data] - An arbitrary object that will be associated with the point.
     */

  		value: function add(p, data) {

  			if (this.root.containsPoint(p, this.bias)) {

  				this.root.add(p.clone(), data);
  			}
  		}

  		/**
     * Adds all points from the given array of position triples to the tree.
     *
     * @method addPoints
     * @param {Float32Array} array - An array containing point position triples.
     * @param {Object} [data] - An arbitrary object that will be associated with the points.
     */

  	}, {
  		key: "addPoints",
  		value: function addPoints(array, data) {

  			var v = new Vector3();

  			var i = void 0,
  			    l = void 0;

  			for (i = 0, l = array.length; i < l; i += 3) {

  				this.add(v.fromArray(array, i).clone(), data);
  			}
  		}

  		/**
     * Removes a point from the tree.
     *
     * @method remove
     * @param {Vector3} p - A point.
     * @param {Object} [data] - An object that is associated with the point.
     */

  	}, {
  		key: "remove",
  		value: function remove(p, data) {

  			if (this.root.containsPoint(p, this.bias)) {

  				this.root.remove(p, data);
  			}
  		}

  		/**
     * Removes all points from the tree that are in the given array of position 
     * triples.
     *
     * @method removePoints
     * @param {Float32Array} array - An array containing point position triples.
     * @param {Object} [data] - An object that is associated with the points.
     */

  	}, {
  		key: "removePoints",
  		value: function removePoints(array, data) {

  			var v = new Vector3();

  			var i = void 0,
  			    l = void 0;

  			for (i = 0, l = array.length; i < l; i += 3) {

  				this.remove(v.fromArray(array, i), data);
  			}
  		}

  		/**
     * Retrieves the data of the point at the specified position.
     *
     * @method fetch
     * @param {Vector3} p - A position.
     * @return {Set} A set of data entries that are associated with the given point or null if it doesn't exist.
     */

  	}, {
  		key: "fetch",
  		value: function fetch(p) {

  			return this.root.fetch(p);
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
  		value: function findNearestPoint(p, maxDistance, skipSelf) {

  			if (maxDistance === undefined) {
  				maxDistance = Infinity;
  			}
  			if (skipSelf === undefined) {
  				skipSelf = false;
  			}

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
  		value: function findPoints(p, r, skipSelf) {

  			if (skipSelf === undefined) {
  				skipSelf = false;
  			}

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

  			Raycasting.raycast(this, raycaster, octants);

  			if (octants.length > 0) {

  				// Collect intersecting points.
  				Raycasting.testPoints(octants, raycaster, intersects);
  			}
  		}

  		/**
     * Collects octants that lie inside the specified frustum.
     *
     * @method cull
     * @param {Frustum} frustum - A frustum.
     * @return {Array} The octants.
     */

  	}, {
  		key: "cull",
  		value: function cull(frustum) {

  			var result = [];

  			this.root.cull(frustum, result);

  			return result;
  		}

  		/**
     * Fetches all nodes with the specified level.
     *
     * @method getOctantsByLevel
     * @param {Number} level - The depth level.
     * @return {Array} The nodes.
     */

  	}, {
  		key: "getOctantsByLevel",
  		value: function getOctantsByLevel(level) {

  			var result = [];

  			this.root.getOctantsByLevel(level, result);

  			return result;
  		}

  		/**
     * Returns the amount of points that are currently in the tree.
     *
     * @method getTotalPoints
     * @return {Number} The total amount of points in the tree.
     */

  	}, {
  		key: "getTotalPoints",
  		value: function getTotalPoints() {

  			return this.root.totalPoints;
  		}

  		/**
     * Calculates the current tree depth.
     *
     * @method getDepth
     * @return {Number} The depth.
     */

  	}, {
  		key: "getDepth",
  		value: function getDepth() {

  			return this.root.getDepth();
  		}
  	}, {
  		key: "children",
  		get: function get() {
  			return this.root.children;
  		}

  		/**
     * A threshold for proximity checks.
     *
     * @property bias
     * @type Number
     * @default 0.0
     */

  	}, {
  		key: "bias",
  		get: function get() {
  			return Octant.bias;
  		},
  		set: function set(x) {

  			if (typeof x === "number") {

  				Octant.bias = Math.max(0.0, x);
  				Octant.biasSquared = Octant.bias * Octant.bias;
  			}
  		}

  		/**
     * The maximum tree depth level.
     * Setting this value refreshes the entire tree.
     *
     * It's possible to set this value to Infinity, but be aware that allowing 
     * infinitely small octants can have a negative impact on performance. Finding 
     * a value that works best for a specific scene is advisable.
     *
     * @property maxDepth
     * @type Number
     * @default 8
     */

  	}, {
  		key: "maxDepth",
  		get: function get() {
  			return Octant.maxDepth;
  		},
  		set: function set(x) {

  			if (typeof x === "number") {

  				Octant.maxDepth = Math.max(0, Math.round(x));
  				this.root.update();
  			}
  		}

  		/**
     * Number of points per octant before a split occurs. Setting this value 
     * refreshes the entire tree.
     *
     * This value works together with the maximum depth as a secondary limiting 
     * factor. Smaller values cause splits to occur earlier which results in a 
     * faster and deeper tree growth.
     *
     * @property maxPoints
     * @type Number
     * @default 8
     */

  	}, {
  		key: "maxPoints",
  		get: function get() {
  			return Octant.maxPoints;
  		},
  		set: function set(x) {

  			if (typeof x === "number") {

  				Octant.maxPoints = Math.max(1, Math.round(x));
  				this.root.update();
  			}
  		}
  	}]);
  	return Octree;
  }();

  /**
   * An octree helper.
   *
   * @class OctreeHelper
   * @constructor
   * @extends Object3D
   * @param {Octree} tree - The octree to visualise.
   */

  var OctreeHelper = function (_THREE$Object3D) {
  		inherits(OctreeHelper, _THREE$Object3D);

  		function OctreeHelper(tree) {
  				classCallCheck(this, OctreeHelper);

  				var _this = possibleConstructorReturn(this, Object.getPrototypeOf(OctreeHelper).call(this));

  				_this.name = "OctreeHelper";

  				/**
       * The octree.
       *
       * @property tree
       * @type Octree
       */

  				_this.tree = tree !== undefined ? tree : null;

  				_this.update();

  				return _this;
  		}

  		/**
     * Updates the helper geometry.
     *
     * @method update
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

  								octants = this.tree.getOctantsByLevel(level);

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

  								//console.log("level:", level, "vertices:", vertexMap.size, "ids:", indexCount * 2);

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

  										material = new THREE.LineBasicMaterial({ color: new THREE.Color(0xffffff * Math.random()) });
  										lineSegments = new THREE.LineSegments(geometry, material);

  										this.add(lineSegments);
  								} else {

  										console.warn("Could not create geometry for Octree depth level", level, "(vertex count of", vertexMap.size, "exceeds limit of 65536)");
  								}

  								++level;
  						}
  				}
  		}]);
  		return OctreeHelper;
  }(THREE.Object3D);

  exports.Octree = Octree;
  exports.Octant = Octant;
  exports.OctreeHelper = OctreeHelper;
  exports.Raycasting = Raycasting;

}));