/**
 * sparse-octree v6.0.1 build Sat Oct 26 2019
 * https://github.com/vanruesc/sparse-octree
 * Copyright 2019 Raoul van Rüschen, Zlib
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('math-ds'), require('iterator-result')) :
  typeof define === 'function' && define.amd ? define(['exports', 'math-ds', 'iterator-result'], factory) :
  (global = global || self, factory(global.SPARSEOCTREE = {}, global.MATHDS, global.ITERATORRESULT));
}(this, (function (exports, mathDs, IteratorResult) { 'use strict';

  IteratorResult = IteratorResult && IteratorResult.hasOwnProperty('default') ? IteratorResult['default'] : IteratorResult;

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
  var c = new mathDs.Vector3();

  var CubicOctant = function () {
    function CubicOctant() {
      var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new mathDs.Vector3();
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
          children[i] = new this.constructor(new mathDs.Vector3(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), halfSize);
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

  var c$1 = new mathDs.Vector3();

  var Octant = function () {
    function Octant() {
      var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new mathDs.Vector3();
      var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new mathDs.Vector3();

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
          children[i] = new this.constructor(new mathDs.Vector3(combination[0] === 0 ? min.x : mid.x, combination[1] === 0 ? min.y : mid.y, combination[2] === 0 ? min.z : mid.z), new mathDs.Vector3(combination[0] === 0 ? mid.x : max.x, combination[1] === 0 ? mid.y : max.y, combination[2] === 0 ? mid.z : max.z));
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
            intersectPoint = raycaster.ray.closestPointToPoint(point, new mathDs.Vector3());
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

  var v = new mathDs.Vector3();
  var b = new mathDs.Box3();
  var d = new mathDs.Box3();
  var r = new mathDs.Ray();

  function _intersectOctree(octree, ray, flags) {
    var min = b.min.set(0, 0, 0);
    var max = b.max.subVectors(octree.max, octree.min);
    var dimensions = octree.getDimensions(d.min);
    var halfDimensions = d.max.copy(dimensions).multiplyScalar(0.5);
    var origin = r.origin.copy(ray.origin);
    var direction = r.direction.copy(ray.direction);
    var invDirX, invDirY, invDirZ;
    var tx0, tx1, ty0, ty1, tz0, tz1;
    origin.sub(octree.getCenter(v)).add(halfDimensions);
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

  var b$1 = new mathDs.Box3();

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

  var b$2 = new mathDs.Box3();

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

  var p = new mathDs.Vector3();

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
          var points = [];
          var data = [];
          var i, l, child;

          for (i = 0, l = children.length; i < l; ++i) {
            child = children[i];

            if (child.points !== null) {
              points = points.concat(child.points);
              data = data.concat(child.data);
            }
          }

          this.children = null;
          this.points = points;
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
      var points = octant.points;
      var index = -1;
      var distance;

      for (i = 0, l = points.length; i < l; ++i) {
        if (points[i].equals(point)) {
          if (!skipSelf) {
            bestDistance = 0.0;
            index = i;
            break;
          }
        } else {
          distance = point.distanceTo(points[i]);

          if (distance < bestDistance) {
            bestDistance = distance;
            index = i;
          }
        }
      }

      if (index >= 0) {
        result = {
          point: points[index],
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
      var points = octant.points;
      var rSq = radius * radius;

      var _p;

      for (i = 0, l = points.length; i < l; ++i) {
        _p = points[i];

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
