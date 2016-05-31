window.addEventListener("load", function loadAssets() {

	window.removeEventListener("load", loadAssets);

	var loadingManager = new THREE.LoadingManager();

	var assets = {};

	loadingManager.onProgress = function(item, loaded, total) {

		if(loaded === total) { setupScene(assets); }

	};

	setupScene(assets);

});

function setupScene(assets) {

	var viewport = document.getElementById("viewport");
	viewport.removeChild(viewport.children[0]);

	// Renderer and Scene.

	var renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
	renderer.setClearColor(0x000000);
	renderer.setSize(window.innerWidth, window.innerHeight);
	viewport.appendChild(renderer.domElement);

	var scene = new THREE.Scene();

	// Camera.

	var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 0, 0);
	controls.maxDistance = 15;
	camera.position.set(5, 6, 8);
	camera.lookAt(controls.target);

	scene.add(camera);

	// Overlays.

	var stats = new Stats();
	stats.showPanel(0);
	stats.dom.id = "stats";
	var aside = document.getElementById("aside");
	aside.style.visibility = "visible";
	aside.appendChild(stats.dom);

	var gui = new dat.GUI();
	aside.appendChild(gui.domElement.parentNode);

	// Hide interface on alt key press.
	document.addEventListener("keydown", function(event) {

		if(event.altKey) {

			event.preventDefault();
			aside.style.visibility = (aside.style.visibility === "hidden") ? "visible" : "hidden";

		}

	});

	// Helper.

	scene.add(new THREE.AxisHelper(1));

	// Points.

	function createPlaneGeometry(particles, n, z) {

		var geometry = new THREE.BufferGeometry();

		var positions = new Float32Array(particles * 3);

		var x, y;
		var n2 = n / 2;
		var i;

		for(i = 0; i < positions.length; i += 3) {

			x = Math.random() * n - n2;
			y = Math.random() * n - n2;

			positions[i] = x;
			positions[i + 1] = y;
			positions[i + 2] = z;

		}

		geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
		geometry.computeBoundingSphere();

		return geometry;

	}

	var material = new THREE.PointsMaterial({
		color: 0xc00000, size: 1, sizeAttenuation: false
	});

	var w = 128;
	var h = 128;
	var d = 8;

	var size = 6;

	var zStep = size / (d - 1);
	var z = size * -0.5;

	var p;
	var points = new THREE.Object3D();

	while(0 < d--) {

		p = new THREE.Points(createPlaneGeometry(w * h, size, z), material);
		material = material.clone();
		z += zStep;

		points.add(p);

	}

	scene.add(points);

	// Octree.

	var bbox = new THREE.Box3();
	bbox.setFromObject(scene);

	var time = performance.now();

	var octree = new OCTREE.Octree(bbox.min, bbox.max, 0.0, 8, 7);

	for(k = points.children.length - 1; k >= 0; --k) {

		p = points.children[k];
		octree.addPoints(p.geometry.getAttribute("position").array, p);

	}

	console.log("Octree:", octree, "created in", (((performance.now() - time) * 100.0) / 100.0).toFixed(2) + " ms");

	// Octree Helper.

	time = performance.now();

	let helper = new OCTREE.OctreeHelper(octree);
	helper.visible = false;
	console.log("OctreeHelper:", helper, "created in", (((performance.now() - time) * 100.0) / 100.0).toFixed(2) + " ms");

	scene.add(helper);

	// Raycasting.

	var mouse = new THREE.Vector2();
	var raycaster = new THREE.Raycaster();
	var raycasting = true;
	var selection = null;

	raycaster.params.Points.threshold = 0.1;

	viewport.addEventListener("mousemove", function raycast(event) {

		var intersects;
		var t0, t;

		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		if(params["use octree"]) {

			t0 = performance.now();
			intersects = raycaster.intersectObject(octree);
			t = performance.now();

		} else {

			// Brute force, checks every point in every sphere.
			t0 = performance.now();
			intersects = raycaster.intersectObjects(points.children);
			t = performance.now();

		}

		params["search time"] = (((t - t0) * 100.0) / 100.0).toFixed(2) + " ms";

		if(selection !== null) {

			selection.material.color.setHex(0xc00000);
			selection = null;

		}

		if(intersects.length > 0) {

			if(intersects[0].object !== undefined) {

				selection = intersects[0].object;
				selection.material.color.setHex(0xccff00);

			} else {

				console.log(intersects);

			}

		}

	});

	// Frustum culling.

	var frustum = new THREE.Frustum();
	var cullCamera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.5, 5);
	cullCamera.matrixAutoUpdate = false;

	var s = new THREE.Spherical(5, Math.PI / 3, Math.PI * 1.75);
	var m = new THREE.Matrix4();

	function updateCamera() {

		cullCamera.position.setFromSpherical(s);
		cullCamera.lookAt(scene.position);

		cullCamera.updateMatrix();
		cullCamera.updateMatrixWorld();
		cullCamera.matrixWorldInverse.getInverse(cullCamera.matrixWorld);

		m.identity().multiplyMatrices(cullCamera.projectionMatrix, cullCamera.matrixWorldInverse);
		frustum.setFromMatrix(m)

	}

	material = material.clone();
	material.color.setHex(0xccff00);

	var culledOctants = new THREE.Points(new THREE.BufferGeometry(), material);
	culledOctants.visible = false;

	function cull() {

		var t0, t;
		var i, j, l;
		var octant, octants;
		var positions;

		if(params["show culling"]) {

			updateCamera();

			t0 = performance.now();
			octants = octree.cull(frustum);
			t = performance.now();

			if(octants.length > 0) {

				positions = new Float32Array(octants.length * 3 * 2);

				for(i = 0, j = 0, l = octants.length; i < l; ++i) {

					octant = octants[i];
					positions[j++] = octant.min.x;
					positions[j++] = octant.min.y;
					positions[j++] = octant.min.z;
					positions[j++] = octant.max.x;
					positions[j++] = octant.max.y;
					positions[j++] = octant.max.z;

				}

				culledOctants.geometry.removeAttribute("position");
				culledOctants.geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));

				scene.add(culledOctants);

			} else {

				scene.remove(culledOctants);

			}

			params["cull time"] = (((t - t0) * 100.0) / 100.0).toFixed(2) + " ms";

		}

	}

	var cameraHelper = new THREE.CameraHelper(cullCamera);
	cameraHelper.visible = false;

	scene.add(cullCamera);
	scene.add(cameraHelper);

	// Configuration.

	var params = {
		"show points": points.visible,
		"show octree": helper.visible,
		"level mask": helper.children.length,
		"use octree": true,
		"search time": "",
		"show culling": false,
		"radius": s.radius,
		"phi": s.phi,
		"theta": s.theta,
		"cull time": "",
	};

	gui.add(params, "show points").onChange(function() { points.visible = params["show points"]; });

	var f = gui.addFolder("Octree Helper");
	f.add(params, "show octree").onChange(function() { helper.visible = params["show octree"]; });
	f.add(params, "level mask").min(0).max(helper.children.length).step(1).onChange(function() {

		var i, l;

		for(i = 0, l = helper.children.length; i < l; ++i) {

			helper.children[i].visible = (params["level mask"] === helper.children.length || i === params["level mask"]);

		}

	});
	f.open();

	f = gui.addFolder("Raycasting");
	f.add(params, "use octree");
	f.add(params, "search time").listen();
	f.open();

	f = gui.addFolder("Frustum Culling");
	f.add(params, "show culling").onChange(function() { cameraHelper.visible = culledOctants.visible = params["show culling"]; cull(); });
	f.add(params, "cull time").listen();
	f.open();

	var ff = f.addFolder("Camera Adjustment");
	ff.add(params, "radius").min(0.1).max(10.0).step(0.1).onChange(function() { s.radius = params["radius"]; cull(); });
	ff.add(params, "phi").min(1e-6).max(Math.PI - 1e-6).onChange(function() { s.phi = params["phi"]; cull(); });
	ff.add(params, "theta").min(0.0).max(Math.PI * 2.0).onChange(function() { s.theta = params["theta"]; cull(); });

	/**
	 * Handles resizing.
	 */

	window.addEventListener("resize", function resize() {

		var width = window.innerWidth;
		var height = window.innerHeight;

		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();

	});

	/**
	 * Animation loop.
	 */

	(function render(now) {

		requestAnimationFrame(render);

		stats.begin();

		cameraHelper.update();

		renderer.render(scene, camera);

		stats.end();

	}());

}
