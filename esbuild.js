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

const common = {
	logLevel: "info",
	bundle: true
};

const configs = [{
	entryPoints: ["demo/src/index.ts"],
	outfile: "public/demo/index.js",
	format: "iife",
	minify: production,
	watch: argv.watch
}, {
	entryPoints: ["src/index.ts"],
	outfile: `dist/${pkg.name}.js`,
	banner: { js: banner },
	format: "esm",
	external
}];

for(const c of configs) {

	void esbuild.build(Object.assign(c, common));

}
