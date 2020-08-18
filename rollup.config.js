import buble from "@rollup/plugin-buble";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const pkg = require("./package.json");
const date = (new Date()).toDateString();

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}
 * @license ${pkg.license}
 */`;

const production = (process.env.NODE_ENV === "production");
const external = Object.keys(pkg.peerDependencies);
const globals = Object.assign({}, ...external.map((value) => ({
	[value]: value.replace(/-/g, "").toUpperCase()
})));

const lib = {
	module: {
		input: "src/index.js",
		plugins: [resolve()],
		external,
		output: {
			dir: "build",
			entryFileNames: pkg.name + ".esm.js",
			format: "esm",
			banner
		}
	},
	main: {
		input: "src/index.js",
		plugins: [resolve(), buble()],
		external,
		output: [{
			dir: "build",
			entryFileNames: pkg.name + ".js",
			format: "umd",
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			globals,
			banner
		}, {
			dir: "build",
			entryFileNames: pkg.name + ".min.js",
			format: "umd",
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			plugins: [terser()],
			globals,
			banner
		}]
	}
};

const demo = {
	input: "demo/src/index.js",
	plugins: [resolve()].concat(production ? [buble()] : []),
	output: [{
		dir: "public/demo",
		entryFileNames: "[name].js",
		format: "iife"
	}].concat(production ? [{
		dir: "public/demo",
		entryFileNames: "[name].min.js",
		format: "iife",
		plugins: [terser()]
	}] : [])
};

export default production ? [lib.module, lib.main, demo]: [demo];
