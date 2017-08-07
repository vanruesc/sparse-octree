(function (three,dat,Stats) {
  'use strict';

  dat = dat && dat.hasOwnProperty('default') ? dat['default'] : dat;
  Stats = Stats && Stats.hasOwnProperty('default') ? Stats['default'] : Stats;

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

  var OctreeHelper = function (_Object3D) {
  		inherits(OctreeHelper, _Object3D);

  		function OctreeHelper() {
  				var octree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  				classCallCheck(this, OctreeHelper);

  				var _this = possibleConstructorReturn(this, (OctreeHelper.__proto__ || Object.getPrototypeOf(OctreeHelper)).call(this));

  				_this.name = "OctreeHelper";

  				_this.octree = octree;

  				_this.update();

  				return _this;
  		}

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

  						for (i = 0, length = 0, n = Math.ceil(octantCount / maxOctants); n > 0; --n) {

  								length += octantCount < maxOctants ? octantCount : maxOctants;
  								octantCount -= maxOctants;

  								vertexCount = length * 8;
  								indices = new Uint16Array(vertexCount * 3);
  								positions = new Float32Array(vertexCount * 3);

  								for (c = 0, d = 0; i < length; ++i) {

  										octant = octants[i];
  										min = octant.min;
  										max = octant.max;

  										for (j = 0; j < 12; ++j) {

  												edge = edges[j];

  												indices[d++] = c + edge[0];
  												indices[d++] = c + edge[1];
  										}

  										for (j = 0; j < 8; ++j, ++c) {

  												corner = corners[j];

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
  		}, {
  				key: "update",
  				value: function update() {

  						var depth = this.octree !== null ? this.octree.getDepth() : -1;

  						var level = 0;

  						this.dispose();

  						while (level <= depth) {

  								this.createLineSegments(this.octree.findOctantsByLevel(level));

  								++level;
  						}
  				}
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

  var corners = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];

  var edges = [new Uint8Array([0, 4]), new Uint8Array([1, 5]), new Uint8Array([2, 6]), new Uint8Array([3, 7]), new Uint8Array([0, 2]), new Uint8Array([1, 3]), new Uint8Array([4, 6]), new Uint8Array([5, 7]), new Uint8Array([0, 1]), new Uint8Array([2, 3]), new Uint8Array([4, 5]), new Uint8Array([6, 7])];

  var Vector2$1 = function () {
  	function Vector2$$1() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		classCallCheck(this, Vector2$$1);


  		this.x = x;

  		this.y = y;
  	}

  	createClass(Vector2$$1, [{
  		key: "set",
  		value: function set$$1(x, y) {

  			this.x = x;
  			this.y = y;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(v) {

  			this.x = v.x;
  			this.y = v.y;

  			return this;
  		}
  	}, {
  		key: "fromArray",
  		value: function fromArray(array) {
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			this.x = array[offset];
  			this.y = array[offset + 1];

  			return this;
  		}
  	}, {
  		key: "toArray",
  		value: function toArray$$1() {
  			var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			array[offset] = this.x;
  			array[offset + 1] = this.y;

  			return array;
  		}
  	}, {
  		key: "equals",
  		value: function equals(v) {

  			return v.x === this.x && v.y === this.y;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.x, this.y);
  		}
  	}, {
  		key: "add",
  		value: function add(v) {

  			this.x += v.x;
  			this.y += v.y;

  			return this;
  		}
  	}, {
  		key: "addScaledVector",
  		value: function addScaledVector(v, s) {

  			this.x += v.x * s;
  			this.y += v.y * s;

  			return this;
  		}
  	}, {
  		key: "addScalar",
  		value: function addScalar(s) {

  			this.x += s;
  			this.y += s;

  			return this;
  		}
  	}, {
  		key: "addVectors",
  		value: function addVectors(a, b) {

  			this.x = a.x + b.x;
  			this.y = a.y + b.y;

  			return this;
  		}
  	}, {
  		key: "sub",
  		value: function sub(v) {

  			this.x -= v.x;
  			this.y -= v.y;

  			return this;
  		}
  	}, {
  		key: "subScalar",
  		value: function subScalar(s) {

  			this.x -= s;
  			this.y -= s;

  			return this;
  		}
  	}, {
  		key: "subVectors",
  		value: function subVectors(a, b) {

  			this.x = a.x - b.x;
  			this.y = a.y - b.y;

  			return this;
  		}
  	}, {
  		key: "multiply",
  		value: function multiply(v) {

  			this.x *= v.x;
  			this.y *= v.y;

  			return this;
  		}
  	}, {
  		key: "multiplyScalar",
  		value: function multiplyScalar(s) {

  			if (isFinite(s)) {

  				this.x *= s;
  				this.y *= s;
  			} else {

  				this.x = 0;
  				this.y = 0;
  			}

  			return this;
  		}
  	}, {
  		key: "multiplyVectors",
  		value: function multiplyVectors(a, b) {

  			this.x = a.x * b.x;
  			this.y = a.y * b.y;

  			return this;
  		}
  	}, {
  		key: "divide",
  		value: function divide(v) {

  			this.x /= v.x;
  			this.y /= v.y;

  			return this;
  		}
  	}, {
  		key: "divideScalar",
  		value: function divideScalar(s) {

  			return this.multiplyScalar(1 / s);
  		}
  	}, {
  		key: "divideVectors",
  		value: function divideVectors(a, b) {

  			this.x = a.x / b.x;
  			this.y = a.y / b.y;

  			return this;
  		}
  	}, {
  		key: "negate",
  		value: function negate() {

  			this.x = -this.x;
  			this.y = -this.y;

  			return this;
  		}
  	}, {
  		key: "dot",
  		value: function dot(v) {

  			return this.x * v.x + this.y * v.y;
  		}
  	}, {
  		key: "lengthSq",
  		value: function lengthSq() {

  			return this.x * this.x + this.y * this.y;
  		}
  	}, {
  		key: "length",
  		value: function length() {

  			return Math.sqrt(this.x * this.x + this.y * this.y);
  		}
  	}, {
  		key: "distanceTo",
  		value: function distanceTo(v) {

  			return Math.sqrt(this.distanceToSquared(v));
  		}
  	}, {
  		key: "distanceToSquared",
  		value: function distanceToSquared(v) {

  			var dx = this.x - v.x;
  			var dy = this.y - v.y;

  			return dx * dx + dy * dy;
  		}
  	}, {
  		key: "normalize",
  		value: function normalize() {

  			return this.divideScalar(this.length());
  		}
  	}, {
  		key: "min",
  		value: function min(v) {

  			this.x = Math.min(this.x, v.x);
  			this.y = Math.min(this.y, v.y);

  			return this;
  		}
  	}, {
  		key: "max",
  		value: function max(v) {

  			this.x = Math.max(this.x, v.x);
  			this.y = Math.max(this.y, v.y);

  			return this;
  		}
  	}, {
  		key: "clamp",
  		value: function clamp(min, max) {

  			this.x = Math.max(min.x, Math.min(max.x, this.x));
  			this.y = Math.max(min.y, Math.min(max.y, this.y));

  			return this;
  		}
  	}]);
  	return Vector2$$1;
  }();

  var Vector3$1 = function () {
  	function Vector3$$1() {
  		var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  		var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  		classCallCheck(this, Vector3$$1);


  		this.x = x;

  		this.y = y;

  		this.z = z;
  	}

  	createClass(Vector3$$1, [{
  		key: "set",
  		value: function set$$1(x, y, z) {

  			this.x = x;
  			this.y = y;
  			this.z = z;

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(v) {

  			this.x = v.x;
  			this.y = v.y;
  			this.z = v.z;

  			return this;
  		}
  	}, {
  		key: "fromArray",
  		value: function fromArray(array) {
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			this.x = array[offset];
  			this.y = array[offset + 1];
  			this.z = array[offset + 2];

  			return this;
  		}
  	}, {
  		key: "toArray",
  		value: function toArray$$1() {
  			var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  			var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


  			array[offset] = this.x;
  			array[offset + 1] = this.y;
  			array[offset + 2] = this.z;

  			return array;
  		}
  	}, {
  		key: "equals",
  		value: function equals(v) {

  			return v.x === this.x && v.y === this.y && v.z === this.z;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor(this.x, this.y, this.z);
  		}
  	}, {
  		key: "add",
  		value: function add(v) {

  			this.x += v.x;
  			this.y += v.y;
  			this.z += v.z;

  			return this;
  		}
  	}, {
  		key: "addScaledVector",
  		value: function addScaledVector(v, s) {

  			this.x += v.x * s;
  			this.y += v.y * s;
  			this.z += v.z * s;

  			return this;
  		}
  	}, {
  		key: "addScalar",
  		value: function addScalar(s) {

  			this.x += s;
  			this.y += s;
  			this.z += s;

  			return this;
  		}
  	}, {
  		key: "addVectors",
  		value: function addVectors(a, b) {

  			this.x = a.x + b.x;
  			this.y = a.y + b.y;
  			this.z = a.z + b.z;

  			return this;
  		}
  	}, {
  		key: "sub",
  		value: function sub(v) {

  			this.x -= v.x;
  			this.y -= v.y;
  			this.z -= v.z;

  			return this;
  		}
  	}, {
  		key: "subScalar",
  		value: function subScalar(s) {

  			this.x -= s;
  			this.y -= s;
  			this.z -= s;

  			return this;
  		}
  	}, {
  		key: "subVectors",
  		value: function subVectors(a, b) {

  			this.x = a.x - b.x;
  			this.y = a.y - b.y;
  			this.z = a.z - b.z;

  			return this;
  		}
  	}, {
  		key: "multiply",
  		value: function multiply(v) {

  			this.x *= v.x;
  			this.y *= v.y;
  			this.z *= v.z;

  			return this;
  		}
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
  	}, {
  		key: "multiplyVectors",
  		value: function multiplyVectors(a, b) {

  			this.x = a.x * b.x;
  			this.y = a.y * b.y;
  			this.z = a.z * b.z;

  			return this;
  		}
  	}, {
  		key: "divide",
  		value: function divide(v) {

  			this.x /= v.x;
  			this.y /= v.y;
  			this.z /= v.z;

  			return this;
  		}
  	}, {
  		key: "divideScalar",
  		value: function divideScalar(s) {

  			return this.multiplyScalar(1 / s);
  		}
  	}, {
  		key: "divideVectors",
  		value: function divideVectors(a, b) {

  			this.x = a.x / b.x;
  			this.y = a.y / b.y;
  			this.z = a.z / b.z;

  			return this;
  		}
  	}, {
  		key: "negate",
  		value: function negate() {

  			this.x = -this.x;
  			this.y = -this.y;
  			this.z = -this.z;

  			return this;
  		}
  	}, {
  		key: "dot",
  		value: function dot(v) {

  			return this.x * v.x + this.y * v.y + this.z * v.z;
  		}
  	}, {
  		key: "lengthSq",
  		value: function lengthSq() {

  			return this.x * this.x + this.y * this.y + this.z * this.z;
  		}
  	}, {
  		key: "length",
  		value: function length() {

  			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  		}
  	}, {
  		key: "distanceTo",
  		value: function distanceTo(v) {

  			return Math.sqrt(this.distanceToSquared(v));
  		}
  	}, {
  		key: "distanceToSquared",
  		value: function distanceToSquared(v) {

  			var dx = this.x - v.x;
  			var dy = this.y - v.y;
  			var dz = this.z - v.z;

  			return dx * dx + dy * dy + dz * dz;
  		}
  	}, {
  		key: "normalize",
  		value: function normalize() {

  			return this.divideScalar(this.length());
  		}
  	}, {
  		key: "min",
  		value: function min(v) {

  			this.x = Math.min(this.x, v.x);
  			this.y = Math.min(this.y, v.y);
  			this.z = Math.min(this.z, v.z);

  			return this;
  		}
  	}, {
  		key: "max",
  		value: function max(v) {

  			this.x = Math.max(this.x, v.x);
  			this.y = Math.max(this.y, v.y);
  			this.z = Math.max(this.z, v.z);

  			return this;
  		}
  	}, {
  		key: "clamp",
  		value: function clamp(min, max) {

  			this.x = Math.max(min.x, Math.min(max.x, this.x));
  			this.y = Math.max(min.y, Math.min(max.y, this.y));
  			this.z = Math.max(min.z, Math.min(max.z, this.z));

  			return this;
  		}
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
  	return Vector3$$1;
  }();

  var Box3$1 = function () {
  	function Box3$$1() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1(Infinity, Infinity, Infinity);
  		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1(-Infinity, -Infinity, -Infinity);
  		classCallCheck(this, Box3$$1);


  		this.min = min;

  		this.max = max;
  	}

  	createClass(Box3$$1, [{
  		key: "set",
  		value: function set$$1(min, max) {

  			this.min.copy(min);
  			this.max.copy(max);

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(b) {

  			this.min.copy(b.min);
  			this.max.copy(b.max);

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "expandByPoint",
  		value: function expandByPoint(p) {

  			this.min.min(p);
  			this.max.max(p);

  			return this;
  		}
  	}, {
  		key: "union",
  		value: function union(b) {

  			this.min.min(b.min);
  			this.max.max(b.max);

  			return this;
  		}
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
  	}, {
  		key: "setFromCenterAndSize",
  		value: function setFromCenterAndSize(center, size) {

  			var halfSize = size.clone().multiplyScalar(0.5);

  			this.min.copy(center).sub(halfSize);
  			this.max.copy(center).add(halfSize);

  			return this;
  		}
  	}, {
  		key: "intersectsBox",
  		value: function intersectsBox(box) {

  			return !(box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y || box.max.z < this.min.z || box.min.z > this.max.z);
  		}
  	}]);
  	return Box3$$1;
  }();

  var Matrix3 = function () {
  	function Matrix3() {
  		classCallCheck(this, Matrix3);


  		this.elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  	}

  	createClass(Matrix3, [{
  		key: "set",
  		value: function set$$1(m00, m01, m02, m10, m11, m12, m20, m21, m22) {

  			var te = this.elements;

  			te[0] = m00;te[3] = m01;te[6] = m02;
  			te[1] = m10;te[4] = m11;te[7] = m12;
  			te[2] = m20;te[5] = m21;te[8] = m22;

  			return this;
  		}
  	}, {
  		key: "identity",
  		value: function identity() {

  			this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(m) {

  			var me = m.elements;

  			return this.set(me[0], me[3], me[6], me[1], me[4], me[7], me[2], me[5], me[8]);
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}]);
  	return Matrix3;
  }();

  var SymmetricMatrix3 = function () {
  	function SymmetricMatrix3() {
  		classCallCheck(this, SymmetricMatrix3);


  		this.elements = new Float32Array([1, 0, 0, 1, 0, 1]);
  	}

  	createClass(SymmetricMatrix3, [{
  		key: "set",
  		value: function set$$1(m00, m01, m02, m11, m12, m22) {

  			var e = this.elements;

  			e[0] = m00;
  			e[1] = m01;e[3] = m11;
  			e[2] = m02;e[4] = m12;e[5] = m22;

  			return this;
  		}
  	}, {
  		key: "identity",
  		value: function identity() {

  			this.set(1, 0, 0, 1, 0, 1);

  			return this;
  		}
  	}, {
  		key: "copy",
  		value: function copy(m) {

  			var me = m.elements;

  			this.set(me[0], me[1], me[2], me[3], me[4], me[5]);

  			return this;
  		}
  	}, {
  		key: "clone",
  		value: function clone() {

  			return new this.constructor().copy(this);
  		}
  	}, {
  		key: "toMatrix3",
  		value: function toMatrix3(m) {

  			var me = m.elements;

  			m.set(me[0], me[1], me[2], me[1], me[3], me[4], me[2], me[4], me[5]);
  		}
  	}, {
  		key: "add",
  		value: function add(m) {

  			var te = this.elements;
  			var me = m.elements;

  			te[0] += me[0];
  			te[1] += me[1];te[3] += me[3];
  			te[2] += me[2];te[4] += me[4];te[5] += me[5];

  			return this;
  		}
  	}, {
  		key: "norm",
  		value: function norm() {

  			var e = this.elements;

  			var m01m01 = e[1] * e[1];
  			var m02m02 = e[2] * e[2];
  			var m12m12 = e[4] * e[4];

  			return Math.sqrt(e[0] * e[0] + m01m01 + m02m02 + m01m01 + e[3] * e[3] + m12m12 + m02m02 + m12m12 + e[5] * e[5]);
  		}
  	}, {
  		key: "off",
  		value: function off() {

  			var e = this.elements;

  			return Math.sqrt(2 * (e[1] * e[1] + e[2] * e[2] + e[4] * e[4]));
  		}
  	}, {
  		key: "applyToVector3",
  		value: function applyToVector3(v) {

  			var x = v.x,
  			    y = v.y,
  			    z = v.z;
  			var e = this.elements;

  			v.x = e[0] * x + e[1] * y + e[2] * z;
  			v.y = e[1] * x + e[3] * y + e[4] * z;
  			v.z = e[2] * x + e[4] * y + e[5] * z;

  			return v;
  		}
  	}], [{
  		key: "calculateIndex",
  		value: function calculateIndex(i, j) {

  			return 3 - (3 - i) * (2 - i) / 2 + j;
  		}
  	}]);
  	return SymmetricMatrix3;
  }();

  var c$1 = new Vector3$1();

  var Octant = function () {
  	function Octant() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();
  		var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3$1();
  		classCallCheck(this, Octant);


  		this.min = min;

  		this.max = max;

  		this.children = null;
  	}

  	createClass(Octant, [{
  		key: "getCenter",
  		value: function getCenter() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.copy(this.min).add(this.max).multiplyScalar(0.5);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.copy(this.max).sub(this.min);
  		}
  	}, {
  		key: "split",
  		value: function split() {

  			var min = this.min;
  			var max = this.max;
  			var mid = this.getCenter(c$1);

  			var children = this.children = [null, null, null, null, null, null, null, null];

  			var i = void 0,
  			    combination = void 0;

  			for (i = 0; i < 8; ++i) {

  				combination = pattern[i];

  				children[i] = new this.constructor(new Vector3$1(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), new Vector3$1(combination[0] === 0 ? mid.x : max.x, combination[1] === 0 ? mid.y : max.y, combination[2] === 0 ? mid.z : max.z));
  			}
  		}
  	}]);
  	return Octant;
  }();

  var pattern = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];

  var c = new Vector3$1();

  var CubicOctant = function () {
  	function CubicOctant() {
  		var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();
  		var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  		classCallCheck(this, CubicOctant);


  		this.min = min;

  		this.size = size;

  		this.children = null;
  	}

  	createClass(CubicOctant, [{
  		key: "getCenter",
  		value: function getCenter() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.copy(this.min).addScalar(this.size * 0.5);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions() {
  			var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3$1();


  			return target.set(this.size, this.size, this.size);
  		}
  	}, {
  		key: "split",
  		value: function split() {

  			var min = this.min;
  			var mid = this.getCenter(c);
  			var halfSize = this.size * 0.5;

  			var children = this.children = [null, null, null, null, null, null, null, null];

  			var i = void 0,
  			    combination = void 0;

  			for (i = 0; i < 8; ++i) {

  				combination = pattern[i];

  				children[i] = new this.constructor(new Vector3$1(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), halfSize);
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

  var IteratorResult = function () {
  	function IteratorResult() {
  		var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  		var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  		classCallCheck(this, IteratorResult);


  		this.value = value;

  		this.done = done;
  	}

  	createClass(IteratorResult, [{
  		key: "reset",
  		value: function reset() {

  			this.value = null;
  			this.done = false;
  		}
  	}]);
  	return IteratorResult;
  }();

  var b$1 = new Box3$1();

  var OctreeIterator = function () {
  		function OctreeIterator(octree) {
  				var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  				classCallCheck(this, OctreeIterator);


  				this.octree = octree;

  				this.region = region;

  				this.cull = region !== null;

  				this.result = new IteratorResult();

  				this.trace = null;

  				this.indices = null;

  				this.reset();
  		}

  		createClass(OctreeIterator, [{
  				key: "reset",
  				value: function reset() {

  						var root = this.octree.root;

  						this.trace = [];
  						this.indices = [];

  						if (root !== null) {

  								b$1.min = root.min;
  								b$1.max = root.max;

  								if (!this.cull || this.region.intersectsBox(b$1)) {

  										this.trace.push(root);
  										this.indices.push(0);
  								}
  						}

  						this.result.reset();

  						return this;
  				}
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

  														b$1.min = child.min;
  														b$1.max = child.max;

  														if (!region.intersectsBox(b$1)) {
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
  		}, {
  				key: "return",
  				value: function _return(value) {

  						this.result.value = value;
  						this.result.done = true;

  						return this.result;
  				}
  		}, {
  				key: Symbol.iterator,
  				value: function value() {

  						return this;
  				}
  		}]);
  		return OctreeIterator;
  }();

  var flags = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 0]);

  var octantTable = [new Uint8Array([4, 2, 1]), new Uint8Array([5, 3, 8]), new Uint8Array([6, 8, 3]), new Uint8Array([7, 8, 8]), new Uint8Array([8, 6, 5]), new Uint8Array([8, 7, 8]), new Uint8Array([8, 8, 7]), new Uint8Array([8, 8, 8])];

  function findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {

  	var entry = 0;

  	if (tx0 > ty0 && tx0 > tz0) {
  		if (tym < tx0) {
  			entry = entry | 2;
  		}
  		if (tzm < tx0) {
  			entry = entry | 1;
  		}
  	} else if (ty0 > tz0) {
  		if (txm < ty0) {
  			entry = entry | 4;
  		}
  		if (tzm < ty0) {
  			entry = entry | 1;
  		}
  	} else {
  		if (txm < tz0) {
  			entry = entry | 4;
  		}
  		if (tym < tz0) {
  			entry = entry | 2;
  		}
  	}

  	return entry;
  }

  function findNextOctant(currentOctant, tx1, ty1, tz1) {

  	var min = void 0;
  	var exit = 0;

  	if (tx1 < ty1) {

  		min = tx1;
  		exit = 0;
  	} else {

  		min = ty1;
  		exit = 1;
  	}

  	if (tz1 < min) {

  		exit = 2;
  	}

  	return octantTable[currentOctant][exit];
  }

  function raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects) {

  	var children = octant.children;

  	var currentOctant = void 0;
  	var txm = void 0,
  	    tym = void 0,
  	    tzm = void 0;

  	if (tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

  		if (children === null) {
  			intersects.push(octant);
  		} else {
  			txm = 0.5 * (tx0 + tx1);
  			tym = 0.5 * (ty0 + ty1);
  			tzm = 0.5 * (tz0 + tz1);

  			currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

  			do {

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

  						currentOctant = 8;
  						break;

  				}
  			} while (currentOctant < 8);
  		}
  	}
  }

  var dimensions = new Vector3$1();

  var halfDimensions = new Vector3$1();

  var center = new Vector3$1();

  var min = new Vector3$1();

  var max = new Vector3$1();

  var direction = new Vector3$1();

  var origin = new Vector3$1();

  var OctreeRaycaster = function () {
  	function OctreeRaycaster() {
  		classCallCheck(this, OctreeRaycaster);
  	}

  	createClass(OctreeRaycaster, null, [{
  		key: "intersectOctree",
  		value: function intersectOctree(octree, raycaster, intersects) {

  			var invDirX = void 0,
  			    invDirY = void 0,
  			    invDirZ = void 0;
  			var tx0 = void 0,
  			    tx1 = void 0,
  			    ty0 = void 0,
  			    ty1 = void 0,
  			    tz0 = void 0,
  			    tz1 = void 0;

  			octree.getDimensions(dimensions);
  			halfDimensions.copy(dimensions).multiplyScalar(0.5);

  			min.copy(octree.min).sub(octree.min);
  			max.copy(octree.max).sub(octree.min);

  			direction.copy(raycaster.ray.direction);
  			origin.copy(raycaster.ray.origin);

  			origin.sub(octree.getCenter(center)).add(halfDimensions);

  			flags[8] = flags[0];

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

  			invDirX = 1.0 / direction.x;
  			invDirY = 1.0 / direction.y;
  			invDirZ = 1.0 / direction.z;

  			tx0 = (min.x - origin.x) * invDirX;
  			tx1 = (max.x - origin.x) * invDirX;
  			ty0 = (min.y - origin.y) * invDirY;
  			ty1 = (max.y - origin.y) * invDirY;
  			tz0 = (min.z - origin.z) * invDirZ;
  			tz1 = (max.z - origin.z) * invDirZ;

  			if (Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1)) {
  				raycastOctant(octree.root, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects);
  			}
  		}
  	}]);
  	return OctreeRaycaster;
  }();

  var b = new Box3$1();

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

  function _cull(octant, region, result) {

  	var children = octant.children;

  	var i = void 0,
  	    l = void 0;

  	b.min = octant.min;
  	b.max = octant.max;

  	if (region.intersectsBox(b)) {

  		if (children !== null) {

  			for (i = 0, l = children.length; i < l; ++i) {

  				_cull(children[i], region, result);
  			}
  		} else {

  			result.push(octant);
  		}
  	}
  }

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

  var Octree = function () {
  	function Octree(min, max) {
  		classCallCheck(this, Octree);


  		this.root = min !== undefined && max !== undefined ? new Octant(min, max) : null;
  	}

  	createClass(Octree, [{
  		key: "getCenter",
  		value: function getCenter(target) {
  			return this.root.getCenter(target);
  		}
  	}, {
  		key: "getDimensions",
  		value: function getDimensions(target) {
  			return this.root.getDimensions(target);
  		}
  	}, {
  		key: "getDepth",
  		value: function getDepth() {
  			return _getDepth(this.root);
  		}
  	}, {
  		key: "cull",
  		value: function cull(region) {

  			var result = [];

  			_cull(this.root, region, result);

  			return result;
  		}
  	}, {
  		key: "findOctantsByLevel",
  		value: function findOctantsByLevel(level) {

  			var result = [];

  			_findOctantsByLevel(this.root, level, 0, result);

  			return result;
  		}
  	}, {
  		key: "raycast",
  		value: function raycast(raycaster) {
  			var intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


  			OctreeRaycaster.intersectOctree(this, raycaster, intersects);

  			return intersects;
  		}
  	}, {
  		key: "leaves",
  		value: function leaves(region) {

  			return new OctreeIterator(this, region);
  		}
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
  	}, {
  		key: "max",
  		get: function get$$1() {
  			return this.root.max;
  		}
  	}, {
  		key: "children",
  		get: function get$$1() {
  			return this.root.children;
  		}
  	}]);
  	return Octree;
  }();

  var p = new Vector3$1();

  var PointOctant = function (_Octant) {
  	inherits(PointOctant, _Octant);

  	function PointOctant(min, max) {
  		classCallCheck(this, PointOctant);

  		var _this = possibleConstructorReturn(this, (PointOctant.__proto__ || Object.getPrototypeOf(PointOctant)).call(this, min, max));

  		_this.points = null;

  		_this.data = null;

  		return _this;
  	}

  	createClass(PointOctant, [{
  		key: "distanceToSquared",
  		value: function distanceToSquared(point) {

  			var clampedPoint = p.copy(point).clamp(this.min, this.max);

  			return clampedPoint.sub(p).lengthSq();
  		}
  	}, {
  		key: "distanceToCenterSquared",
  		value: function distanceToCenterSquared(point) {

  			var center = this.getCenter(p);

  			var dx = point.x - center.x;
  			var dy = point.y - center.x;
  			var dz = point.z - center.z;

  			return dx * dx + dy * dy + dz * dz;
  		}
  	}, {
  		key: "contains",
  		value: function contains(point, bias) {

  			var min = this.min;
  			var max = this.max;

  			return point.x >= min.x - bias && point.y >= min.y - bias && point.z >= min.z - bias && point.x <= max.x + bias && point.y <= max.y + bias && point.z <= max.z + bias;
  		}
  	}, {
  		key: "redistribute",
  		value: function redistribute(bias) {

  			var children = this.children;
  			var points = this.points;
  			var data = this.data;

  			var i = void 0,
  			    j = void 0,
  			    il = void 0,
  			    jl = void 0;
  			var child = void 0,
  			    point = void 0,
  			    entry = void 0;

  			if (children !== null) {

  				for (i = 0, il = points.length; i < il; ++i) {

  					point = points[i];
  					entry = data[i];

  					for (j = 0, jl = children.length; j < jl; ++j) {

  						child = children[j];

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

  var RayPointIntersection = function RayPointIntersection(distance, distanceToRay, point) {
  		var object = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  		classCallCheck(this, RayPointIntersection);


  		this.distance = distance;

  		this.distanceToRay = distanceToRay;

  		this.point = point;

  		this.object = object;
  };

  var THRESHOLD = 1e-6;

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

  function _put(point, data, octree, octant, depth) {

  	var children = octant.children;
  	var exists = false;
  	var done = false;
  	var i = void 0,
  	    l = void 0;

  	if (octant.contains(point, octree.bias)) {

  		if (children === null) {

  			if (octant.points === null) {

  				octant.points = [];
  				octant.data = [];
  			} else {

  				for (i = 0, l = octant.points.length; !exists && i < l; ++i) {

  					exists = octant.points[i].equals(point);
  				}
  			}

  			if (exists) {

  				octant.data[i - 1] = data;
  				done = true;
  			} else if (octant.points.length < octree.maxPoints || depth === octree.maxDepth) {

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

  		if (children !== null) {

  			++depth;

  			for (i = 0, l = children.length; !done && i < l; ++i) {

  				done = _put(point, data, octree, children[i], depth);
  			}
  		}
  	}

  	return done;
  }

  function _remove(point, octree, octant, parent) {

  	var children = octant.children;

  	var result = null;

  	var i = void 0,
  	    l = void 0;
  	var points = void 0,
  	    data = void 0,
  	    last = void 0;

  	if (octant.contains(point, octree.bias)) {

  		if (children !== null) {

  			for (i = 0, l = children.length; result === null && i < l; ++i) {

  				result = _remove(point, octree, children[i], octant);
  			}
  		} else if (octant.points !== null) {

  			points = octant.points;
  			data = octant.data;

  			for (i = 0, l = points.length; i < l; ++i) {

  				if (points[i].equals(point)) {

  					last = l - 1;
  					result = data[i];

  					if (i < last) {
  						points[i] = points[last];
  						data[i] = data[last];
  					}

  					points.pop();
  					data.pop();

  					--octree.pointCount;

  					if (parent !== null && _countPoints(parent) <= octree.maxPoints) {

  						parent.merge();
  					}

  					break;
  				}
  			}
  		}
  	}

  	return result;
  }

  function _fetch(point, octree, octant) {

  	var children = octant.children;

  	var result = null;

  	var i = void 0,
  	    l = void 0;
  	var points = void 0;

  	if (octant.contains(point, octree.bias)) {

  		if (children !== null) {

  			for (i = 0, l = children.length; result === null && i < l; ++i) {

  				result = _fetch(point, octree, children[i]);
  			}
  		} else {

  			points = octant.points;

  			for (i = 0, l = points.length; result === null && i < l; ++i) {

  				if (point.distanceToSquared(points[i]) <= THRESHOLD) {

  					result = octant.data[i];
  				}
  			}
  		}
  	}

  	return result;
  }

  function _move(point, position, octree, octant, parent, depth) {

  	var children = octant.children;

  	var result = null;

  	var i = void 0,
  	    l = void 0;
  	var points = void 0;

  	if (octant.contains(point, octree.bias)) {

  		if (octant.contains(position, octree.bias)) {
  			if (children !== null) {

  				++depth;

  				for (i = 0, l = children.length; result === null && i < l; ++i) {

  					result = _move(point, position, octree, children[i], octant, depth);
  				}
  			} else {
  				points = octant.points;

  				for (i = 0, l = points.length; i < l; ++i) {

  					if (point.distanceToSquared(points[i]) <= THRESHOLD) {
  						points[i].copy(position);
  						result = octant.data[i];

  						break;
  					}
  				}
  			}
  		} else {
  			result = _remove(point, octree, octant, parent);

  			_put(position, result, octree, parent, depth - 1);
  		}
  	}

  	return result;
  }

  function _findNearestPoint(point, maxDistance, skipSelf, octant) {

  	var points = octant.points;
  	var children = octant.children;

  	var result = null;
  	var bestDist = maxDistance;

  	var i = void 0,
  	    l = void 0;
  	var p = void 0,
  	    distSq = void 0;

  	var sortedChildren = void 0;
  	var child = void 0,
  	    childResult = void 0;

  	if (children !== null) {
  		sortedChildren = children.map(function (child) {
  			return {
  				octant: child,
  				distance: child.distanceToCenterSquared(point)
  			};
  		}).sort(function (a, b) {
  			return a.distance - b.distance;
  		});

  		for (i = 0, l = sortedChildren.length; i < l; ++i) {
  			child = sortedChildren[i].octant;

  			if (child.contains(point, bestDist)) {

  				childResult = _findNearestPoint(point, bestDist, skipSelf, child);

  				if (childResult !== null) {

  					distSq = childResult.point.distanceToSquared(point);

  					if ((!skipSelf || distSq > 0.0) && distSq < bestDist) {

  						bestDist = distSq;
  						result = childResult;
  					}
  				}
  			}
  		}
  	} else if (points !== null) {

  		for (i = 0, l = points.length; i < l; ++i) {

  			p = points[i];
  			distSq = point.distanceToSquared(p);

  			if ((!skipSelf || distSq > 0.0) && distSq < bestDist) {

  				bestDist = distSq;

  				result = {
  					point: p.clone(),
  					data: octant.data[i]
  				};
  			}
  		}
  	}

  	return result;
  }

  function _findPoints(point, radius, skipSelf, octant, result) {

  	var points = octant.points;
  	var children = octant.children;
  	var rSq = radius * radius;

  	var i = void 0,
  	    l = void 0;

  	var p = void 0,
  	    distSq = void 0;
  	var child = void 0;

  	if (children !== null) {

  		for (i = 0, l = children.length; i < l; ++i) {

  			child = children[i];

  			if (child.contains(point, radius)) {

  				_findPoints(point, radius, skipSelf, child, result);
  			}
  		}
  	} else if (points !== null) {

  		for (i = 0, l = points.length; i < l; ++i) {

  			p = points[i];
  			distSq = point.distanceToSquared(p);

  			if ((!skipSelf || distSq > 0.0) && distSq <= rSq) {

  				result.push({
  					point: p.clone(),
  					data: octant.data[i]
  				});
  			}
  		}
  	}
  }

  var PointOctree = function (_Octree) {
  	inherits(PointOctree, _Octree);

  	function PointOctree(min, max) {
  		var bias = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;
  		var maxPoints = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 8;
  		var maxDepth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 8;
  		classCallCheck(this, PointOctree);

  		var _this = possibleConstructorReturn(this, (PointOctree.__proto__ || Object.getPrototypeOf(PointOctree)).call(this));

  		_this.root = new PointOctant(min, max);

  		_this.bias = Math.max(0.0, bias);

  		_this.maxPoints = Math.max(1, Math.round(maxPoints));

  		_this.maxDepth = Math.max(0, Math.round(maxDepth));

  		_this.pointCount = 0;

  		return _this;
  	}

  	createClass(PointOctree, [{
  		key: "countPoints",
  		value: function countPoints(octant) {

  			return _countPoints(octant);
  		}
  	}, {
  		key: "put",
  		value: function put(point, data) {

  			return _put(point, data, this, this.root, 0);
  		}
  	}, {
  		key: "remove",
  		value: function remove(point) {

  			return _remove(point, this, this.root, null);
  		}
  	}, {
  		key: "fetch",
  		value: function fetch(point) {

  			return _fetch(point, this, this.root);
  		}
  	}, {
  		key: "move",
  		value: function move(point, position) {

  			return _move(point, position, this, this.root, null, 0);
  		}
  	}, {
  		key: "findNearestPoint",
  		value: function findNearestPoint(point) {
  			var maxDistance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
  			var skipSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


  			return _findNearestPoint(point, maxDistance, skipSelf, this.root);
  		}
  	}, {
  		key: "findPoints",
  		value: function findPoints(point, radius) {
  			var skipSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


  			var result = [];

  			_findPoints(point, radius, skipSelf, this.root, result);

  			return result;
  		}
  	}, {
  		key: "raycast",
  		value: function raycast(raycaster) {
  			var intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];


  			var octants = get(PointOctree.prototype.__proto__ || Object.getPrototypeOf(PointOctree.prototype), "raycast", this).call(this, raycaster);

  			if (octants.length > 0) {
  				this.testPoints(octants, raycaster, intersects);
  			}

  			return intersects;
  		}
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

  								intersects.push(new RayPointIntersection(distance, distanceToRay, intersectPoint, octant.data[j]));
  							}
  						}
  					}
  				}
  			}
  		}
  	}]);
  	return PointOctree;
  }(Octree);

  var OctreeUtils = function () {
  		function OctreeUtils() {
  				classCallCheck(this, OctreeUtils);
  		}

  		createClass(OctreeUtils, null, [{
  				key: "recycleOctants",
  				value: function recycleOctants(octant, octants) {

  						var a = new Vector3$1();
  						var b = new Vector3$1();
  						var c = new Vector3$1();

  						var min = octant.min;
  						var mid = octant.getCenter();
  						var halfDimensions = octant.getDimensions().multiplyScalar(0.5);

  						var children = octant.children;
  						var l = octants.length;

  						var i = void 0,
  						    j = void 0;
  						var combination = void 0,
  						    candidate = void 0;

  						for (i = 0; i < 8; ++i) {

  								combination = pattern[i];

  								b.addVectors(min, a.fromArray(combination).multiply(halfDimensions));
  								c.addVectors(mid, a.fromArray(combination).multiply(halfDimensions));

  								for (j = 0; j < l; ++j) {

  										candidate = octants[j];

  										if (candidate !== null && b.equals(candidate.min) && c.equals(candidate.max)) {

  												children[i] = candidate;
  												octants[j] = null;

  												break;
  										}
  								}
  						}
  				}
  		}]);
  		return OctreeUtils;
  }();

  var Demo = function () {
  		function Demo(renderer) {
  				classCallCheck(this, Demo);


  				this.renderer = renderer;

  				this.loadingManager = new three.LoadingManager();

  				this.assets = null;

  				this.scene = new three.Scene();
  				this.scene.fog = new three.FogExp2(0x0d0d0d, 0.0025);

  				this.camera = new three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);

  				this.controls = null;
  		}

  		createClass(Demo, [{
  				key: "load",
  				value: function load(callback) {
  						callback();
  				}
  		}, {
  				key: "initialise",
  				value: function initialise() {}
  		}, {
  				key: "render",
  				value: function render(delta) {}
  		}, {
  				key: "configure",
  				value: function configure(gui) {}
  		}, {
  				key: "reset",
  				value: function reset() {

  						var fog = this.scene.fog;

  						this.scene = new three.Scene();
  						this.scene.fog = fog;

  						if (this.controls !== null) {

  								this.controls.dispose();
  								this.controls = null;
  						}

  						return this;
  				}
  		}]);
  		return Demo;
  }();

  var mouse = new three.Vector2();

  var OctreeRaycaster$1 = function (_Raycaster) {
  		inherits(OctreeRaycaster, _Raycaster);

  		function OctreeRaycaster(octree, camera, object) {
  				classCallCheck(this, OctreeRaycaster);

  				var _this = possibleConstructorReturn(this, (OctreeRaycaster.__proto__ || Object.getPrototypeOf(OctreeRaycaster)).call(this));

  				_this.params.Points.threshold = 1e-1;

  				_this.octree = octree;

  				_this.camera = camera;

  				_this.object = object;

  				_this.enabled = true;

  				_this.delta = "";

  				_this.selectedObject = null;

  				_this.selectedPoint = new three.Mesh(new three.SphereBufferGeometry(0.2, 16, 16), new three.MeshBasicMaterial({
  						transparent: true,
  						color: 0x00ccff,
  						opacity: 0.75
  				}));

  				_this.selectedPoint.visible = false;

  				return _this;
  		}

  		createClass(OctreeRaycaster, [{
  				key: "handleEvent",
  				value: function handleEvent(event) {

  						switch (event.type) {

  								case "mousemove":
  										this.raycast(event);
  										break;

  						}
  				}
  		}, {
  				key: "raycast",
  				value: function raycast(event) {

  						var intersects = void 0;
  						var t0 = void 0,
  						    t = void 0,
  						    x = void 0;

  						mouse.x = event.clientX / window.innerWidth * 2 - 1;
  						mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  						this.setFromCamera(mouse, this.camera);

  						if (this.enabled) {
  								t0 = performance.now();
  								intersects = this.octree.raycast(this);
  								t = performance.now();
  						} else {
  								t0 = performance.now();
  								intersects = this.intersectObjects(this.object.children);
  								t = performance.now();
  						}

  						this.delta = (t - t0).toFixed(2) + " ms";

  						if (this.selectedObject !== null) {

  								this.selectedObject.material.color.setHex(0xc00000);
  								this.selectedObject = null;
  								this.selectedPoint.visible = false;
  						}

  						if (intersects.length > 0) {

  								x = intersects[0];

  								if (x.object !== undefined) {

  										this.selectedObject = x.object;
  										this.selectedObject.material.color.setHex(0xccff00);

  										this.selectedPoint.visible = true;
  										this.selectedPoint.position.copy(x.point);
  								} else {

  										console.warn(intersects);
  								}
  						}
  				}
  		}, {
  				key: "configure",
  				value: function configure(gui) {

  						var folder = gui.addFolder("Raycasting");

  						folder.add(this, "enabled");
  						folder.add(this, "delta").listen();

  						folder.open();
  				}
  		}]);
  		return OctreeRaycaster;
  }(three.Raycaster);

  var matrix4 = new three.Matrix4();

  var frustum = new three.Frustum();

  var FrustumCuller = function () {
  		function FrustumCuller(octree, scene) {
  				classCallCheck(this, FrustumCuller);


  				this.octree = octree;

  				this.scene = scene;

  				this.enabled = false;

  				this.cullCamera = new three.PerspectiveCamera(20, 1.77, 0.5, 5);
  				this.cullCamera.matrixAutoUpdate = false;

  				this.s = new three.Spherical(5, Math.PI / 3, Math.PI * 1.75);

  				this.delta = "";

  				this.culledOctants = new three.Points(new three.BufferGeometry(), new three.PointsMaterial({
  						color: 0xccff00,
  						sizeAttenuation: false,
  						size: 2
  				}));

  				this.culledOctants.visible = false;

  				this.cameraHelper = new three.CameraHelper(this.cullCamera);
  				this.cameraHelper.visible = false;
  		}

  		createClass(FrustumCuller, [{
  				key: "updateCamera",
  				value: function updateCamera() {

  						var cullCamera = this.cullCamera;

  						cullCamera.position.setFromSpherical(this.s);
  						cullCamera.lookAt(this.scene.position);

  						cullCamera.updateMatrix();
  						cullCamera.updateMatrixWorld();

  						frustum.setFromMatrix(matrix4.multiplyMatrices(cullCamera.projectionMatrix, cullCamera.matrixWorldInverse));
  				}
  		}, {
  				key: "cull",
  				value: function cull() {

  						var culledOctants = this.culledOctants;

  						var t0 = void 0;
  						var i = void 0,
  						    j = void 0,
  						    l = void 0;
  						var octant = void 0,
  						    octants = void 0;
  						var positions = void 0;

  						if (this.enabled) {

  								this.updateCamera();

  								t0 = performance.now();
  								octants = this.octree.cull(frustum);

  								this.delta = (performance.now() - t0).toFixed(2) + " ms";

  								if (octants.length > 0) {

  										positions = new Float32Array(octants.length * 3 * 2);

  										for (i = 0, j = 0, l = octants.length; i < l; ++i) {

  												octant = octants[i];
  												positions[j++] = octant.min.x;
  												positions[j++] = octant.min.y;
  												positions[j++] = octant.min.z;
  												positions[j++] = octant.max.x;
  												positions[j++] = octant.max.y;
  												positions[j++] = octant.max.z;
  										}

  										culledOctants.geometry.removeAttribute("position");
  										culledOctants.geometry.addAttribute("position", new three.BufferAttribute(positions, 3));

  										this.scene.remove(culledOctants);
  										this.scene.add(culledOctants);
  								} else {

  										this.scene.remove(culledOctants);
  								}

  								this.cameraHelper.update();
  						}
  				}
  		}, {
  				key: "configure",
  				value: function configure(gui) {
  						var _this = this;

  						var folder = gui.addFolder("Frustum Culling");

  						folder.add(this, "enabled").onChange(function () {

  								_this.cameraHelper.visible = _this.culledOctants.visible = _this.enabled;
  								_this.cull();
  						});

  						folder.add(this, "delta").listen();
  						folder.open();

  						var subFolder = folder.addFolder("Camera Adjustment");

  						subFolder.add(this.s, "radius").min(0.1).max(10.0).step(0.1).onChange(function () {
  								_this.cull();
  						});
  						subFolder.add(this.s, "phi").min(1e-6).max(Math.PI - 1e-6).onChange(function () {
  								_this.cull();
  						});
  						subFolder.add(this.s, "theta").min(0.0).max(Math.PI * 2.0).onChange(function () {
  								_this.cull();
  						});
  				}
  		}]);
  		return FrustumCuller;
  }();

  var PointOctreeDemo = function (_Demo) {
  		inherits(PointOctreeDemo, _Demo);

  		function PointOctreeDemo(renderer) {
  				classCallCheck(this, PointOctreeDemo);

  				var _this = possibleConstructorReturn(this, (PointOctreeDemo.__proto__ || Object.getPrototypeOf(PointOctreeDemo)).call(this, renderer));

  				_this.points = null;

  				_this.octreeHelper = null;

  				_this.octreeRaycaster = null;

  				_this.frustumCuller = null;

  				return _this;
  		}

  		createClass(PointOctreeDemo, [{
  				key: "initialise",
  				value: function initialise() {

  						var scene = this.scene;
  						var camera = this.camera;
  						var renderer = this.renderer;

  						scene.fog = new three.FogExp2(0x0d0d0d, 0.025);

  						this.controls = new three.OrbitControls(camera, renderer.domElement);
  						this.controls.maxDistance = 60;

  						camera.near = 0.1;
  						camera.far = 200;
  						camera.position.set(10, 6, 10);
  						camera.lookAt(this.controls.target);

  						var points = function generatePoints() {

  								function createPlaneGeometry(particles, n, zBase, zBias) {

  										var geometry = new three.BufferGeometry();
  										var positions = new Float32Array(particles * 3);
  										var n2 = n / 2;

  										var x = void 0,
  										    y = void 0,
  										    z = void 0,
  										    i = void 0,
  										    l = void 0;

  										for (i = 0, l = positions.length; i < l; i += 3) {

  												x = Math.random() * n - n2;
  												y = Math.random() * n - n2;
  												z = zBase + (Math.random() * zBias * 2 - zBias);

  												positions[i] = x;
  												positions[i + 1] = y;
  												positions[i + 2] = z;
  										}

  										geometry.addAttribute("position", new three.BufferAttribute(positions, 3));

  										return geometry;
  								}

  								var points = new three.Object3D();

  								var w = 256;
  								var h = 256;

  								var d = 8;

  								var size = 6;
  								var zStep = size / (d - 1);

  								var z = size * -0.5;
  								var p = void 0;

  								var material = new three.PointsMaterial({
  										color: 0xc00000,
  										sizeAttenuation: false,
  										size: 1
  								});

  								console.log("Generating", w * h * d, "points...");

  								while (d-- > 0) {

  										p = new three.Points(createPlaneGeometry(w * h, size, z, 0.25), material);
  										material = material.clone();
  										z += zStep;

  										points.add(p);
  								}

  								return points;
  						}();

  						this.points = points;
  						scene.add(points);

  						var octree = function createOctree(points) {

  								var v = new three.Vector3();
  								var bbox = new three.Box3();
  								bbox.setFromObject(scene);

  								var t0 = performance.now();

  								var d = void 0,
  								    p = void 0,
  								    i = void 0,
  								    l = void 0;
  								var array = void 0;

  								var octree = new PointOctree(bbox.min, bbox.max, 0.0, 8, 5);

  								for (d = points.children.length - 1; d >= 0; --d) {

  										p = points.children[d];
  										array = p.geometry.getAttribute("position").array;

  										for (i = 0, l = array.length; i < l; i += 3) {

  												octree.put(v.fromArray(array, i), p);
  										}
  								}

  								console.log("Octree:", octree, "created in", (performance.now() - t0).toFixed(2) + " ms");

  								return octree;
  						}(points);

  						var octreeHelper = function createOctreeHelper(octree) {

  								var t0 = performance.now();
  								var octreeHelper = new OctreeHelper(octree);
  								octreeHelper.visible = false;

  								console.log("OctreeHelper:", octreeHelper, "created in", (performance.now() - t0).toFixed(2) + " ms");

  								return octreeHelper;
  						}(octree);

  						this.octreeHelper = octreeHelper;
  						scene.add(octreeHelper);

  						this.raycaster = new OctreeRaycaster$1(octree, camera, points);

  						renderer.domElement.parentNode.addEventListener("mousemove", this.raycaster);
  						scene.add(this.raycaster.selectedPoint);

  						this.frustumCuller = new FrustumCuller(octree, scene);

  						scene.add(this.frustumCuller.cameraHelper);
  				}
  		}, {
  				key: "render",
  				value: function render(delta) {

  						this.renderer.render(this.scene, this.camera);
  				}
  		}, {
  				key: "configure",
  				value: function configure(gui) {

  						var points = this.points;
  						var octreeHelper = this.octreeHelper;

  						this.raycaster.configure(gui);
  						this.frustumCuller.configure(gui);

  						var params = {
  								"level mask": octreeHelper.children.length
  						};

  						var folder = gui.addFolder("Points");
  						folder.add(points, "visible");
  						folder.open();

  						folder = gui.addFolder("Octree Helper");
  						folder.add(octreeHelper, "visible");

  						folder.add(params, "level mask").min(0).max(octreeHelper.children.length).step(1).onChange(function () {

  								var i = void 0,
  								    l = void 0;

  								for (i = 0, l = octreeHelper.children.length; i < l; ++i) {

  										octreeHelper.children[i].visible = params["level mask"] === octreeHelper.children.length || i === params["level mask"];
  								}
  						});

  						folder.open();
  				}
  		}]);
  		return PointOctreeDemo;
  }(Demo);

  var App = function () {
  		function App() {
  				classCallCheck(this, App);


  				this.clock = new three.Clock();

  				this.renderer = new three.WebGLRenderer({
  						logarithmicDepthBuffer: true,
  						antialias: true
  				});

  				this.renderer.setSize(window.innerWidth, window.innerHeight);
  				this.renderer.setClearColor(0x000000);
  				this.renderer.setPixelRatio(window.devicePixelRatio);

  				this.stats = function () {

  						var stats = new Stats();
  						stats.showPanel(0);
  						stats.dom.id = "stats";

  						return stats;
  				}();

  				this.demos = function (renderer) {

  						var demos = new Map();

  						demos.set("point-octree", new PointOctreeDemo(renderer));

  						return demos;
  				}(this.renderer);

  				this.key = function (demos) {

  						var key = window.location.hash.slice(1);

  						if (key.length === 0 || !demos.has(key)) {

  								key = demos.keys().next().value;
  						}

  						return key;
  				}(this.demos);
  		}

  		createClass(App, [{
  				key: "initialise",
  				value: function initialise(viewport, aside, loadingMessage) {

  						var app = this;

  						var renderer = this.renderer;
  						var clock = this.clock;
  						var stats = this.stats;
  						var demos = this.demos;

  						var demo = null;
  						var gui = null;

  						viewport.appendChild(renderer.domElement);
  						aside.appendChild(stats.dom);

  						function activateDemo() {

  								demo.initialise();

  								demo.camera.aspect = window.innerWidth / window.innerHeight;
  								demo.camera.updateProjectionMatrix();

  								gui = new dat.GUI({ autoPlace: false });
  								gui.add(app, "key", Array.from(demos.keys())).onChange(loadDemo);
  								demo.configure(gui);
  								aside.appendChild(gui.domElement);

  								loadingMessage.style.display = "none";
  								renderer.domElement.style.visibility = "visible";
  						}

  						function loadDemo() {

  								var size = renderer.getSize();

  								loadingMessage.style.display = "block";
  								renderer.domElement.style.visibility = "hidden";

  								if (gui !== null) {

  										gui.destroy();
  										aside.removeChild(gui.domElement);
  								}

  								if (demo !== null) {

  										demo.reset();
  										renderer.setSize(size.width, size.height);
  								}

  								demo = demos.get(app.key);
  								demo.load(activateDemo);
  						}

  						loadDemo();

  						document.addEventListener("keydown", function onKeyDown(event) {

  								if (event.altKey) {

  										event.preventDefault();
  										aside.style.visibility = aside.style.visibility === "hidden" ? "visible" : "hidden";
  								}
  						});

  						window.addEventListener("resize", function () {

  								var id = 0;

  								function handleResize(event) {

  										var width = event.target.innerWidth;
  										var height = event.target.innerHeight;

  										renderer.setSize(width, height);
  										demo.camera.aspect = width / height;
  										demo.camera.updateProjectionMatrix();

  										id = 0;
  								}

  								return function onResize(event) {

  										if (id === 0) {

  												id = setTimeout(handleResize, 66, event);
  										}
  								};
  						}());

  						(function render(now) {

  								var delta = clock.getDelta();

  								requestAnimationFrame(render);

  								stats.begin();

  								demo.render(delta);

  								stats.end();
  						})();
  				}
  		}]);
  		return App;
  }();

  window.addEventListener("load", function main(event) {

  	var viewport = document.getElementById("viewport");
  	var loadingMessage = viewport.children[0];
  	var aside = document.getElementById("aside");

  	var app = new App();

  	window.removeEventListener("load", main);
  	aside.style.visibility = "visible";

  	app.initialise(viewport, aside, loadingMessage);
  });

}(THREE,dat,Stats));
