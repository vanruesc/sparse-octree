import {
	Mesh,
	MeshBasicMaterial,
	Raycaster,
	SphereBufferGeometry,
	Vector2
} from "three";

/**
 * A mouse position.
 *
 * @type {Vector2}
 * @private
 */

const mouse = new Vector2();

/**
 * An octree raycaster.
 *
 * @implements {EventListener}
 */

export class OctreeRaycaster extends Raycaster {

	/**
	 * Constructs a new octree raycaster.
	 *
	 * @param {Octree} octree - An octree.
	 * @param {PerspectiveCamera} camera - A camera.
	 * @param {Object3D} object - An object.
	 */

	constructor(octree, camera, object) {

		super();

		/**
		 * A picking accuracy threshold for points.
		 */

		this.params.Points.threshold = 1e-1;

		/**
		 * An octree.
		 *
		 * @type {Octree}
		 * @private
		 */

		this.octree = octree;

		/**
		 * A camera.
		 *
		 * @type {PerspectiveCamera}
		 * @private
		 */

		this.camera = camera;

		/**
		 * An object to raycast with a brute force approach.
		 *
		 * @type {Object3D}
		 */

		this.object = object;

		/**
		 * Indicates whether the frustum culling is active.
		 *
		 * @type {Boolean}
		 * @default false
		 */

		this.enabled = true;

		/**
		 * A delta time.
		 *
		 * @type {String}
		 */

		this.delta = "";

		/**
		 * A selected object.
		 *
		 * @type {Object3D}
		 * @private
		 */

		this.selectedObject = null;

		/**
		 * The currently selected point.
		 *
		 * @type {Mesh}
		 */

		this.selectedPoint = new Mesh(
			new SphereBufferGeometry(0.2, 16, 16),
			new MeshBasicMaterial({
				transparent: true,
				color: 0x00ccff,
				opacity: 0.75
			})
		);

		this.selectedPoint.visible = false;

	}

	/**
	 * Raycasts on mouse move events.
	 *
	 * @param {Event} event - A worker message event.
	 */

	handleEvent(event) {

		switch(event.type) {

			case "mousemove":
				this.raycast(event);
				break;

		}

	}

	/**
	 * Raycasts the octree.
	 *
	 * @param {Event} event - An event.
	 */

	raycast(event) {

		let intersects;
		let t0, t, x;

		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		this.setFromCamera(mouse, this.camera);

		if(this.enabled) {

			// Use the octree raycasting capabilities.
			t0 = performance.now();
			intersects = this.octree.raycast(this);
			t = performance.now();

		} else {

			// Brute force alternative.
			t0 = performance.now();
			intersects = this.intersectObjects(this.object.children);
			t = performance.now();

		}

		this.delta = (t - t0).toFixed(2) + " ms";

		if(this.selectedObject !== null) {

			this.selectedObject.material.color.setHex(0xc00000);
			this.selectedObject = null;
			this.selectedPoint.visible = false;

		}

		if(intersects.length > 0) {

			x = intersects[0];

			if(x.object !== undefined) {

				this.selectedObject = x.object;
				this.selectedObject.material.color.setHex(0xccff00);

				this.selectedPoint.visible = true;
				this.selectedPoint.position.copy(x.point);

			} else {

				console.warn(intersects);

			}

		}

	}

	/**
	 * Registers configuration options.
	 *
	 * @param {GUI} gui - A GUI.
	 */

	configure(gui) {

		const folder = gui.addFolder("Raycasting");

		folder.add(this, "enabled");
		folder.add(this, "delta").listen();

		folder.open();

	}

}
