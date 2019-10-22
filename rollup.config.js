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
const globals = { three: "THREE" };

const lib = {

	module: {
		input: "src/index.js",
		plugins: [resolve()],
		output: [{
			file: pkg.module,
			format: "esm",
			banner: banner
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
		output: {
			file: pkg.main,
			format: "umd",
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			banner: banner
		}
	},

	min: {
		input: pkg.main.replace(".js", ".min.js"),
		plugins: [minify({
			bannerNewLine: true,
			comments: false
		}), babel()],
		output: {
			file: pkg.main.replace(".js", ".min.js"),
			format: "umd",
			name: pkg.name.replace(/-/g, "").toUpperCase(),
			banner: banner
		}
	}

};

const demo = {

	module: {
		input: "demo/src/index.js",
		external: Object.keys(globals),
		plugins: [resolve()],
		output: [{
			file: "public/demo/index.js",
			format: "esm",
			globals: globals
		}].concat(production ? [{
			file: "public/demo/index.min.js",
			format: "esm",
			globals: globals
		}] : [])
	},

	main: {
		input: production ? "public/demo/index.js" : "demo/src/index.js",
		external: Object.keys(globals),
		plugins: production ? [babel()] : [resolve()],
		output: [{
			file: "public/demo/index.js",
			format: "iife",
			globals: globals
		}]
	},

	min: {
		input: "public/demo/index.min.js",
		external: Object.keys(globals),
		plugins: [minify({
			comments: false
		}), babel()],
		output: {
			file: "public/demo/index.min.js",
			format: "iife",
			globals: globals
		}
	}

};

export default production ? [
	lib.module, lib.main, lib.min,
	demo.module, demo.main, demo.min
] : [demo.main];
