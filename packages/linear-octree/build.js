import pkg from "./package.json" with { type: "json" };
import esbuild from "esbuild";

const watch = process.argv.includes("-w");
const date = new Date();
const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date.toDateString()}
 * ${pkg.homepage}
 * Copyright 2019 ${pkg.author.name}
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

if(watch) {

	const context = await esbuild.context(lib);
	await context.watch();

} else {

	await esbuild.build(lib);

}
