import { Product } from "./types";

// Catalogo completo: 20 prodotti unici (dal template v0-sfcc-ecommerce-template)
// + 3 entry duplicate con categoryId "top-seller" (verde/azure/kaya) per
// popolare home/featured, esattamente come nel template originale.
// Immagini: SELF-CONTAINED, servite da /public/sfcc/*.png (niente CDN
// Salesforce, che va in timeout). Per ogni prodotto abbiamo solo la
// featuredImage in locale (fornita dall'utente), quindi `images` contiene
// un solo elemento invece delle 2-3 varianti del template (quelle non le
// abbiamo scaricate e referenziarle darebbe 404).
// Vincoli mantenuti dal file precedente:
// - almeno alcuni con categoryId "top-seller" -> home e vista "featured"
//   non restano vuote;
// - tutti con `options: []` e `variants: []` (dove il template li aveva vuoti)
//   -> in AddToCart si risolve la "base variant" senza selettori/nuqs;
//   per i prodotti che nel template avevano option/variant "color" li
//   manteniamo, dato che lo shape li supporta comunque.
// - tutti `availableForSale: true` con priceRange valido -> totali calcolabili.
export const mockProducts: Product[] = [
  {
    id: "verde-leather-lounge-chair",
    handle: "verde-leather-lounge-chair",
    title: "Verde Leather Lounge Chair",
    description:
      "A sculptural olive leather lounge chair with wide arms and deep comfort — sleek, bold, and built to relax.",
    descriptionHtml:
      "<p>The Verde Lounge Chair is a bold blend of sculptural form and deep comfort. Upholstered in rich olive green leather, its fluid silhouette features curved armrests and a wide seat that invites you to sink in. A matte black wooden frame adds structure and contrast, making it a refined statement piece for modern living rooms, reading corners, or offices.</p>",
    categoryId: "seats",
    tags: [],
    featuredImage: {
      altText: "Verde Leather Lounge Chair",
      url: "/sfcc/Verde_armchair_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "499", currencyCode: "GBP" },
      minVariantPrice: { amount: "499", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Verde Leather Lounge Chair",
        url: "/sfcc/Verde_armchair_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [],
    seo: { title: "", description: "" },
    variants: [],
  },
  {
    id: "verde-leather-lounge-chair",
    handle: "verde-leather-lounge-chair",
    title: "Verde Leather Lounge Chair",
    description:
      "A sculptural olive leather lounge chair with wide arms and deep comfort — sleek, bold, and built to relax.",
    descriptionHtml:
      "<p>The Verde Lounge Chair is a bold blend of sculptural form and deep comfort. Upholstered in rich olive green leather, its fluid silhouette features curved armrests and a wide seat that invites you to sink in. A matte black wooden frame adds structure and contrast, making it a refined statement piece for modern living rooms, reading corners, or offices.</p>",
    categoryId: "top-seller",
    tags: [],
    featuredImage: {
      altText: "Verde Leather Lounge Chair",
      url: "/sfcc/Verde_armchair_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "499", currencyCode: "GBP" },
      minVariantPrice: { amount: "499", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Verde Leather Lounge Chair",
        url: "/sfcc/Verde_armchair_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [],
    seo: { title: "", description: "" },
    variants: [],
  },
  {
    id: "azure-folding-metal-chair",
    handle: "azure-folding-metal-chair",
    title: "Azure Folding Metal Chair",
    description:
      "A bold electric-blue folding chair made of powder-coated steel — lightweight, stackable, and ready for any space.",
    descriptionHtml:
      "<p>Bold, functional, and effortlessly cool — the Azure Folding Chair adds a vibrant pop of color wherever you need extra seating. Built from powder-coated steel in a striking electric blue, it's lightweight yet durable, perfect for casual dining, events, or creative studios. Folds flat for easy storage and transport.</p>",
    categoryId: "seats",
    tags: [],
    featuredImage: {
      altText: "Azure Folding Metal Chair",
      url: "/sfcc/Azure_chair_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "78", currencyCode: "GBP" },
      minVariantPrice: { amount: "78", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Azure Folding Metal Chair",
        url: "/sfcc/Azure_chair_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [
      {
        id: "color",
        name: "Color",
        values: [{ id: "blue", name: "Blue" }],
      },
    ],
    seo: { title: "", description: "" },
    variants: [
      {
        id: "azure-folding-metal-chair-1",
        title: "Azure Folding Metal Chair",
        availableForSale: true,
        selectedOptions: [{ name: "color", value: "blue" }],
        price: { amount: "78", currencyCode: "GBP" },
      },
    ],
  },
  {
    id: "azure-folding-metal-chair",
    handle: "azure-folding-metal-chair",
    title: "Azure Folding Metal Chair",
    description:
      "A bold electric-blue folding chair made of powder-coated steel — lightweight, stackable, and ready for any space.",
    descriptionHtml:
      "<p>Bold, functional, and effortlessly cool — the Azure Folding Chair adds a vibrant pop of color wherever you need extra seating. Built from powder-coated steel in a striking electric blue, it's lightweight yet durable, perfect for casual dining, events, or creative studios. Folds flat for easy storage and transport.</p>",
    categoryId: "top-seller",
    tags: [],
    featuredImage: {
      altText: "Azure Folding Metal Chair",
      url: "/sfcc/Azure_chair_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "78", currencyCode: "GBP" },
      minVariantPrice: { amount: "78", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Azure Folding Metal Chair",
        url: "/sfcc/Azure_chair_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [
      {
        id: "color",
        name: "Color",
        values: [{ id: "blue", name: "Blue" }],
      },
    ],
    seo: { title: "", description: "" },
    variants: [
      {
        id: "azure-folding-metal-chair-1",
        title: "Azure Folding Metal Chair",
        availableForSale: true,
        selectedOptions: [{ name: "color", value: "blue" }],
        price: { amount: "78", currencyCode: "GBP" },
      },
    ],
  },
  {
    id: "ra-round-velvet-cushion",
    handle: "ra-round-velvet-cushion",
    title: "Ra Round Velvet Cushion",
    description:
      "A round velvet cushion in bold pink with soft pleats and plush comfort — playful, modern, and cozy.",
    descriptionHtml:
      "<p>The Ra Cushion is a plush round accent that brings softness and style in equal measure. Wrapped in a rich pink velvet with deep radial tufting, it adds a sculptural touch to sofas, beds, or lounge chairs. The compact, donut-inspired shape makes it a playful yet elegant addition to any cozy corner.</p>",
    categoryId: "pillows",
    tags: [],
    featuredImage: {
      altText: "Ra Round Velvet Cushion",
      url: "/sfcc/Ra_cushion_color_yellow_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "150", currencyCode: "GBP" },
      minVariantPrice: { amount: "150", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Ra Round Velvet Cushion",
        url: "/sfcc/Ra_cushion_color_yellow_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [
      {
        id: "color",
        name: "Color",
        values: [
          { id: "yellow", name: "Yellow" },
          { id: "pink", name: "Pink" },
        ],
      },
    ],
    seo: { title: "", description: "" },
    variants: [
      {
        id: "ra-round-velvet-cushion-1",
        title: "Ra Round Velvet Cushion",
        availableForSale: true,
        selectedOptions: [{ name: "color", value: "yellow" }],
        price: { amount: "150", currencyCode: "GBP" },
      },
      {
        id: "ra-round-velvet-cushion-2",
        title: "Ra Round Velvet Cushion",
        availableForSale: true,
        selectedOptions: [{ name: "color", value: "pink" }],
        price: { amount: "150", currencyCode: "GBP" },
      },
    ],
  },
  {
    id: "nagoya-sculptural-table-lamp",
    handle: "nagoya-sculptural-table-lamp",
    title: "Nagoya Sculptural Table Lamp",
    description:
      "A sculptural gloss black table lamp with brass details — bold, elegant, and built to glow with character.",
    descriptionHtml:
      "<p>The Nagoya Table Lamp fuses art deco flair with futuristic design. Its bold, high-gloss black body rises into a sculptural silhouette, topped with a shallow disc shade in matching black and brushed brass accents. A true statement piece, it casts ambient light that feels both moody and elegant — ideal for nightstands, consoles, or dramatic corners.</p>",
    categoryId: "lamps",
    tags: [],
    featuredImage: {
      altText: "Nagoya Sculptural Table Lamp",
      url: "/sfcc/Nagoya_lamp_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "179", currencyCode: "GBP" },
      minVariantPrice: { amount: "179", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Nagoya Sculptural Table Lamp",
        url: "/sfcc/Nagoya_lamp_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [],
    seo: { title: "", description: "" },
    variants: [],
  },
  {
    id: "ranch-hide-patchwork-rug",
    handle: "ranch-hide-patchwork-rug",
    title: "Ranch Hide Patchwork Rug",
    description:
      "A hand-stitched cowhide patchwork rug with rich tones and natural spotted patterns — rugged, warm, and one-of-a-kind.",
    descriptionHtml:
      "<p>The Ranch Rug blends natural textures and wild elegance in a striking patchwork of genuine cowhide. Featuring a mosaic of hand-cut shapes in rich browns, creams, and spotted patterns, it brings a bold, organic touch to modern or rustic spaces. Each rug is one-of-a-kind, with unique color variations and textures that make it a true statement piece.</p>",
    categoryId: "rugs",
    tags: [],
    featuredImage: {
      altText: "Ranch Hide Patchwork Rug",
      url: "/sfcc/Ranch_rug_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "349", currencyCode: "GBP" },
      minVariantPrice: { amount: "349", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Ranch Hide Patchwork Rug",
        url: "/sfcc/Ranch_rug_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [],
    seo: { title: "", description: "" },
    variants: [],
  },
  {
    id: "nest-black-pendant-lamp",
    handle: "nest-black-pendant-lamp",
    title: "Nest Black Pendant Lamp",
    description:
      "A matte black pendant lamp with a woven texture and warm gold interior—minimal, moody, and refined.",
    descriptionHtml:
      "<p>The Nest Pendant Lamp brings understated elegance to any room with its clean lines and tactile texture. Crafted from matte black woven material, the shade features a softly tapered top and cylindrical form that casts a warm, focused glow. Ideal for dining areas, entryways, or cozy corners, this fixture adds quiet drama without overpowering the space.</p>",
    categoryId: "lamps",
    tags: [],
    featuredImage: {
      altText: "Nest Black Pendant Lamp",
      url: "/sfcc/Nest_lamp_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "139", currencyCode: "GBP" },
      minVariantPrice: { amount: "139", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Nest Black Pendant Lamp",
        url: "/sfcc/Nest_lamp_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [],
    seo: { title: "", description: "" },
    variants: [],
  },
  {
    id: "duna-pistachio-lounge-chair",
    handle: "duna-pistachio-lounge-chair",
    title: "Duna Pistachio Lounge Chair",
    description:
      "A sculptural lounge chair in pistachio green with wood legs — soft curves and fresh color for modern interiors.",
    descriptionHtml:
      "<p>The Duna Lounge Chair brings soft curves and fresh color to modern interiors. Upholstered in a smooth pistachio green finish with a molded silhouette and subtle button details, it combines comfort and style effortlessly. The solid wood legs offer a warm, natural contrast, making this chair an inviting accent for living rooms, reading nooks, or creative studios.</p>",
    categoryId: "seats",
    tags: [],
    featuredImage: {
      altText: "Duna Pistachio Lounge Chair",
      url: "/sfcc/Duna_Seat_Color_Green_2.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "229", currencyCode: "GBP" },
      minVariantPrice: { amount: "229", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Duna Pistachio Lounge Chair",
        url: "/sfcc/Duna_Seat_Color_Green_2.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [
      {
        id: "color",
        name: "Color",
        values: [
          { id: "pistachio", name: "Pistachio" },
          { id: "pistachio/cream", name: "Pistachio/Cream" },
        ],
      },
    ],
    seo: { title: "", description: "" },
    variants: [
      {
        id: "duna-pistachio-lounge-chair-1",
        title: "Duna Pistachio Lounge Chair",
        availableForSale: true,
        selectedOptions: [{ name: "color", value: "pistachio" }],
        price: { amount: "229", currencyCode: "GBP" },
      },
      {
        id: "duna-pistachio-lounge-chair-2",
        title: "Duna Pistachio Lounge Chair",
        availableForSale: true,
        selectedOptions: [{ name: "color", value: "pistachio/cream" }],
        price: { amount: "229", currencyCode: "GBP" },
      },
    ],
  },
  {
    id: "suryai-glass-table-lamp",
    handle: "suryai-glass-table-lamp",
    title: "Suryai Glass Table Lamp",
    description:
      "A classic table lamp with a glossy black glass base and cream shade — refined, warm, and timeless.",
    descriptionHtml:
      "<p>The Suryai Table Lamp brings timeless elegance and subtle contrast to your space. Featuring a high-gloss black glass base in a soft teardrop shape and topped with a classic cream fabric shade, it delivers warm, ambient lighting with refined style. Perfect for bedside tables, living room consoles, or reading nooks.</p>",
    categoryId: "lamps",
    tags: [],
    featuredImage: {
      altText: "Suryai Glass Table Lamp",
      url: "/sfcc/Suryai_lamp_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "139", currencyCode: "GBP" },
      minVariantPrice: { amount: "139", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Suryai Glass Table Lamp",
        url: "/sfcc/Suryai_lamp_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [],
    seo: { title: "", description: "" },
    variants: [],
  },
  {
    id: "adhana-wooden-pendant-lamp",
    handle: "adhana-wooden-pendant-lamp",
    title: "Adhana Wooden Pendant Lamp",
    description:
      "A handcrafted wood pendant lamp with a sculpted cone shape, perfect for adding natural warmth and soft light to your space.",
    descriptionHtml:
      "<p>The Adhana Pendant Lamp brings warmth and organic charm to any interior. Crafted from natural wood with a smooth, sculpted silhouette, this lamp blends minimalism and nature in a timeless cone shape that radiates soft, downward light—perfect over dining tables, kitchen islands, or cozy corners.</p>",
    categoryId: "lamps",
    tags: [],
    featuredImage: {
      altText: "Adhana Wooden Pendant Lamp",
      url: "/sfcc/Adhana_lamp_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "130", currencyCode: "GBP" },
      minVariantPrice: { amount: "130", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Adhana Wooden Pendant Lamp",
        url: "/sfcc/Adhana_lamp_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [
      {
        id: "color",
        name: "Color",
        values: [{ id: "beige", name: "Beige" }],
      },
    ],
    seo: { title: "", description: "" },
    variants: [
      {
        id: "adhana-wooden-pendant-lamp-1",
        title: "Adhana Wooden Pendant Lamp",
        availableForSale: true,
        selectedOptions: [{ name: "color", value: "beige" }],
        price: { amount: "130", currencyCode: "GBP" },
      },
    ],
  },
  {
    id: "bliss-arched-desk-lamp",
    handle: "bliss-arched-desk-lamp",
    title: "Bliss Arched Desk Lamp",
    description:
      "A softly curved matte white desk lamp with a wood base and gold accent, perfect for warm, focused lighting.",
    descriptionHtml:
      "<p>The Bliss Desk Lamp is a calming blend of soft curves and warm materials. Featuring a smooth matte dome shade, arched metal arm, and a solid wood base, it brings modern serenity to any workspace or bedside. The subtle gold accent adds just enough contrast to elevate its clean design.</p>",
    categoryId: "lamps",
    tags: [],
    featuredImage: {
      altText: "Bliss Arched Desk Lamp",
      url: "/sfcc/Bliss_lamp_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "109", currencyCode: "GBP" },
      minVariantPrice: { amount: "109", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Bliss Arched Desk Lamp",
        url: "/sfcc/Bliss_lamp_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [
      {
        id: "color",
        name: "Color",
        values: [{ id: "beige", name: "Beige" }],
      },
    ],
    seo: { title: "", description: "" },
    variants: [
      {
        id: "bliss-arched-desk-lamp-1",
        title: "Bliss Arched Desk Lamp",
        availableForSale: true,
        selectedOptions: [{ name: "color", value: "beige" }],
        price: { amount: "109", currencyCode: "GBP" },
      },
    ],
  },
  {
    id: "sheila-round-waterflow-rug",
    handle: "sheila-round-waterflow-rug",
    title: "Sheila Round Waterflow Rug",
    description:
      "A round rug with flowing blue tones and a water-inspired pattern — soft, modern, and serene.",
    descriptionHtml:
      "<p>The Sheila Rug makes a serene splash with its flowing, water-inspired pattern in layered shades of blue and soft white. Crafted in a circular shape, this modern rug brings movement and calm to any space — from living rooms to bedrooms or creative studios. Its low-pile, tufted texture offers both visual depth and soft comfort underfoot.</p>",
    categoryId: "rugs",
    tags: [],
    featuredImage: {
      altText: "Sheila Round Waterflow Rug",
      url: "/sfcc/Sheila_rug_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "199", currencyCode: "GBP" },
      minVariantPrice: { amount: "199", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Sheila Round Waterflow Rug",
        url: "/sfcc/Sheila_rug_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [],
    seo: { title: "", description: "" },
    variants: [],
  },
  {
    id: "faun-textured-throw-pillow",
    handle: "faun-textured-throw-pillow",
    title: "Faun Textured Throw Pillow",
    description:
      "A plush throw pillow with a raised chevron texture and gradient fade from olive to rust — cozy, earthy, and bold.",
    descriptionHtml:
      "<p>The Faun Throw Pillow brings warmth, texture, and depth to your space with its gradient olive-to-rust color fade and raised geometric pattern. Made from ultra-soft fabric with a plush insert, it's perfect for adding cozy sophistication to your sofa, lounge chair, or bed. A subtle statement piece that blends comfort and modern design.</p>",
    categoryId: "pillows",
    tags: [],
    featuredImage: {
      altText: "Faun Textured Throw Pillow",
      url: "/sfcc/Faun_pillow_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "45", currencyCode: "GBP" },
      minVariantPrice: { amount: "45", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Faun Textured Throw Pillow",
        url: "/sfcc/Faun_pillow_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [
      {
        id: "color",
        name: "Color",
        values: [{ id: "olive", name: "Olive" }],
      },
    ],
    seo: { title: "", description: "" },
    variants: [
      {
        id: "faun-textured-throw-pillow-1",
        title: "Faun Textured Throw Pillow",
        availableForSale: true,
        selectedOptions: [{ name: "color", value: "olive" }],
        price: { amount: "45", currencyCode: "GBP" },
      },
    ],
  },
  {
    id: "abba-lamp",
    handle: "abba-lamp",
    title: "Abba Table Lamp",
    description:
      "A modern table lamp with a matte black conical base and green fabric shade with a gold interior — perfect for adding warm, ambient light to any space.",
    descriptionHtml:
      "<p>Minimalist elegance meets modern functionality in this table lamp. Designed with a sleek matte black conical base and a deep green fabric shade with a warm gold interior, it adds a refined touch to any space — from bedside tables to reading nooks.</p>",
    categoryId: "lamps",
    tags: [],
    featuredImage: {
      altText: "Abba Table Lamp",
      url: "/sfcc/Abba_lamp_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "130", currencyCode: "GBP" },
      minVariantPrice: { amount: "130", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Abba Table Lamp",
        url: "/sfcc/Abba_lamp_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [
      {
        id: "color",
        name: "Color",
        values: [{ id: "green/black", name: "Green/Black" }],
      },
    ],
    seo: { title: "", description: "" },
    variants: [
      {
        id: "abba-lamp-1",
        title: "Abba Table Lamp",
        availableForSale: true,
        selectedOptions: [{ name: "color", value: "green/black" }],
        price: { amount: "130", currencyCode: "GBP" },
      },
    ],
  },
  {
    id: "chief-modern-lounge-chair",
    handle: "chief-modern-lounge-chair",
    title: "Chief Modern Lounge Chair",
    description:
      "A bold black lounge chair with gold legs and sculpted comfort — built to stand out in any modern space.",
    descriptionHtml:
      "<p>The Chief Lounge Chair is where bold design meets everyday luxury. Featuring a sculpted, ergonomic seat wrapped in smooth black faux leather and supported by a gleaming gold-finished frame, it makes a powerful visual statement in any space. Perfectly contoured for comfort, it's ideal for living rooms, studios, or standout corners in modern interiors.</p>",
    categoryId: "seats",
    tags: [],
    featuredImage: {
      altText: "Chief Modern Lounge Chair",
      url: "/sfcc/Chief_seat_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "249", currencyCode: "GBP" },
      minVariantPrice: { amount: "249", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Chief Modern Lounge Chair",
        url: "/sfcc/Chief_seat_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [
      {
        id: "color",
        name: "Color",
        values: [{ id: "black", name: "Black" }],
      },
    ],
    seo: { title: "", description: "" },
    variants: [
      {
        id: "chief-modern-lounge-chair-1",
        title: "Chief Modern Lounge Chair",
        availableForSale: true,
        selectedOptions: [{ name: "color", value: "black" }],
        price: { amount: "249", currencyCode: "GBP" },
      },
    ],
  },
  {
    id: "mika-minimalist-ceramic-planter",
    handle: "mika-minimalist-ceramic-planter",
    title: "Mika Minimalist Ceramic Planter",
    description:
      "A soft white ceramic planter with subtle speckles—minimalist and perfect for small indoor plants.",
    descriptionHtml:
      "<p>The Mika Planter pairs simplicity and charm in a smooth, speckled ceramic form. With its rounded silhouette and matte finish, it's the perfect home for succulents, cacti, or small houseplants. Its neutral tone complements any color palette, making it a go-to accent for desks, shelves, or sunny windowsills.</p>",
    categoryId: "miscellaneous",
    tags: [],
    featuredImage: {
      altText: "Mika Minimalist Ceramic Planter",
      url: "/sfcc/Mika_Pot_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "29", currencyCode: "GBP" },
      minVariantPrice: { amount: "29", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Mika Minimalist Ceramic Planter",
        url: "/sfcc/Mika_Pot_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [],
    seo: { title: "", description: "" },
    variants: [],
  },
  {
    id: "memphis-marble-pattern-rug",
    handle: "memphis-marble-pattern-rug",
    title: "Memphis Marble Pattern Rug",
    description:
      "A vibrant low-pile rug with a swirling marble pattern in orange, olive, and sand—retro energy meets modern design.",
    descriptionHtml:
      "<p>The Memphis Rug brings bold, organic movement into your space with its swirling marble-inspired pattern in fiery orange, olive, sand, and gray tones. Crafted with ultra-soft synthetic fibers and a low pile height, it's both visually striking and cozy underfoot—perfect for anchoring living rooms, bedrooms, or creative studios with a touch of retro-modern flair.</p>",
    categoryId: "rugs",
    tags: [],
    featuredImage: {
      altText: "Memphis Marble Pattern Rug",
      url: "/sfcc/Memphis_rug_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "189", currencyCode: "GBP" },
      minVariantPrice: { amount: "189", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Memphis Marble Pattern Rug",
        url: "/sfcc/Memphis_rug_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [],
    seo: { title: "", description: "" },
    variants: [],
  },
  {
    id: "kaya-ceramic-humidifier",
    handle: "kaya-ceramic-humidifier",
    title: "Kaya Ceramic Humidifier",
    description:
      "A passive ceramic humidifier in matte olive green — stylish, silent, and ideal for dry indoor spaces.",
    descriptionHtml:
      "<p>The Kaya Ceramic Humidifier is a minimalist wellness essential that doubles as a sculptural accent. Made from matte-finish ceramic in a deep olive tone, its ridged form disperses moisture passively—no power required. Just add water and place near a heat source or sunny window to naturally improve your room's humidity and comfort.</p>",
    categoryId: "miscellaneous",
    tags: [],
    featuredImage: {
      altText: "Kaya Ceramic Humidifier",
      url: "/sfcc/Kaya_humidifier_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "69", currencyCode: "GBP" },
      minVariantPrice: { amount: "69", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Kaya Ceramic Humidifier",
        url: "/sfcc/Kaya_humidifier_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [],
    seo: { title: "", description: "" },
    variants: [],
  },
  {
    id: "kaya-ceramic-humidifier",
    handle: "kaya-ceramic-humidifier",
    title: "Kaya Ceramic Humidifier",
    description:
      "A passive ceramic humidifier in matte olive green — stylish, silent, and ideal for dry indoor spaces.",
    descriptionHtml:
      "<p>The Kaya Ceramic Humidifier is a minimalist wellness essential that doubles as a sculptural accent. Made from matte-finish ceramic in a deep olive tone, its ridged form disperses moisture passively—no power required. Just add water and place near a heat source or sunny window to naturally improve your room's humidity and comfort.</p>",
    categoryId: "top-seller",
    tags: [],
    featuredImage: {
      altText: "Kaya Ceramic Humidifier",
      url: "/sfcc/Kaya_humidifier_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "69", currencyCode: "GBP" },
      minVariantPrice: { amount: "69", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Kaya Ceramic Humidifier",
        url: "/sfcc/Kaya_humidifier_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [],
    seo: { title: "", description: "" },
    variants: [],
  },
  {
    id: "alloy-plywood-side-chair",
    handle: "alloy-plywood-side-chair",
    title: "Alloy Plywood Side Chair",
    description:
      "A mid-century inspired plywood chair with chrome legs, perfect for modern dining or workspaces.",
    descriptionHtml:
      "<p>The Alloy Side Chair strikes the perfect balance between form and function. Featuring a molded plywood seat with a natural wood finish and a contoured backrest, it offers everyday comfort with iconic mid-century style. Its slender chrome legs bring a light, airy feel that works effortlessly in dining rooms, offices, or creative spaces.</p>",
    categoryId: "seats",
    tags: [],
    featuredImage: {
      altText: "Alloy Plywood Side Chair",
      url: "/sfcc/Alloy_chair_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "149", currencyCode: "GBP" },
      minVariantPrice: { amount: "149", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Alloy Plywood Side Chair",
        url: "/sfcc/Alloy_chair_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [
      {
        id: "color",
        name: "Color",
        values: [{ id: "beige", name: "Beige" }],
      },
    ],
    seo: { title: "", description: "" },
    variants: [
      {
        id: "alloy-plywood-side-chair-1",
        title: "Alloy Plywood Side Chair",
        availableForSale: true,
        selectedOptions: [{ name: "color", value: "beige" }],
        price: { amount: "149", currencyCode: "GBP" },
      },
    ],
  },
  {
    id: "soda-fluid-shape-rug",
    handle: "soda-fluid-shape-rug",
    title: "Soda Fluid Shape Rug",
    description:
      "An irregular blue rug with wavy patterns and bold texture — a sculptural splash of color and shape.",
    descriptionHtml:
      "<p>The Soda Rug flows with personality, combining irregular organic form with a dynamic mix of blue tones. Its wavy pattern in navy, cobalt, and sky creates a sense of movement, while the asymmetrical cut adds a sculptural touch to any space. Soft underfoot and visually bold, it's ideal for living areas, studios, or anywhere you want to spark creativity.</p>",
    categoryId: "rugs",
    tags: [],
    featuredImage: {
      altText: "Soda Fluid Shape Rug",
      url: "/sfcc/Soda_rug_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "219", currencyCode: "GBP" },
      minVariantPrice: { amount: "219", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Soda Fluid Shape Rug",
        url: "/sfcc/Soda_rug_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [],
    seo: { title: "", description: "" },
    variants: [],
  },
  {
    id: "pomme-shell-armchair-pink",
    handle: "pomme-shell-armchair-pink",
    title: "Pomme Shell Armchair",
    description:
      "A modern pink molded armchair with metal legs and iconic curves — playful, practical, and stylish.",
    descriptionHtml:
      "<p>The Pomme Shell Armchair blends iconic mid-century lines with a playful modern hue. Its molded pink polypropylene seat features smooth curves and integrated armrests for everyday comfort, supported by sleek metal legs with crisscross reinforcements. Ideal for dining, working, or adding a vibrant accent to any space.</p>",
    categoryId: "seats",
    tags: [],
    featuredImage: {
      altText: "Pomme Shell Armchair",
      url: "/sfcc/Pomme_chair_1.png",
      width: 1200,
      height: 1200,
    },
    availableForSale: true,
    currencyCode: "GBP",
    priceRange: {
      maxVariantPrice: { amount: "119", currencyCode: "GBP" },
      minVariantPrice: { amount: "119", currencyCode: "GBP" },
    },
    images: [
      {
        altText: "Pomme Shell Armchair",
        url: "/sfcc/Pomme_chair_1.png",
        width: 1200,
        height: 1200,
      },
    ],
    options: [],
    seo: { title: "", description: "" },
    variants: [],
  },
];
