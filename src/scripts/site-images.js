import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { AVIF, encodeVariants } from './image-encode.js';
import { IMAGE_OPTIONS } from '../data/images.js';

// Everything in public/ is copied to dist untouched, which left ~1.4 MB of
// unoptimised PNGs on the page — including the LCP hero portrait. This plugin
// encodes an AVIF + WebP variant of every PNG under public/assets/images/ and
// rewires the page to prefer them:
//
//   * <img src="assets/images/x.png">  ->  <picture> with AVIF/WebP sources
//   * background-image: url(...x.png)  ->  followed by an image-set() override
//   * <!-- PRELOAD:hero -->            ->  <link rel="preload"> for the LCP AVIF
//
// The original PNGs are deliberately left alone and stay as the <img src> /
// first background-image declaration, so browsers without AVIF *and* WebP keep
// working and nothing 404s. Per-file downscaling lives in src/data/images.js.
//
// Variants are emitted with stable, unhashed names next to their source
// (assets/images/x.avif), matching how the rest of public/ is served.
const IMAGE_ROOT = 'assets/images';

// Only run in `vite build` — in dev the raw PNGs are served from public/ and
// no .avif/.webp exist, so the page must keep pointing at the originals.
async function collectPngs(dir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await collectPngs(path.join(dir, entry.name), rel)));
    } else if (entry.name.endsWith('.png')) {
      files.push(rel);
    }
  }
  return files;
}

export function siteImages() {
  let config;
  // relative png path (e.g. 'glitches/glitch_1.png') -> encodeVariants() result
  const variants = new Map();

  const urlFor = (rel, ext) =>
    `${config.base}${IMAGE_ROOT}/${rel.replace(/\.png$/, `.${ext}`)}`;

  return {
    name: 'site-images',

    configResolved(resolved) {
      config = resolved;
    },

    async buildStart() {
      if (config.command !== 'build') return;

      const root = path.resolve(config.root, config.publicDir, IMAGE_ROOT);
      for (const rel of await collectPngs(root)) {
        const source = await readFile(path.join(root, rel));
        const encoded = await encodeVariants(source, IMAGE_OPTIONS[rel] ?? {});

        for (const variant of encoded.variants) {
          this.emitFile({
            type: 'asset',
            fileName: `${IMAGE_ROOT}/${rel.replace(/\.png$/, `.${variant.ext}`)}`,
            source: variant.buffer,
          });
        }
        variants.set(rel, encoded);
      }
    },

    transformIndexHtml(html) {
      const preloaded = Object.entries(IMAGE_OPTIONS).find(
        ([, opts]) => opts.preload,
      )?.[0];

      // In dev there are no variants: preload the PNG and leave <img> alone.
      if (config.command !== 'build') {
        return html.replace(
          /<!--\s*PRELOAD:hero\s*-->/g,
          preloaded
            ? `<link rel="preload" as="image" href="${IMAGE_ROOT}/${preloaded}" fetchpriority="high">`
            : '',
        );
      }

      return html
        .replace(/<!--\s*PRELOAD:hero\s*-->/g, () =>
          preloaded && variants.has(preloaded)
            ? `<link rel="preload" as="image" type="${AVIF.mime}"` +
              ` href="${urlFor(preloaded, AVIF.ext)}" fetchpriority="high">`
            : '',
        )
        .replace(/<img\b[^>]*>/g, (tag) => {
          const src = tag.match(
            new RegExp(`src="${IMAGE_ROOT}/([^"]+)\\.png"`),
          );
          const rel = src && `${src[1]}.png`;
          if (!rel || !variants.has(rel)) return tag;
          const sources = variants
            .get(rel)
            .variants.map(
              (v) => `<source type="${v.mime}" srcset="${urlFor(rel, v.ext)}">`,
            )
            .join('');
          return `<picture>${sources}${tag}</picture>`;
        });
    },

    // CSS backgrounds cannot use <picture>, so each declaration gets an
    // image-set() twin right after it. Browsers that understand image-set()
    // take the AVIF/WebP; the rest drop the unparsable declaration and keep
    // the PNG from the line above.
    generateBundle(_options, bundle) {
      if (config.command !== 'build') return;

      const declaration = new RegExp(
        `(background(?:-image)?\\s*:\\s*)([^;}]*url\\(["']?${config.base}${IMAGE_ROOT}/([^)"']+)\\.png["']?\\)[^;}]*)`,
        'g',
      );

      for (const asset of Object.values(bundle)) {
        if (asset.type !== 'asset' || !asset.fileName.endsWith('.css'))
          continue;
        asset.source = String(asset.source).replace(
          declaration,
          (whole, prop, value, name) => {
            const rel = `${name}.png`;
            if (!variants.has(rel)) return whole;
            const set = variants
              .get(rel)
              .variants.map(
                (v) => `url(${urlFor(rel, v.ext)}) type("${v.mime}")`,
              )
              .join(',');
            return `${prop}${value};background-image:image-set(${set})`;
          },
        );
      }
    },
  };
}
