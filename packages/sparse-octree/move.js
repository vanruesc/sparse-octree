import * as fs from "node:fs/promises";
import * as path from "node:path";

const src = path.join(import.meta.dirname, "public", "docs");
const dest = path.join(import.meta.dirname, "..", "..", "public", "docs");

await fs.access(src);
await fs.mkdir(path.dirname(dest), { recursive: true });
await fs.rm(dest, { recursive: true, force: true });
await fs.rename(src, dest);
