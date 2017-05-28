import { LoadingManager } from "three";
import { App } from "./app.js";

/**
 * Starts the program.
 *
 * @private
 * @param {Event} event - An event.
 */

window.addEventListener("load", function main(event) {

	window.removeEventListener("load", main);

	const assets = new Map();
	const loadingManager = new LoadingManager();

	loadingManager.onProgress = function onProgress(item, loaded, total) {

		if(loaded === total) {

			App.initialise(
				document.getElementById("viewport"),
				document.getElementById("aside"),
				assets
			);

		}

	};

	loadingManager.onProgress();

});
