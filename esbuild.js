import pkg from "./package.json" assert { type: "json" };
import esbuild from "esbuild";

const date = new Date();
const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date.toDateString()}
 * ${pkg.homepage}
 * Copyright 2016 ${pkg.author.name}
 * @license ${pkg.license}
 */`;

const lib = {
	entryPoints: ["./src/index.ts"],
	outfile: "./dist/index.js",
	banner: { js: banner },
	external: ["three"],
	logLevel: "info",
	format: "esm",
	bundle: true
};

const demo = {
	entryPoints: ["./demo/src/index.ts"],
	outdir: "./public/demo",
	minify: process.argv.includes("-m"),
	logLevel: "info",
	format: "iife",
	target: "es6",
	bundle: true
};

if(process.argv.includes("-w")) {

	const ctxDemo = await esbuild.context(demo);
	await ctxDemo.watch();

} else {

	await esbuild.build(lib);
	await esbuild.build(demo);

}
