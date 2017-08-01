import { App } from "./App.js";

/**
 * Starts the program.
 *
 * @private
 * @param {Event} event - An event.
 */

window.addEventListener("load", function main(event) {

	window.removeEventListener("load", main);

	App.initialise(
		document.getElementById("viewport"),
		document.getElementById("aside")
	);

});
