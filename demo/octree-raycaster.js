import {
	Raycaster,
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

		this.selection = null;

	}

	/**
	 * Raycasts the octree.
	 *
	 * @param {Event} event - An event.
	 */

	raycast(event) {

		let intersects;
		let t0, t;

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

		if(this.selection !== null) {

			this.selection.material.color.setHex(0xc00000);
			this.selection = null;

		}

		if(intersects.length > 0) {

			if(intersects[0].object !== undefined) {

				this.selection = intersects[0].object;
				this.selection.material.color.setHex(0xccff00);

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
