const resolve = require("rollup-plugin-node-resolve");
const babel = require("rollup-plugin-babel");

module.exports = function(grunt) {

	return {

		options: {
			plugins() {

				return [
					resolve()
				].concat(
					grunt.option("production") ? [babel()] : []
				);

			}
		},

		lib: {
			options: {
				format: "umd",
				moduleName: "<%= package.name.replace(/-/g, \"\").toUpperCase() %>",
				banner: "<%= banner %>"
			},
			src: "<%= package.module %>",
			dest: "build/<%= package.name %>.js"
		},

		demo: {
			options: {
				globals: {
					"three": "THREE",
					"stats.js": "Stats",
					"dat.gui": "dat"
				},
				external: [
					"three",
					"stats.js",
					"dat.gui"
				],
				format: "iife"
			},
			src: "demo/src/index.js",
			dest: "public/demo/index.js"
		}

	};

};
