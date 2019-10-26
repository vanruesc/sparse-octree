import babel from "rollup-plugin-babel";
import minify from "rollup-plugin-babel-minify";
import resolve from "rollup-plugin-node-resolve";

const pkg = require("./package.json");
const date = (new Date()).toDateString();

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}, ${pkg.license}
 */`;

const production = (process.env.NODE_ENV === "production");
const external = Object.keys(pkg.peerDependencies).concat(["three"]);
const globals = Object.assign({}, ...external.map((value) => ({
	[value]: value.replace(/-/g, "").toUpperCase()
})));

const lib = {

	module: {
		input: "src/index.js",
		plugins: [resolve()],
		external,
		output: [{
			file: pkg.module,
			format: "esm",
			banner
		}, {
			file: pkg.main,
			format: "esm"
		}, {
			file: pkg.main.replace(".js", ".min.js"),
			format: "esm"
		}]
	},

	main: {
		input: pkg.main,
		plugins: [babel()],
		external,
		output: {
			file: pkg.main,
			format: "umd",
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			globals,
			banner
		}
	},

	min: {
		input: pkg.main.replace(".js", ".min.js"),
		plugins: [minify({
			bannerNewLine: true,
			comments: false
		}), babel()],
		external,
		output: {
			file: pkg.main.replace(".js", ".min.js"),
			format: "umd",
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			globals,
			banner
		}
	}

};

const demo = {

	module: {
		input: "demo/src/index.js",
		plugins: [resolve()],
		external: ["three"],
		output: [{
			file: "public/demo/index.js",
			format: "esm",
			globals
		}].concat(production ? [{
			file: "public/demo/index.min.js",
			format: "esm",
			globals
		}] : [])
	},

	main: {
		input: production ? "public/demo/index.js" : "demo/src/index.js",
		plugins: production ? [babel()] : [resolve()],
		external: ["three"],
		output: [{
			file: "public/demo/index.js",
			format: "iife",
			globals
		}]
	},

	min: {
		input: "public/demo/index.min.js",
		plugins: [minify({
			comments: false
		}), babel()],
		external: ["three"],
		output: {
			file: "public/demo/index.min.js",
			format: "iife",
			globals
		}
	}

};

export default production ? [
	lib.module, lib.main, lib.min,
	demo.module, demo.main, demo.min
] : [demo.main];
