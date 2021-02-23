import {
	Mesh,
	MeshBasicMaterial,
	Raycaster,
	SphereBufferGeometry,
	Vector2
} from "three";

/**
 * A mouse position.
 */

const mouse = new Vector2();

/**
 * An octree raycaster.
 */

export class OctreeRaycaster extends Raycaster implements EventListenerObject {

	/**
	 * An octree.
	 */

	private octree: Octree;

	/**
	 * A camera.
	 */

	private camera: Camera;

	/**
	 * An object to raycast with a brute force approach.
	 */

	private object: Object3D;

	/**
	 * Indicates whether the raycaster is active.
	 */

	private enabled: boolean;

	/**
	 * A delta time.
	 */

	private delta: string;

	/**
	 * A selected object.
	 */

	private selectedObject: Object3D;

	/**
	 * The currently selected point.
	 */

	private selectedPoint: Mesh;

	/**
	 * Constructs a new octree raycaster.
	 *
	 * @param octree - An octree.
	 * @param camera - A camera.
	 * @param object - An object.
	 */

	constructor(octree: Octree, camera: Camera, object: Object3D) {

		super();

		this.params.Points.threshold = 1e-1;

		this.octree = octree;
		this.camera = camera;
		this.object = object;
		this.enabled = true;
		this.delta = "";
		this.selectedObject = null;

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

	handleEvent(event: Event): void {

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

	raycast(event: Event) {

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

				this.selectedPoint.visible = x.object.parent.visible;
				this.selectedPoint.position.copy(x.point);

			} else {

				console.warn(intersects);

			}

		}

	}

	/**
	 * Registers configuration options.
	 *
	 * @param menu - A menu.
	 */

	registerOptions(menu: GUI): void {

		const folder = menu.addFolder("Raycasting");

		folder.add(this, "enabled");
		folder.add(this, "delta").listen();

		folder.open();

	}

}
