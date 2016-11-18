module.exports = {

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
		plugins: () => [
			require("rollup-plugin-node-resolve")({
				jsnext: true
			}),
			require("rollup-plugin-babel")({
				exclude: "node_modules/**"
			})
		]
	},

	lib: {
		options: {
			format: "umd",
			moduleName: "OCTREE",
			banner: "<%= banner %>"
		},
		src: "src/index.js",
		dest: "build/<%= package.name %>.js"
	},

	demo: {
		options: {
			format: "iife"
		},
		src: "demo/index.js",
		dest: "public/index.js"
	}

};
