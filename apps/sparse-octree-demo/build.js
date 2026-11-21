import esbuild from "esbuild";

const watch = process.argv.includes("-w");

const demo = {
	entryPoints: ["./src/index.ts"],
	outdir: "./public/demo",
	logLevel: "info",
	format: "iife",
	target: "es6",
	minify: !watch,
	bundle: true
};

if(watch) {

	const context = await esbuild.context(demo);
	await context.watch();

} else {

	await esbuild.build(demo);

}
