import { createRequire } from "module";
import esbuild from "esbuild";

const require = createRequire(import.meta.url);
const pkg = require("./package");
const date = (new Date()).toDateString();
const external = Object.keys(pkg.peerDependencies || {});
const minify = (process.env.NODE_ENV === "production");
const watch = process.argv.includes("-w");
const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}
 * @license ${pkg.license}
 */`;

await esbuild.build({
	entryPoints: ["src/index.ts"],
	outfile: `dist/${pkg.name}.js`,
	banner: { js: banner },
	logLevel: "info",
	format: "esm",
	bundle: true,
	external
}).catch(() => process.exit(1));

await esbuild.build({
	entryPoints: ["demo/src/index.ts"],
	outfile: "public/demo/index.js",
	logLevel: "info",
	format: "iife",
	bundle: true,
	minify,
	watch
}).catch(() => process.exit(1));
