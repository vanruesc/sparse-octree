import { LoadingManager } from "three";
import { Demo } from "./demo.js";

/**
 * The program entry point.
 *
 * @class Main
 * @static
 */

/**
 * Starts the program.
 *
 * @method main
 * @private
 * @static
 * @param {Event} event - An event.
 */

window.addEventListener("load", function main(event) {

	window.removeEventListener("load", main);

	const assets = new Map();
	const loadingManager = new LoadingManager();

	loadingManager.onProgress = function onProgress(item, loaded, total) {

		if(loaded === total) {

			Demo.initialise(
				document.getElementById("viewport"),
				document.getElementById("aside"),
				assets
			);

		}

	};

	loadingManager.onProgress();

});
