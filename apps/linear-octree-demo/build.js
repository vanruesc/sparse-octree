import esbuild from "esbuild";

const watch = process.argv.includes("-w");

const alias = {
	"linear-octree": "../../packages/linear-octree/src/index.ts"
};

const demo = {
	entryPoints: ["./src/index.ts"],
	outdir: "./public/demo",
	alias: watch ? alias : undefined,
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
