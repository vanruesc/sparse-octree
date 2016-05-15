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

	var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 0, 0);
	controls.maxDistance = 15;
	camera.position.set(3, 1, 6);
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

	var material = new THREE.PointsMaterial({color: 0xffffff, size: 1, sizeAttenuation: false});

	var m = 64, n = 64;
	var r = 0.0, rStep = 0.25;
	var k = 6;

	var points;
	var spheres = [];

	while(0 < k--) {

		r += rStep;
		points = new THREE.Points(new THREE.SphereBufferGeometry(r, m, n), material);
		material = material.clone();

		scene.add(points);
		spheres.push(points);

	}

	// Octree.

	var bbox = new THREE.Box3();
	bbox.setFromObject(scene);

	var time = performance.now();

	var octree = new OCTREE.Octree(bbox.min, bbox.max, 0.0, 8, 8);

	for(k = spheres.length - 1; k >= 0; --k) {

		octree.addPoints(spheres[k].geometry.getAttribute("position").array, spheres[k]);

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

	raycaster.params.Points.threshold = 0.01;

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
			intersects = raycaster.intersectObjects(spheres);
			t = performance.now();

		}

		params["search time"] = (((t - t0) * 100.0) / 100.0).toFixed(2) + " ms";

		if(selection !== null) {

			selection.material.color.setHex(0xffffff);
			selection = null;

		}

		if(intersects.length > 0) {

			if(intersects[0].object !== undefined) {

				selection = intersects[0].object;
				selection.material.color.setHex(0x00ff00);

			} else {

				console.log(intersects);

			}

		}

	});

	// Configuration.

	var params = {
		"show octree": helper.visible,
		"level mask": helper.children.length,
		"use octree": true,
		"search time": ""
	};

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

		renderer.render(scene, camera);

		stats.end();

	}());

}
