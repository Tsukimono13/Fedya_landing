// Portfolio works: display order + alt text. Plain data with no Vite-specific
// imports, so the build-time plugin in src/scripts/works-images.js can import
// it straight from Node.
//
// `alt` describes what each tattoo actually depicts — placement, subject,
// style — because Google Images ranks portfolio shots almost entirely on the
// alt text and the copy around them. Keep them descriptive, not
// keyword-stuffed: the artist's name and location already come from the page.
//
// Source files live in src/assets/works/. The plugin encodes an AVIF + WebP
// variant of each one at build time and inlines the <picture> markup into
// index.html, so crawlers see the gallery without executing JS.
export const works = [
  {
    file: 'work_1.png',
    alt: 'Geisha portrait with a half-decayed skull face, black and grey realism on the upper arm',
  },
  {
    file: 'work_2.png',
    alt: 'Forearm sleeve: crowned figure in a crown of thorns above a hannya mask, black and grey realism',
  },
  {
    file: 'work_13.png',
    alt: 'Seattle Space Needle growing into a rooted pine tree, blackwork forearm tattoo',
  },
  {
    file: 'work_3.png',
    alt: 'Skeletal hand gripping a dagger, tattooed on the side of the head above the ear',
  },
  {
    file: 'work_4.png',
    alt: 'Hooded reaper skull with a scythe and skeletal hand, black and grey realism forearm sleeve',
  },
  {
    file: 'work_5.png',
    alt: 'Horned demonic cat with a pentagram and forked tongue, dark blackwork on the upper arm',
  },
  {
    file: 'work_6.png',
    alt: 'Large abstract blackwork ornament covering the full back and shoulders',
  },
  {
    file: 'work_7.png',
    alt: 'Horror creature covering its grinning face with clawed hands, black and grey forearm tattoo',
  },
  {
    file: 'work_8.png',
    alt: 'Compass, rope and map shoulder piece with "Compass always points north" lettering, black and grey realism',
  },
  {
    file: 'work_9.png',
    alt: 'Blackwork chest piece: a cross of feathered wings filled with eyes',
  },
  {
    file: 'work_10.png',
    alt: 'Gothic cartoon girl standing in a coffin surrounded by a spider web, forearm tattoo',
  },
  {
    file: 'work_11.png',
    alt: 'Grinning horned demon framed by triangles and floating eyes, black and grey realism upper-arm sleeve',
  },
  {
    file: 'work_12.png',
    alt: "Death's-head hawkmoth spread across the side of the neck, black and grey realism",
  },
  {
    file: 'work_14.png',
    alt: 'Reservoir Dogs poster portrait, black and grey realism forearm tattoo',
  },
  {
    file: 'work_15.png',
    alt: 'Black widow spider on a fine-line web, tattooed on the neck',
  },
  {
    file: 'work_16.png',
    alt: 'Woman in a raven-skull headdress flanked by ravens, colour thigh piece on a red background',
  },
  {
    file: 'work_17.png',
    alt: 'Skeleton in an Aztec feathered headdress, black and grey realism forearm sleeve',
  },
  {
    file: 'work_18.png',
    alt: 'Horned demon with bared teeth and geometric eye panels, black and grey realism shoulder tattoo',
  },
  {
    file: 'work_19.png',
    alt: 'Rose and skull tattooed across the backs of both hands, black and grey realism',
  },
  {
    file: 'work_20.png',
    alt: 'Solid black blackout sleeve covering the full arm',
  },
];
