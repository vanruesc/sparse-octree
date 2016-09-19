YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Box3",
        "CubicOctant",
        "Octant",
        "Octree",
        "OctreeHelper",
        "PointOctant",
        "PointOctree",
        "Raycasting",
        "Vector3"
    ],
    "modules": [
        "core",
        "math",
        "octree",
        "points"
    ],
    "allModules": [
        {
            "displayName": "core",
            "name": "core",
            "description": "Core components."
        },
        {
            "displayName": "math",
            "name": "math",
            "description": "A bounding box.\n\nThis class is a copy of THREE.Box3. It can be removed as soon as three.js\nstarts supporting ES6 modules."
        },
        {
            "displayName": "octree",
            "name": "octree",
            "description": "Exposure of the library components."
        },
        {
            "displayName": "points",
            "name": "points",
            "description": "Point-oriented octree components."
        }
    ],
    "elements": []
} };
});