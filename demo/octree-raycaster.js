import {
	Raycaster,
	Vector2
} from "three";

/**
 * A mouse position.
 *
 * @property MOUSE
 * @type Vector2
 * @private
 * @static
 * @final
 */

const MOUSE = new Vector2();

/**
 * An octree raycaster.
 *
 * @class OctreeRaycaster
 * @extends Raycaster
 * @constructor
 * @param {Octree} octree - An octree.
 * @param {PerspectiveCamera} camera - A camera.
 * @param {Object3D} object - An object.
 */

export class OctreeRaycaster extends Raycaster {

	constructor(octree, camera, object) {

		super();

		this.params.Points.threshold = 1e-1;

		/**
		 * An octree.
		 *
		 * @property octree
		 * @type Octree
		 * @private
		 */

		this.octree = octree;

		/**
		 * A camera.
		 *
		 * @property camera
		 * @type PerspectiveCamera
		 * @private
		 */

		this.camera = camera;

		/**
		 * An object to raycast with a brute force approach.
		 *
		 * @property object
		 * @type Object3D
		 */

		this.object = object;

		/**
		 * Indicates whether the frustum culling is active.
		 *
		 * @property enabled
		 * @type Boolean
		 * @default false
		 */

		this.enabled = true;

		/**
		 * A delta time.
		 *
		 * @property delta
		 * @type String
		 */

		this.delta = "";

		/**
		 * A selected object.
		 *
		 * @property selection
		 * @type Object3D
		 * @private
		 */

		this.selection = null;

	}

	/**
	 * Raycasts the octree.
	 *
	 * @method raycast
	 * @param {Event} event - An event.
	 */

	raycast(event) {

		let intersects;
		let t0, t;

		MOUSE.x = (event.clientX / window.innerWidth) * 2 - 1;
		MOUSE.y = -(event.clientY / window.innerHeight) * 2 + 1;

		this.setFromCamera(MOUSE, this.camera);

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
	 * @method configure
	 * @param {GUI} gui - A GUI.
	 */

	configure(gui) {

		const folder = gui.addFolder("Raycasting");

		folder.add(this, "enabled");
		folder.add(this, "delta").listen();

		folder.open();

	}

}
