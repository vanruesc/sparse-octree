/**
 * sparse-octree v6.0.0 build Wed Oct 23 2019
 * https://github.com/vanruesc/sparse-octree
 * Copyright 2019 Raoul van Rüschen, Zlib
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.SPARSEOCTREE = {}));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var edges = [new Uint8Array([0, 4]), new Uint8Array([1, 5]), new Uint8Array([2, 6]), new Uint8Array([3, 7]), new Uint8Array([0, 2]), new Uint8Array([1, 3]), new Uint8Array([4, 6]), new Uint8Array([5, 7]), new Uint8Array([0, 1]), new Uint8Array([2, 3]), new Uint8Array([4, 5]), new Uint8Array([6, 7])];
  var layout = [new Uint8Array([0, 0, 0]), new Uint8Array([0, 0, 1]), new Uint8Array([0, 1, 0]), new Uint8Array([0, 1, 1]), new Uint8Array([1, 0, 0]), new Uint8Array([1, 0, 1]), new Uint8Array([1, 1, 0]), new Uint8Array([1, 1, 1])];

  var Vector3 = function () {
    function Vector3() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      _classCallCheck(this, Vector3);

      this.x = x;
      this.y = y;
      this.z = z;
    }

    _createClass(Vector3, [{
      key: "set",
      value: function set(x, y, z) {
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
      key: "clone",
      value: function clone() {
        return new this.constructor(this.x, this.y, this.z);
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
      value: function toArray() {
        var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
        return array;
      }
    }, {
      key: "setFromSpherical",
      value: function setFromSpherical(s) {
        this.setFromSphericalCoords(s.radius, s.phi, s.theta);
      }
    }, {
      key: "setFromSphericalCoords",
      value: function setFromSphericalCoords(radius, phi, theta) {
        var sinPhiRadius = Math.sin(phi) * radius;
        this.x = sinPhiRadius * Math.sin(theta);
        this.y = Math.cos(phi) * radius;
        this.z = sinPhiRadius * Math.cos(theta);
        return this;
      }
    }, {
      key: "setFromCylindrical",
      value: function setFromCylindrical(c) {
        this.setFromCylindricalCoords(c.radius, c.theta, c.y);
      }
    }, {
      key: "setFromCylindricalCoords",
      value: function setFromCylindricalCoords(radius, theta, y) {
        this.x = radius * Math.sin(theta);
        this.y = y;
        this.z = radius * Math.cos(theta);
        return this;
      }
    }, {
      key: "setFromMatrixColumn",
      value: function setFromMatrixColumn(m, index) {
        return this.fromArray(m.elements, index * 4);
      }
    }, {
      key: "setFromMatrixPosition",
      value: function setFromMatrixPosition(m) {
        var me = m.elements;
        this.x = me[12];
        this.y = me[13];
        this.z = me[14];
        return this;
      }
    }, {
      key: "setFromMatrixScale",
      value: function setFromMatrixScale(m) {
        var sx = this.setFromMatrixColumn(m, 0).length();
        var sy = this.setFromMatrixColumn(m, 1).length();
        var sz = this.setFromMatrixColumn(m, 2).length();
        this.x = sx;
        this.y = sy;
        this.z = sz;
        return this;
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
      key: "addScaledVector",
      value: function addScaledVector(v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;
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
        this.x *= s;
        this.y *= s;
        this.z *= s;
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
        this.x /= s;
        this.y /= s;
        this.z /= s;
        return this;
      }
    }, {
      key: "crossVectors",
      value: function crossVectors(a, b) {
        var ax = a.x,
            ay = a.y,
            az = a.z;
        var bx = b.x,
            by = b.y,
            bz = b.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
      }
    }, {
      key: "cross",
      value: function cross(v) {
        return this.crossVectors(this, v);
      }
    }, {
      key: "transformDirection",
      value: function transformDirection(m) {
        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z;
        this.y = e[1] * x + e[5] * y + e[9] * z;
        this.z = e[2] * x + e[6] * y + e[10] * z;
        return this.normalize();
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
    }, {
      key: "applyQuaternion",
      value: function applyQuaternion(q) {
        var x = this.x,
            y = this.y,
            z = this.z;
        var qx = q.x,
            qy = q.y,
            qz = q.z,
            qw = q.w;
        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z;
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
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
      key: "reflect",
      value: function reflect(n) {
        var nx = n.x;
        var ny = n.y;
        var nz = n.z;
        this.sub(n.multiplyScalar(2 * this.dot(n)));
        n.set(nx, ny, nz);
        return this;
      }
    }, {
      key: "angleTo",
      value: function angleTo(v) {
        var theta = this.dot(v) / Math.sqrt(this.lengthSquared() * v.lengthSquared());
        return Math.acos(Math.min(Math.max(theta, -1), 1));
      }
    }, {
      key: "manhattanLength",
      value: function manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
      }
    }, {
      key: "lengthSquared",
      value: function lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
      }
    }, {
      key: "length",
      value: function length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      }
    }, {
      key: "manhattanDistanceTo",
      value: function manhattanDistanceTo(v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
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
      key: "distanceTo",
      value: function distanceTo(v) {
        return Math.sqrt(this.distanceToSquared(v));
      }
    }, {
      key: "normalize",
      value: function normalize() {
        return this.divideScalar(this.length());
      }
    }, {
      key: "setLength",
      value: function setLength(length) {
        return this.normalize().multiplyScalar(length);
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
      key: "floor",
      value: function floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
      }
    }, {
      key: "ceil",
      value: function ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
      }
    }, {
      key: "round",
      value: function round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
      }
    }, {
      key: "lerp",
      value: function lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
      }
    }, {
      key: "lerpVectors",
      value: function lerpVectors(v1, v2, alpha) {
        return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
      }
    }, {
      key: "equals",
      value: function equals(v) {
        return v.x === this.x && v.y === this.y && v.z === this.z;
      }
    }]);

    return Vector3;
  }();

  var v = new Vector3();
  var points = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()];

  var Box3 = function () {
    function Box3() {
      var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3(Infinity, Infinity, Infinity);
      var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3(-Infinity, -Infinity, -Infinity);

      _classCallCheck(this, Box3);

      this.min = min;
      this.max = max;
    }

    _createClass(Box3, [{
      key: "set",
      value: function set(min, max) {
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
      key: "makeEmpty",
      value: function makeEmpty() {
        this.min.x = this.min.y = this.min.z = Infinity;
        this.max.x = this.max.y = this.max.z = -Infinity;
        return this;
      }
    }, {
      key: "isEmpty",
      value: function isEmpty() {
        return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
      }
    }, {
      key: "getCenter",
      value: function getCenter() {
        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
        return !this.isEmpty() ? target.addVectors(this.min, this.max).multiplyScalar(0.5) : target.set(0, 0, 0);
      }
    }, {
      key: "getSize",
      value: function getSize() {
        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
        return !this.isEmpty() ? target.subVectors(this.max, this.min) : target.set(0, 0, 0);
      }
    }, {
      key: "setFromSphere",
      value: function setFromSphere(sphere) {
        this.set(sphere.center, sphere.center);
        this.expandByScalar(sphere.radius);
        return this;
      }
    }, {
      key: "expandByPoint",
      value: function expandByPoint(p) {
        this.min.min(p);
        this.max.max(p);
        return this;
      }
    }, {
      key: "expandByVector",
      value: function expandByVector(v) {
        this.min.sub(v);
        this.max.add(v);
        return this;
      }
    }, {
      key: "expandByScalar",
      value: function expandByScalar(s) {
        this.min.addScalar(-s);
        this.max.addScalar(s);
        return this;
      }
    }, {
      key: "setFromPoints",
      value: function setFromPoints(points) {
        var i, l;
        this.min.set(0, 0, 0);
        this.max.set(0, 0, 0);

        for (i = 0, l = points.length; i < l; ++i) {
          this.expandByPoint(points[i]);
        }

        return this;
      }
    }, {
      key: "setFromCenterAndSize",
      value: function setFromCenterAndSize(center, size) {
        var halfSize = v.copy(size).multiplyScalar(0.5);
        this.min.copy(center).sub(halfSize);
        this.max.copy(center).add(halfSize);
        return this;
      }
    }, {
      key: "clampPoint",
      value: function clampPoint(point) {
        var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();
        return target.copy(point).clamp(this.min, this.max);
      }
    }, {
      key: "distanceToPoint",
      value: function distanceToPoint(p) {
        var clampedPoint = v.copy(p).clamp(this.min, this.max);
        return clampedPoint.sub(p).length();
      }
    }, {
      key: "applyMatrix4",
      value: function applyMatrix4(m) {
        var min = this.min;
        var max = this.max;

        if (!this.isEmpty()) {
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
    }, {
      key: "translate",
      value: function translate(offset) {
        this.min.add(offset);
        this.max.add(offset);
        return this;
      }
    }, {
      key: "intersect",
      value: function intersect(b) {
        this.min.max(b.min);
        this.max.min(b.max);

        if (this.isEmpty()) {
          this.makeEmpty();
        }

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
      key: "containsPoint",
      value: function containsPoint(p) {
        var min = this.min;
        var max = this.max;
        return p.x >= min.x && p.y >= min.y && p.z >= min.z && p.x <= max.x && p.y <= max.y && p.z <= max.z;
      }
    }, {
      key: "containsBox",
      value: function containsBox(b) {
        var tMin = this.min;
        var tMax = this.max;
        var bMin = b.min;
        var bMax = b.max;
        return tMin.x <= bMin.x && bMax.x <= tMax.x && tMin.y <= bMin.y && bMax.y <= tMax.y && tMin.z <= bMin.z && bMax.z <= tMax.z;
      }
    }, {
      key: "intersectsBox",
      value: function intersectsBox(b) {
        var tMin = this.min;
        var tMax = this.max;
        var bMin = b.min;
        var bMax = b.max;
        return bMax.x >= tMin.x && bMax.y >= tMin.y && bMax.z >= tMin.z && bMin.x <= tMax.x && bMin.y <= tMax.y && bMin.z <= tMax.z;
      }
    }, {
      key: "intersectsSphere",
      value: function intersectsSphere(s) {
        var closestPoint = this.clampPoint(s.center, v);
        return closestPoint.distanceToSquared(s.center) <= s.radius * s.radius;
      }
    }, {
      key: "intersectsPlane",
      value: function intersectsPlane(p) {
        var min, max;

        if (p.normal.x > 0) {
          min = p.normal.x * this.min.x;
          max = p.normal.x * this.max.x;
        } else {
          min = p.normal.x * this.max.x;
          max = p.normal.x * this.min.x;
        }

        if (p.normal.y > 0) {
          min += p.normal.y * this.min.y;
          max += p.normal.y * this.max.y;
        } else {
          min += p.normal.y * this.max.y;
          max += p.normal.y * this.min.y;
        }

        if (p.normal.z > 0) {
          min += p.normal.z * this.min.z;
          max += p.normal.z * this.max.z;
        } else {
          min += p.normal.z * this.max.z;
          max += p.normal.z * this.min.z;
        }

        return min <= -p.constant && max >= -p.constant;
      }
    }, {
      key: "equals",
      value: function equals(b) {
        return b.min.equals(this.min) && b.max.equals(this.max);
      }
    }]);

    return Box3;
  }();

  var v$4 = [new Vector3(), new Vector3(), new Vector3(), new Vector3()];

  var Ray = function () {
    function Ray() {
      var origin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();

      _classCallCheck(this, Ray);

      this.origin = origin;
      this.direction = direction;
    }

    _createClass(Ray, [{
      key: "set",
      value: function set(origin, direction) {
        this.origin.copy(origin);
        this.direction.copy(direction);
        return this;
      }
    }, {
      key: "copy",
      value: function copy(r) {
        this.origin.copy(r.origin);
        this.direction.copy(r.direction);
        return this;
      }
    }, {
      key: "clone",
      value: function clone() {
        return new this.constructor().copy(this);
      }
    }, {
      key: "at",
      value: function at(t) {
        var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();
        return target.copy(this.direction).multiplyScalar(t).add(this.origin);
      }
    }, {
      key: "lookAt",
      value: function lookAt(target) {
        this.direction.copy(target).sub(this.origin).normalize();
        return this;
      }
    }, {
      key: "recast",
      value: function recast(t) {
        this.origin.copy(this.at(t, v$4[0]));
        return this;
      }
    }, {
      key: "closestPointToPoint",
      value: function closestPointToPoint(p) {
        var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();
        var directionDistance = target.subVectors(p, this.origin).dot(this.direction);
        return directionDistance >= 0.0 ? target.copy(this.direction).multiplyScalar(directionDistance).add(this.origin) : target.copy(this.origin);
      }
    }, {
      key: "distanceSquaredToPoint",
      value: function distanceSquaredToPoint(p) {
        var directionDistance = v$4[0].subVectors(p, this.origin).dot(this.direction);
        return directionDistance < 0.0 ? this.origin.distanceToSquared(p) : v$4[0].copy(this.direction).multiplyScalar(directionDistance).add(this.origin).distanceToSquared(p);
      }
    }, {
      key: "distanceToPoint",
      value: function distanceToPoint(p) {
        return Math.sqrt(this.distanceSquaredToPoint(p));
      }
    }, {
      key: "distanceToPlane",
      value: function distanceToPlane(p) {
        var denominator = p.normal.dot(this.direction);
        var t = denominator !== 0.0 ? -(this.origin.dot(p.normal) + p.constant) / denominator : p.distanceToPoint(this.origin) === 0.0 ? 0.0 : -1.0;
        return t >= 0.0 ? t : null;
      }
    }, {
      key: "distanceSquaredToSegment",
      value: function distanceSquaredToSegment(v0, v1, pointOnRay, pointOnSegment) {
        var segCenter = v$4[0].copy(v0).add(v1).multiplyScalar(0.5);
        var segDir = v$4[1].copy(v1).sub(v0).normalize();
        var diff = v$4[2].copy(this.origin).sub(segCenter);
        var segExtent = v0.distanceTo(v1) * 0.5;
        var a01 = -this.direction.dot(segDir);
        var b0 = diff.dot(this.direction);
        var b1 = -diff.dot(segDir);
        var c = diff.lengthSq();
        var det = Math.abs(1.0 - a01 * a01);
        var s0, s1, extDet, invDet, sqrDist;

        if (det > 0.0) {
          s0 = a01 * b1 - b0;
          s1 = a01 * b0 - b1;
          extDet = segExtent * det;

          if (s0 >= 0.0) {
            if (s1 >= -extDet) {
              if (s1 <= extDet) {
                invDet = 1.0 / det;
                s0 *= invDet;
                s1 *= invDet;
                sqrDist = s0 * (s0 + a01 * s1 + 2.0 * b0) + s1 * (a01 * s0 + s1 + 2.0 * b1) + c;
              } else {
                s1 = segExtent;
                s0 = Math.max(0.0, -(a01 * s1 + b0));
                sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;
              }
            } else {
              s1 = -segExtent;
              s0 = Math.max(0.0, -(a01 * s1 + b0));
              sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;
            }
          } else {
            if (s1 <= -extDet) {
              s0 = Math.max(0.0, -(-a01 * segExtent + b0));
              s1 = s0 > 0.0 ? -segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
              sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;
            } else if (s1 <= extDet) {
              s0 = 0.0;
              s1 = Math.min(Math.max(-segExtent, -b1), segExtent);
              sqrDist = s1 * (s1 + 2.0 * b1) + c;
            } else {
              s0 = Math.max(0.0, -(a01 * segExtent + b0));
              s1 = s0 > 0.0 ? segExtent : Math.min(Math.max(-segExtent, -b1), segExtent);
              sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;
            }
          }
        } else {
          s1 = a01 > 0.0 ? -segExtent : segExtent;
          s0 = Math.max(0.0, -(a01 * s1 + b0));
          sqrDist = -s0 * s0 + s1 * (s1 + 2.0 * b1) + c;
        }

        if (pointOnRay !== undefined) {
          pointOnRay.copy(this.direction).multiplyScalar(s0).add(this.origin);
        }

        if (pointOnSegment !== undefined) {
          pointOnSegment.copy(segDir).multiplyScalar(s1).add(segCenter);
        }

        return sqrDist;
      }
    }, {
      key: "intersectSphere",
      value: function intersectSphere(s) {
        var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();
        var ab = v$4[0].subVectors(s.center, this.origin);
        var tca = ab.dot(this.direction);
        var d2 = ab.dot(ab) - tca * tca;
        var radius2 = s.radius * s.radius;
        var result = null;
        var thc, t0, t1;

        if (d2 <= radius2) {
          thc = Math.sqrt(radius2 - d2);
          t0 = tca - thc;
          t1 = tca + thc;

          if (t0 >= 0.0 || t1 >= 0.0) {
            result = t0 < 0.0 ? this.at(t1, target) : this.at(t0, target);
          }
        }

        return result;
      }
    }, {
      key: "intersectsSphere",
      value: function intersectsSphere(s) {
        return this.distanceSqToPoint(s.center) <= s.radius * s.radius;
      }
    }, {
      key: "intersectPlane",
      value: function intersectPlane(p) {
        var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();
        var t = this.distanceToPlane(p);
        return t === null ? null : this.at(t, target);
      }
    }, {
      key: "intersectsPlane",
      value: function intersectsPlane(p) {
        var distanceToPoint = p.distanceToPoint(this.origin);
        return distanceToPoint === 0.0 || p.normal.dot(this.direction) * distanceToPoint < 0.0;
      }
    }, {
      key: "intersectBox",
      value: function intersectBox(b) {
        var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();
        var origin = this.origin;
        var direction = this.direction;
        var min = b.min;
        var max = b.max;
        var invDirX = 1.0 / direction.x;
        var invDirY = 1.0 / direction.y;
        var invDirZ = 1.0 / direction.z;
        var result = null;
        var tmin, tmax, tymin, tymax, tzmin, tzmax;

        if (invDirX >= 0.0) {
          tmin = (min.x - origin.x) * invDirX;
          tmax = (max.x - origin.x) * invDirX;
        } else {
          tmin = (max.x - origin.x) * invDirX;
          tmax = (min.x - origin.x) * invDirX;
        }

        if (invDirY >= 0.0) {
          tymin = (min.y - origin.y) * invDirY;
          tymax = (max.y - origin.y) * invDirY;
        } else {
          tymin = (max.y - origin.y) * invDirY;
          tymax = (min.y - origin.y) * invDirY;
        }

        if (tmin <= tymax && tymin <= tmax) {
          if (tymin > tmin || tmin !== tmin) {
            tmin = tymin;
          }

          if (tymax < tmax || tmax !== tmax) {
            tmax = tymax;
          }

          if (invDirZ >= 0.0) {
            tzmin = (min.z - origin.z) * invDirZ;
            tzmax = (max.z - origin.z) * invDirZ;
          } else {
            tzmin = (max.z - origin.z) * invDirZ;
            tzmax = (min.z - origin.z) * invDirZ;
          }

          if (tmin <= tzmax && tzmin <= tmax) {
            if (tzmin > tmin || tmin !== tmin) {
              tmin = tzmin;
            }

            if (tzmax < tmax || tmax !== tmax) {
              tmax = tzmax;
            }

            if (tmax >= 0.0) {
              result = this.at(tmin >= 0.0 ? tmin : tmax, target);
            }
          }
        }

        return result;
      }
    }, {
      key: "intersectsBox",
      value: function intersectsBox(b) {
        return this.intersectBox(b, v$4[0]) !== null;
      }
    }, {
      key: "intersectTriangle",
      value: function intersectTriangle(a, b, c, backfaceCulling, target) {
        var direction = this.direction;
        var diff = v$4[0];
        var edge1 = v$4[1];
        var edge2 = v$4[2];
        var normal = v$4[3];
        var result = null;
        var DdN, sign, DdQxE2, DdE1xQ, QdN;
        edge1.subVectors(b, a);
        edge2.subVectors(c, a);
        normal.crossVectors(edge1, edge2);
        DdN = direction.dot(normal);

        if (DdN !== 0.0 && !(backfaceCulling && DdN > 0.0)) {
          if (DdN > 0.0) {
            sign = 1.0;
          } else {
            sign = -1.0;
            DdN = -DdN;
          }

          diff.subVectors(this.origin, a);
          DdQxE2 = sign * direction.dot(edge2.crossVectors(diff, edge2));

          if (DdQxE2 >= 0.0) {
            DdE1xQ = sign * direction.dot(edge1.cross(diff));

            if (DdE1xQ >= 0.0 && DdQxE2 + DdE1xQ <= DdN) {
              QdN = -sign * diff.dot(normal);

              if (QdN >= 0.0) {
                result = this.at(QdN / DdN, target);
              }
            }
          }
        }

        return result;
      }
    }, {
      key: "applyMatrix4",
      value: function applyMatrix4(m) {
        this.origin.applyMatrix4(m);
        this.direction.transformDirection(m);
        return this;
      }
    }, {
      key: "equals",
      value: function equals(r) {
        return r.origin.equals(this.origin) && r.direction.equals(this.direction);
      }
    }]);

    return Ray;
  }();

  var c = new Vector3();

  var CubicOctant = function () {
    function CubicOctant() {
      var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
      var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      _classCallCheck(this, CubicOctant);

      this.min = min;
      this.size = size;
      this.children = null;
    }

    _createClass(CubicOctant, [{
      key: "getCenter",
      value: function getCenter(target) {
        return target.copy(this.min).addScalar(this.size * 0.5);
      }
    }, {
      key: "getDimensions",
      value: function getDimensions(target) {
        return target.set(this.size, this.size, this.size);
      }
    }, {
      key: "split",
      value: function split() {
        var min = this.min;
        var mid = this.getCenter(c);
        var halfSize = this.size * 0.5;
        var children = this.children = [null, null, null, null, null, null, null, null];
        var i, combination;

        for (i = 0; i < 8; ++i) {
          combination = layout[i];
          children[i] = new this.constructor(new Vector3(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), halfSize);
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

  var c$1 = new Vector3();

  var Octant = function () {
    function Octant() {
      var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector3();
      var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();

      _classCallCheck(this, Octant);

      this.min = min;
      this.max = max;
      this.children = null;
    }

    _createClass(Octant, [{
      key: "getCenter",
      value: function getCenter(target) {
        return target.addVectors(this.min, this.max).multiplyScalar(0.5);
      }
    }, {
      key: "getDimensions",
      value: function getDimensions(target) {
        return target.subVectors(this.max, this.min);
      }
    }, {
      key: "split",
      value: function split() {
        var min = this.min;
        var max = this.max;
        var mid = this.getCenter(c$1);
        var children = this.children = [null, null, null, null, null, null, null, null];
        var i, combination;

        for (i = 0; i < 8; ++i) {
          combination = layout[i];
          children[i] = new this.constructor(new Vector3(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), new Vector3(combination[0] === 0 ? mid.x : max.x, combination[1] === 0 ? mid.y : max.y, combination[2] === 0 ? mid.z : max.z));
        }
      }
    }]);

    return Octant;
  }();

  var RayPointIntersection = function RayPointIntersection(distance, distanceToRay, point) {
    var object = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    _classCallCheck(this, RayPointIntersection);

    this.distance = distance;
    this.distanceToRay = distanceToRay;
    this.point = point;
    this.object = object;
  };

  function testPoints(octants, raycaster, intersects) {
    var threshold = raycaster.params.Points.threshold;
    var thresholdSq = threshold * threshold;
    var intersectPoint;
    var distance, distanceToRay;
    var rayPointDistanceSq;
    var i, j, il, jl;
    var octant, points, point;

    for (i = 0, il = octants.length; i < il; ++i) {
      octant = octants[i];
      points = octant.points;

      if (points !== null) {
        for (j = 0, jl = points.length; j < jl; ++j) {
          point = points[j];
          rayPointDistanceSq = raycaster.ray.distanceSqToPoint(point);

          if (rayPointDistanceSq < thresholdSq) {
            intersectPoint = raycaster.ray.closestPointToPoint(point, new Vector3());
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

  var Flags = function Flags() {
    _classCallCheck(this, Flags);

    this.value = 0;
  };

  function findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {
    var entry = 0;

    if (tx0 > ty0 && tx0 > tz0) {
      if (tym < tx0) {
        entry |= 2;
      }

      if (tzm < tx0) {
        entry |= 1;
      }
    } else if (ty0 > tz0) {
      if (txm < ty0) {
        entry |= 4;
      }

      if (tzm < ty0) {
        entry |= 1;
      }
    } else {
      if (txm < tz0) {
        entry |= 4;
      }

      if (tym < tz0) {
        entry |= 2;
      }
    }

    return entry;
  }

  var octantTable = [new Uint8Array([4, 2, 1]), new Uint8Array([5, 3, 8]), new Uint8Array([6, 8, 3]), new Uint8Array([7, 8, 8]), new Uint8Array([8, 6, 5]), new Uint8Array([8, 7, 8]), new Uint8Array([8, 8, 7]), new Uint8Array([8, 8, 8])];

  function findNextOctant(currentOctant, tx1, ty1, tz1) {
    var min;
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

  var v$1 = new Vector3();
  var b = new Box3();
  var d = new Box3();
  var r = new Ray();

  function _intersectOctree(octree, ray, flags) {
    var min = b.min.set(0, 0, 0);
    var max = b.max.subVectors(octree.max, octree.min);
    var dimensions = octree.getDimensions(d.min);
    var halfDimensions = d.max.copy(dimensions).multiplyScalar(0.5);
    var origin = r.origin.copy(ray.origin);
    var direction = r.direction.copy(ray.direction);
    var invDirX, invDirY, invDirZ;
    var tx0, tx1, ty0, ty1, tz0, tz1;
    origin.sub(octree.getCenter(v$1)).add(halfDimensions);
    flags.value = 0;

    if (direction.x < 0.0) {
      origin.x = dimensions.x - origin.x;
      direction.x = -direction.x;
      flags.value |= 4;
    }

    if (direction.y < 0.0) {
      origin.y = dimensions.y - origin.y;
      direction.y = -direction.y;
      flags.value |= 2;
    }

    if (direction.z < 0.0) {
      origin.z = dimensions.z - origin.z;
      direction.z = -direction.z;
      flags.value |= 1;
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
    return Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1) ? [tx0, ty0, tz0, tx1, ty1, tz1] : null;
  }

  var flags = new Flags();

  function raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, intersects) {
    if (tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {
      var children = octant.children;

      if (children === null) {
        intersects.push(octant);
      } else {
        var txm = 0.5 * (tx0 + tx1);
        var tym = 0.5 * (ty0 + ty1);
        var tzm = 0.5 * (tz0 + tz1);
        var f = flags.value;
        var currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

        do {
          switch (currentOctant) {
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
              currentOctant = 8;
              break;
          }
        } while (currentOctant < 8);
      }
    }
  }

  var OctreeRaycaster = function () {
    function OctreeRaycaster() {
      _classCallCheck(this, OctreeRaycaster);
    }

    _createClass(OctreeRaycaster, null, [{
      key: "intersectOctree",
      value: function intersectOctree(octree, ray) {
        var intersects = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        var parameters = _intersectOctree(octree, ray, flags);

        if (parameters !== null) {
          raycastOctant.apply(void 0, [octree.root].concat(_toConsumableArray(parameters), [intersects]));
        }
      }
    }]);

    return OctreeRaycaster;
  }();

  var IteratorResult = function () {
    function IteratorResult() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      _classCallCheck(this, IteratorResult);

      this.value = value;
      this.done = done;
    }

    _createClass(IteratorResult, [{
      key: "reset",
      value: function reset() {
        this.value = null;
        this.done = false;
      }
    }]);

    return IteratorResult;
  }();

  var b$1 = new Box3();

  var OctreeIterator = function () {
    function OctreeIterator(octree) {
      var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      _classCallCheck(this, OctreeIterator);

      this.octree = octree;
      this.region = region;
      this.cull = region !== null;
      this.result = new IteratorResult();
      this.trace = null;
      this.indices = null;
      this.reset();
    }

    _createClass(OctreeIterator, [{
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
        var index, children, child;

        while (octant === null && depth >= 0) {
          index = indices[depth]++;
          children = trace[depth].children;

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

  var b$2 = new Box3();

  function _getDepth(octant) {
    var children = octant.children;
    var result = 0;
    var i, l, d;

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
    var i, l;
    b$2.min = octant.min;
    b$2.max = octant.max;

    if (region.intersectsBox(b$2)) {
      if (children !== null) {
        for (i = 0, l = children.length; i < l; ++i) {
          _cull(children[i], region, result);
        }
      } else {
        result.push(octant);
      }
    }
  }

  function _findNodesByLevel(octant, level, depth, result) {
    var children = octant.children;
    var i, l;

    if (depth === level) {
      result.push(octant);
    } else if (children !== null) {
      ++depth;

      for (i = 0, l = children.length; i < l; ++i) {
        _findNodesByLevel(children[i], level, depth, result);
      }
    }
  }

  var Octree = function () {
    function Octree(root) {
      _classCallCheck(this, Octree);

      this.root = root;
    }

    _createClass(Octree, [{
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
      key: "cull",
      value: function cull(region) {
        var result = [];

        _cull(this.root, region, result);

        return result;
      }
    }, {
      key: "getDepth",
      value: function getDepth() {
        return _getDepth(this.root);
      }
    }, {
      key: "findNodesByLevel",
      value: function findNodesByLevel(level) {
        var result = [];

        _findNodesByLevel(this.root, level, 0, result);

        return result;
      }
    }, {
      key: "raycast",
      value: function raycast(raycaster) {
        var intersects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        OctreeRaycaster.intersectOctree(this, raycaster.ray, intersects);
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
      get: function get() {
        return this.root.min;
      }
    }, {
      key: "max",
      get: function get() {
        return this.root.max;
      }
    }, {
      key: "children",
      get: function get() {
        return this.root.children;
      }
    }]);

    return Octree;
  }();

  var p = new Vector3();

  var PointOctant = function (_Octant) {
    _inherits(PointOctant, _Octant);

    function PointOctant(min, max) {
      var _this;

      _classCallCheck(this, PointOctant);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PointOctant).call(this, min, max));
      _this.points = null;
      _this.data = null;
      return _this;
    }

    _createClass(PointOctant, [{
      key: "distanceToSquared",
      value: function distanceToSquared(point) {
        var clampedPoint = p.copy(point).clamp(this.min, this.max);
        return clampedPoint.sub(point).lengthSquared();
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
        var i, j, il, jl;
        var child, point, entry;

        if (children !== null && points !== null) {
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

          this.points = null;
          this.data = null;
        }
      }
    }, {
      key: "merge",
      value: function merge() {
        var children = this.children;

        if (children !== null) {
          var _points = [];
          var data = [];
          var i, l, child;

          for (i = 0, l = children.length; i < l; ++i) {
            child = children[i];

            if (child.points !== null) {
              _points = _points.concat(child.points);
              data = data.concat(child.data);
            }
          }

          this.children = null;
          this.points = _points;
          this.data = data;
        }
      }
    }]);

    return PointOctant;
  }(Octant);

  function _countPoints(octant) {
    var children = octant.children;
    var result = 0;
    var i, l;

    if (children !== null) {
      for (i = 0, l = children.length; i < l; ++i) {
        result += _countPoints(children[i]);
      }
    } else if (octant.points !== null) {
      result = octant.points.length;
    }

    return result;
  }

  function _insert(point, data, octree, octant, depth) {
    var children = octant.children;
    var exists = false;
    var done = false;
    var i, l;

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
          done = _insert(point, data, octree, children[i], depth);
        }
      }
    }

    return done;
  }

  function _remove(point, octree, octant, parent) {
    var children = octant.children;
    var result = null;
    var i, l;
    var points, data, last;

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

  function _get$1(point, octree, octant) {
    var children = octant.children;
    var result = null;
    var i, l;
    var points;

    if (octant.contains(point, octree.bias)) {
      if (children !== null) {
        for (i = 0, l = children.length; result === null && i < l; ++i) {
          result = _get$1(point, octree, children[i]);
        }
      } else if (octant.points !== null) {
        points = octant.points;

        for (i = 0, l = points.length; result === null && i < l; ++i) {
          if (point.equals(points[i])) {
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
    var i, l;
    var points;

    if (octant.contains(point, octree.bias)) {
      if (octant.contains(position, octree.bias)) {
        if (children !== null) {
          ++depth;

          for (i = 0, l = children.length; result === null && i < l; ++i) {
            result = _move(point, position, octree, children[i], octant, depth);
          }
        } else if (octant.points !== null) {
          points = octant.points;

          for (i = 0, l = points.length; i < l; ++i) {
            if (point.equals(points[i])) {
              points[i].copy(position);
              result = octant.data[i];
              break;
            }
          }
        }
      } else {
        result = _remove(point, octree, octant, parent);

        _insert(position, result, octree, parent, depth - 1);
      }
    }

    return result;
  }

  function _findNearestPoint(point, maxDistance, skipSelf, octant) {
    var result = null;
    var bestDistance = maxDistance;
    var i, l;

    if (octant.children !== null) {
      var sortedChildren = octant.children.map(function (child) {
        return {
          octant: child,
          distance: child.distanceToCenterSquared(point)
        };
      }).sort(function (a, b) {
        return a.distance - b.distance;
      });
      var child, intermediateResult;

      for (i = 0, l = sortedChildren.length; i < l; ++i) {
        child = sortedChildren[i].octant;

        if (child.contains(point, bestDistance)) {
          intermediateResult = _findNearestPoint(point, bestDistance, skipSelf, child);

          if (intermediateResult !== null) {
            bestDistance = intermediateResult.distance;
            result = intermediateResult;

            if (bestDistance === 0.0) {
              break;
            }
          }
        }
      }
    } else if (octant.points !== null) {
      var _points2 = octant.points;
      var index = -1;
      var distance;

      for (i = 0, l = _points2.length; i < l; ++i) {
        if (_points2[i].equals(point)) {
          if (!skipSelf) {
            bestDistance = 0.0;
            index = i;
            break;
          }
        } else {
          distance = point.distanceTo(_points2[i]);

          if (distance < bestDistance) {
            bestDistance = distance;
            index = i;
          }
        }
      }

      if (index >= 0) {
        result = {
          point: _points2[index],
          data: octant.data[index],
          distance: bestDistance
        };
      }
    }

    return result;
  }

  function _findPoints(point, radius, skipSelf, octant, result) {
    var children = octant.children;
    var i, l;

    if (children !== null) {
      var child;

      for (i = 0, l = children.length; i < l; ++i) {
        child = children[i];

        if (child.contains(point, radius)) {
          _findPoints(point, radius, skipSelf, child, result);
        }
      }
    } else if (octant.points !== null) {
      var _points3 = octant.points;
      var rSq = radius * radius;

      var _p;

      for (i = 0, l = _points3.length; i < l; ++i) {
        _p = _points3[i];

        if (_p.equals(point)) {
          if (!skipSelf) {
            result.push({
              point: _p.clone(),
              data: octant.data[i]
            });
          }
        } else if (_p.distanceToSquared(point) <= rSq) {
          result.push({
            point: _p.clone(),
            data: octant.data[i]
          });
        }
      }
    }
  }

  var PointOctree = function (_Octree) {
    _inherits(PointOctree, _Octree);

    function PointOctree(min, max) {
      var _this2;

      var bias = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;
      var maxPoints = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 8;
      var maxDepth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 8;

      _classCallCheck(this, PointOctree);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(PointOctree).call(this, new PointOctant(min, max)));
      _this2.bias = Math.max(0.0, bias);
      _this2.maxPoints = Math.max(1, Math.round(maxPoints));
      _this2.maxDepth = Math.max(0, Math.round(maxDepth));
      _this2.pointCount = 0;
      return _this2;
    }

    _createClass(PointOctree, [{
      key: "countPoints",
      value: function countPoints(octant) {
        return _countPoints(octant);
      }
    }, {
      key: "insert",
      value: function insert(point, data) {
        return _insert(point, data, this, this.root, 0);
      }
    }, {
      key: "remove",
      value: function remove(point) {
        return _remove(point, this, this.root, null);
      }
    }, {
      key: "get",
      value: function get(point) {
        return _get$1(point, this, this.root);
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

        var result = _findNearestPoint(point, maxDistance, skipSelf, this.root);

        if (result !== null) {
          result.point = result.point.clone();
        }

        return result;
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

        var octants = _get(_getPrototypeOf(PointOctree.prototype), "raycast", this).call(this, raycaster);

        if (octants.length > 0) {
          testPoints(octants, raycaster, intersects);
        }

        return intersects;
      }
    }]);

    return PointOctree;
  }(Octree);

  exports.CubicOctant = CubicOctant;
  exports.Flags = Flags;
  exports.Octant = Octant;
  exports.Octree = Octree;
  exports.OctreeIterator = OctreeIterator;
  exports.OctreeRaycaster = OctreeRaycaster;
  exports.PointOctant = PointOctant;
  exports.PointOctree = PointOctree;
  exports.RayPointIntersection = RayPointIntersection;
  exports.edges = edges;
  exports.findEntryOctant = findEntryOctant;
  exports.findNextOctant = findNextOctant;
  exports.intersectOctree = _intersectOctree;
  exports.layout = layout;
  exports.testPoints = testPoints;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
