import {
	Camera,
	Group,
	Material,
	Mesh,
	MeshBasicMaterial,
	Object3D,
	Points,
	PointsMaterial,
	Raycaster,
	SphereGeometry,
	Vector2
} from "three";

import { Pane } from "tweakpane";
import { PointOctree } from "sparse-octree";

const pointer = new Vector2();

/**
 * An octree raycasting helper.
 */

export class OctreeRaycaster extends Raycaster implements EventListenerObject {

	/**
	 * An octree.
	 */

	private octree: PointOctree<Object3D>;

	/**
	 * A DOM element.
	 */

	private domElement: HTMLElement;

	/**
	 * A group of points.
	 */

	private group: Group;

	/**
	 * The selected mesh.
	 */

	private selectedPoints: Points | null;

	/**
	 * @see {@link cursor}
	 */

	private _cursor: Mesh;

	/**
	 * Indicates whether this raycaster is active.
	 */

	enabled: boolean;

	/**
	 * The measured processing time.
	 */

	time: string;

	/**
	 * Constructs a new octree raycaster.
	 *
	 * @param octree - An octree.
	 * @param camera - A camera.
	 * @param group - A group of points.
	 * @param domElement - A DOM element.
	 */

	constructor(octree: PointOctree<Object3D>, camera: Camera, group: Group, domElement: HTMLElement) {

		super();

		if(this.params.Points !== undefined) {

			this.params.Points.threshold = 1e-1;

		}

		this.octree = octree;
		this.camera = camera;
		this.group = group;
		this.domElement = domElement;
		this.enabled = true;
		this.time = "";
		this.selectedPoints = null;

		this._cursor = new Mesh(
			new SphereGeometry(0.2, 16, 16),
			new MeshBasicMaterial({
				transparent: true,
				color: 0x00ccff,
				opacity: 0.75
			})
		);

		this._cursor.visible = false;

		domElement.addEventListener("pointermove", this, { passive: true });

	}

	/**
	 * Returns a mesh that represents the selected point.
	 */

	get cursor(): Mesh {

		return this._cursor;

	}

	/**
	 * Raycasts the octree.
	 *
	 * @param event - An event.
	 */

	raycast(event: PointerEvent): void {

		pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
		this.setFromCamera(pointer, this.camera);

		if(this.selectedPoints !== null) {

			const material = this.selectedPoints.material as PointsMaterial;
			material.color.setHex(0xc00000);
			this.selectedPoints = null;
			this.cursor.visible = false;

		}

		const t0 = performance.now();
		let x, selectedPoints, point;

		if(this.enabled) {

			const intersections = this.octree.raycast(this);

			if(intersections.length > 0) {

				x = intersections[0];
				selectedPoints = x.data;
				point = x.point;

			}

		} else {

			const intersections = this.intersectObjects(this.group.children);

			if(intersections.length > 0) {

				x = intersections[0];
				selectedPoints = x.object;
				point = x.point;

			}

		}

		this.time = (performance.now() - t0).toFixed(2) + " ms";

		if(x !== undefined && point !== null && point !== undefined &&
			selectedPoints !== null && selectedPoints !== undefined) {

			this.selectedPoints = selectedPoints as Points;
			this.cursor.visible = (selectedPoints.parent === null) ? false : selectedPoints.parent.visible;
			this.cursor.position.copy(point);

			const material = this.selectedPoints.material as PointsMaterial;
			material.color.setHex(0xccff00);

		}

	}

	/**
	 * Registers configuration options.
	 *
	 * @param pane - A settings pane.
	 */

	registerOptions(pane: Pane): void {

		const folder = pane.addFolder({ title: "Rayasting" });
		folder.addBinding(this, "enabled");
		folder.addBinding(this, "time", { readonly: true });

	}

	handleEvent(event: Event): void {

		switch(event.type) {

			case "pointermove":
				this.raycast(event as PointerEvent);
				break;

		}

	}

	/**
	 * Deletes this raycaster.
	 */

	dispose(): void {

		const domElement = this.domElement;
		domElement.removeEventListener("pointermove", this);

		const geometry = this._cursor.geometry;
		const material = this._cursor.material as Material;

		geometry.dispose();
		material.dispose();

	}

}
