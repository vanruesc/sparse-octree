import { createRequire } from "module";
import { hideBin } from "yargs/helpers";
import esbuild from "esbuild";
import yargs from "yargs";

const require = createRequire(import.meta.url);
const pkg = require("./package");
const date = (new Date()).toDateString();
const production = (process.env.NODE_ENV === "production");
const external = Object.keys(pkg.peerDependencies);
const { argv } = yargs(hideBin(process.argv))
	.option("watch", { alias: "w", type: "boolean" });

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}
 * @license ${pkg.license}
 */`;

const configs = [{
	entryPoints: ["demo/src/index.ts"],
	outfile: "public/demo/index.js",
	format: "iife",
	bundle: true,
	minify: production,
	watch: argv.watch
}, {
	entryPoints: ["src/index.ts"],
	outfile: `dist/${pkg.name}.js`,
	format: "esm",
	bundle: true,
	external,
	banner
}];

const t0 = Date.now();
await Promise.all(configs.map(c => esbuild.build(c)
	.then(() => console.log(`Built ${c.outfile} in ${Date.now() - t0}ms`))
	.catch(() => process.exit(1))));
