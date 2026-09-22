import classicTote from "@/assets/bag-classic-tote.jpg";
import roseSatchel from "@/assets/bag-rose-satchel.jpg";
import signatureBag from "@/assets/bag-signature.jpg";
import miniCrossbody from "@/assets/bag-mini-crossbody.jpg";
import eveningClutch from "@/assets/bag-evening-clutch.jpg";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  details: string;
  dimensions: string;
  care: string;
  price: number;
  category: CategorySlug;
  style: string;
  colors: string[];
  images: string[];
  stock: number;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
};

export type CategorySlug = "classic" | "feminine" | "signature" | "everyday";

export type Collection = {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
};

export const collections: Collection[] = [
  {
    slug: "classic",
    name: "The Classic Edit",
    description: "Timeless handbags for everyday elegance.",
    image: classicTote,
  },
  {
    slug: "feminine",
    name: "The Feminine Edit",
    description: "Soft and graceful styles with romantic details.",
    image: roseSatchel,
  },
  {
    slug: "signature",
    name: "The Signature Edit",
    description: "Statement pieces designed to stand out.",
    image: signatureBag,
  },
  {
    slug: "everyday",
    name: "The Everyday Edit",
    description: "Practical luxury designed for everyday life.",
    image: miniCrossbody,
  },
];

/**
 * Product catalogue. To add a bag, append an entry below — every page,
 * search, filter and WhatsApp order message reads from this list.
 */
export const products: Product[] = [
  {
    id: "el-001",
    name: "Essy Classic Tote",
    slug: "essy-classic-tote",
    description:
      "A softly structured canvas tote finished with warm leather handles — made to carry your day beautifully.",
    details: "Textured canvas body with smooth leather trim and handles. Lined interior with a slip pocket.",
    dimensions: "Approx. 34cm W × 28cm H × 13cm D. Handle drop approx. 22cm.",
    care: "Keep away from damp surfaces. Wipe gently with a soft dry cloth and store in the dust bag.",
    price: 5500,
    category: "classic",
    style: "Tote",
    colors: ["Ivory", "Brown", "Beige"],
    images: [classicTote, signatureBag],
    stock: 6,
    featured: true,
    newArrival: false,
    bestSeller: true,
  },
  {
    id: "el-002",
    name: "Essy Rose Satchel",
    slug: "essy-rose-satchel",
    description:
      "A romantic blush satchel with a polished clasp and a graceful top handle for softly feminine days.",
    details: "Grained leather-look finish with champagne-tone hardware and a secure front clasp.",
    dimensions: "Approx. 26cm W × 19cm H × 12cm D. Handle drop approx. 9cm.",
    care: "Avoid direct sunlight for long periods. Wipe with a soft dry cloth.",
    price: 4500,
    category: "feminine",
    style: "Satchel",
    colors: ["Blush Pink", "Ivory"],
    images: [roseSatchel, eveningClutch],
    stock: 8,
    featured: true,
    newArrival: true,
    bestSeller: true,
  },
  {
    id: "el-003",
    name: "Essy Signature Bag",
    slug: "essy-signature-bag",
    description:
      "Our signature shoulder silhouette in warm brown, finished with a sculptural clasp — quietly confident.",
    details: "Smooth leather-look body, adjustable shoulder strap and a gold-tone signature lock.",
    dimensions: "Approx. 30cm W × 18cm H × 8cm D. Adjustable strap.",
    care: "Store upright, stuffed lightly to keep its shape.",
    price: 6000,
    category: "signature",
    style: "Shoulder bag",
    colors: ["Brown", "Chocolate"],
    images: [signatureBag, classicTote],
    stock: 4,
    featured: true,
    newArrival: false,
    bestSeller: true,
  },
  {
    id: "el-004",
    name: "Essy Mini Crossbody",
    slug: "essy-mini-crossbody",
    description:
      "A petite ivory crossbody with a slim brown strap — the easiest kind of everyday luxury.",
    details: "Compact structured body with a magnetic-style clasp and adjustable crossbody strap.",
    dimensions: "Approx. 20cm W × 15cm H × 7cm D.",
    care: "Wipe gently with a soft dry cloth. Keep away from perfume and lotions.",
    price: 3200,
    category: "everyday",
    style: "Crossbody",
    colors: ["Ivory", "Brown"],
    images: [miniCrossbody, roseSatchel],
    stock: 10,
    featured: true,
    newArrival: true,
    bestSeller: false,
  },
  {
    id: "el-005",
    name: "Essy Evening Clutch",
    slug: "essy-evening-clutch",
    description:
      "A champagne clutch with a delicate clasp, styled for evenings that deserve something beautiful.",
    details: "Slim structured clutch with a soft lining and a fine detachable chain.",
    dimensions: "Approx. 24cm W × 13cm H × 5cm D.",
    care: "Store flat in the dust bag away from sharp objects.",
    price: 3800,
    category: "signature",
    style: "Clutch",
    colors: ["Champagne", "Ivory"],
    images: [eveningClutch, roseSatchel],
    stock: 5,
    featured: false,
    newArrival: true,
    bestSeller: false,
  },
  {
    id: "el-006",
    name: "Essy Everyday Shopper",
    slug: "essy-everyday-shopper",
    description:
      "A roomy ivory shopper with warm leather handles, made for work, weekends and everything between.",
    details: "Generous unlined-look interior with an inner pouch and reinforced handles.",
    dimensions: "Approx. 38cm W × 30cm H × 14cm D.",
    care: "Wipe gently with a soft dry cloth; avoid soaking the canvas.",
    price: 4900,
    category: "everyday",
    style: "Tote",
    colors: ["Ivory", "Beige"],
    images: [classicTote, miniCrossbody],
    stock: 0,
    featured: false,
    newArrival: false,
    bestSeller: true,
  },
  {
    id: "el-007",
    name: "Essy Blush Top Handle",
    slug: "essy-blush-top-handle",
    description:
      "A softly rounded top-handle bag in blush, with quiet gold details and a graceful shape.",
    details: "Structured body, short top handle and an optional shoulder strap.",
    dimensions: "Approx. 25cm W × 18cm H × 11cm D.",
    care: "Keep dry and store in the dust bag.",
    price: 4200,
    category: "feminine",
    style: "Top handle",
    colors: ["Blush Pink", "Rose"],
    images: [roseSatchel, eveningClutch],
    stock: 7,
    featured: false,
    newArrival: true,
    bestSeller: false,
  },
  {
    id: "el-008",
    name: "Essy Ivory Saddle",
    slug: "essy-ivory-saddle",
    description:
      "A gently curved saddle bag in ivory with a warm brown strap — elegant, easy and endlessly wearable.",
    details: "Curved flap with a gold-tone closure and an adjustable strap.",
    dimensions: "Approx. 22cm W × 17cm H × 8cm D.",
    care: "Wipe gently with a soft dry cloth.",
    price: 3600,
    category: "classic",
    style: "Saddle",
    colors: ["Ivory", "Brown"],
    images: [miniCrossbody, classicTote],
    stock: 9,
    featured: false,
    newArrival: false,
    bestSeller: false,
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function relatedProducts(product: Product, limit = 4) {
  return products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, limit);
}

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) =>
    [p.name, p.description, p.style, p.category, ...p.colors, p.newArrival ? "new arrivals" : ""]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export const allColors = Array.from(new Set(products.flatMap((p) => p.colors))).sort();
export const allStyles = Array.from(new Set(products.map((p) => p.style))).sort();
