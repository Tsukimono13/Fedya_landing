import { Buffer } from 'node:buffer';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { compress } from 'wawoff2';

// The two custom faces ship as .otf/.ttf, which are essentially uncompressed
// containers. WOFF2 wraps the same outlines in Brotli and cuts them by ~70%
// (96K -> 27K and 29K -> 8K here), which matters because both faces render
// text on the critical path: Hatsch Sans is every section title, Long Shot is
// the <h1>.
//
// The plugin converts each font at build time, emits the .woff2 next to its
// source, and prepends it to the @font-face `src` list in the built CSS. The
// original stays as the second entry, so a browser without WOFF2 support
// (IE11, Opera Mini — under 2% combined) still gets a working font and
// everyone else never requests it.
//
// wawoff2 is a WASM port of Google's woff2 encoder and runs only here, in
// Node. Nothing from it reaches the browser.
const FONT_ROOT = 'assets/fonts';
const SOURCE_EXTENSIONS = ['.otf', '.ttf'];

export function fontsWoff2() {
  let config;
  // source file name -> emitted .woff2 file name
  const converted = new Map();

  return {
    name: 'fonts-woff2',

    configResolved(resolved) {
      config = resolved;
    },

    async buildStart() {
      // Dev serves the originals straight from public/; no .woff2 exists on
      // disk, so the CSS must keep pointing at them.
      if (config.command !== 'build') return;

      const root = path.resolve(config.root, config.publicDir, FONT_ROOT);
      for (const name of await readdir(root)) {
        if (!SOURCE_EXTENSIONS.includes(path.extname(name).toLowerCase())) {
          continue;
        }
        const source = await readFile(path.join(root, name));
        // compress() hands back a Uint8Array that is a *view* into wawoff2's
        // 16 MB WASM heap (byteOffset ~5.7 MB). Rollup serialises an asset
        // from the underlying ArrayBuffer, so passing the view through writes
        // the wrong 8 KB — a file of exactly the right size with garbage in
        // it. Buffer.from() copies the view's own bytes. Do not "simplify".
        const woff2 = Buffer.from(await compress(source));
        if (woff2.length >= source.length) continue;

        const fileName = `${FONT_ROOT}/${path.basename(name, path.extname(name))}.woff2`;
        this.emitFile({ type: 'asset', fileName, source: woff2 });
        converted.set(name, fileName);
      }
    },

    generateBundle(_options, bundle) {
      if (config.command !== 'build' || converted.size === 0) return;

      // Matches one entry of an @font-face src list, e.g.
      //   url(/assets/fonts/Long_Shot.ttf) format("truetype")
      const entry = new RegExp(
        `url\\(["']?${config.base}${FONT_ROOT}/([^)"']+)["']?\\)(\\s*format\\(["'][^)]*["']\\))`,
        'g',
      );

      for (const asset of Object.values(bundle)) {
        if (asset.type !== 'asset' || !asset.fileName.endsWith('.css'))
          continue;
        asset.source = String(asset.source).replace(
          entry,
          (whole, name, format) => {
            const woff2 = converted.get(name);
            if (!woff2) return whole;
            return `url(${config.base}${woff2}) format("woff2"),url(${config.base}${FONT_ROOT}/${name})${format}`;
          },
        );
      }
    },
  };
}
