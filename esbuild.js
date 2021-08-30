import { createRequire } from "module";
import esbuild from "esbuild";

const require = createRequire(import.meta.url);
const pkg = require("./package");
const date = (new Date()).toDateString();
const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}
 * @license ${pkg.license}
 */`;

await esbuild.build({
	entryPoints: ["src/index.ts"],
	outfile: `dist/${pkg.name}.js`,
	external: Object.keys(pkg.peerDependencies || {}),
	banner: { js: banner },
	logLevel: "info",
	format: "esm",
	bundle: true
}).catch(() => process.exit(1));

await esbuild.build({
	entryPoints: ["demo/src/index.ts"],
	outdir: "public/demo",
	minify: process.argv.includes("-m"),
	watch: process.argv.includes("-w"),
	logLevel: "info",
	format: "iife",
	target: "es6",
	bundle: true
}).catch(() => process.exit(1));
