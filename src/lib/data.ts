// Studio 7x12 — content source of truth
// Real data + placeholders. Swap as client supplies.

export const STUDIO = {
  name: "Studio 7x12",
  tagline: "Unisex Salon & Spa",
  city: "Anand",
  fullAddress:
    "Shop 10-11-12, 4th Floor, Krishna Aron, opp. Sanket Sales India, behind Iris Hospital, 60 Feet Road, Anand, Gujarat 388001",
  shortAddress: "60 Feet Road, Anand",
  phone: "+91 99094 14426",
  phoneRaw: "919909414426",
  hours: { open: "08:00", close: "21:30", label: "8 AM – 9:30 PM, all days" },
  rating: 4.5,
  reviewCount: 90,
  stylistCount: 13,
  instagram: "https://www.instagram.com/studio7x12",
  facebook: "https://www.facebook.com/sudo7x12salon/",
  mapsEmbed:
    "https://www.google.com/maps/embed/v1/place?key=PLACEHOLDER&q=Studio+7x12+Salon+and+Spa+Anand",
  mapsLink: "https://maps.google.com/?q=Studio+7x12+Salon+and+Spa+Anand",
};

export type ToolKind =
  | "scissor"
  | "comb"
  | "razor"
  | "brush"
  | "polish"
  | "lipstick";

export type Service = {
  id: string;
  tool: ToolKind;
  category: string;
  title: string;
  description: string;
  priceFrom: number;
  priceTo: number;
  duration: string;
  hindi?: string;
};

export const SERVICES: Service[] = [
  {
    id: "hair",
    tool: "scissor",
    category: "Hair",
    title: "Cuts, Styling & Colour",
    description:
      "From a classic crop to balayage and global colour — handled by senior stylists trained in international techniques.",
    priceFrom: 300,
    priceTo: 4500,
    duration: "30 – 120 min",
    hindi: "बाल",
  },
  {
    id: "beard",
    tool: "razor",
    category: "Beard & Grooming",
    title: "The Gentleman's Chair",
    description:
      "Hot towel, sculpted beard work, straight-razor shaves and skin-soothing post-care. Built for the modern Anand man.",
    priceFrom: 250,
    priceTo: 1200,
    duration: "20 – 60 min",
    hindi: "दाढ़ी",
  },
  {
    id: "spa",
    tool: "brush",
    category: "Spa & Skin",
    title: "Restorative Spa Therapies",
    description:
      "Hydra facials, deep-tissue head spa, body polish and aromatherapy — your hour of quiet, ten floors above 60 Feet Road.",
    priceFrom: 800,
    priceTo: 5500,
    duration: "45 – 90 min",
    hindi: "स्पा",
  },
  {
    id: "nails",
    tool: "polish",
    category: "Hands & Feet",
    title: "Nail Art & Spa Pedi",
    description:
      "Gel extensions, chrome finishes, hand-painted art and our signature 7-step spa pedicure with hot stone.",
    priceFrom: 500,
    priceTo: 2800,
    duration: "30 – 90 min",
    hindi: "नाखून",
  },
  {
    id: "bridal",
    tool: "lipstick",
    category: "Bridal",
    title: "Your Wedding, Our Craft",
    description:
      "Airbrush base, HD finish, draping, hair design and trials. Packages from engagement to reception, on-location available.",
    priceFrom: 2000,
    priceTo: 20000,
    duration: "Half / Full day",
    hindi: "दुल्हन",
  },
  {
    id: "trim",
    tool: "comb",
    category: "Quick Trim",
    title: "Walk-in & Express",
    description:
      "Five-minute fixes, fringe trims, beard line-ups and on-the-go styling. No appointment, no wait beyond ten minutes.",
    priceFrom: 150,
    priceTo: 400,
    duration: "5 – 15 min",
    hindi: "क्विक",
  },
];

// Placeholder stylists — swap with real names from client
export const STYLISTS = [
  { name: "Rohit", role: "Master Stylist", specialty: "Hair colour & balayage", years: 9, sign: "♌" },
  { name: "Priya", role: "Bridal Lead", specialty: "HD airbrush makeup", years: 11, sign: "♓" },
  { name: "Aditya", role: "Senior Barber", specialty: "Beard sculpting", years: 7, sign: "♉" },
  { name: "Meera", role: "Skin Therapist", specialty: "Hydra facials", years: 6, sign: "♎" },
  { name: "Kunal", role: "Stylist", specialty: "Men's grooming", years: 5, sign: "♈" },
  { name: "Sneha", role: "Nail Artist", specialty: "Gel extensions, art", years: 4, sign: "♊" },
  { name: "Devansh", role: "Stylist", specialty: "Texture cuts", years: 6, sign: "♏" },
  { name: "Arpita", role: "Senior Stylist", specialty: "Keratin & smoothing", years: 8, sign: "♑" },
  { name: "Yash", role: "Barber", specialty: "Classic shaves", years: 4, sign: "♒" },
  { name: "Riya", role: "Spa Therapist", specialty: "Aromatherapy", years: 5, sign: "♋" },
  { name: "Karan", role: "Stylist", specialty: "Editorial styling", years: 6, sign: "♐" },
  { name: "Nikita", role: "Makeup Artist", specialty: "Party & engagement", years: 5, sign: "♍" },
  { name: "Harsh", role: "Junior Stylist", specialty: "Wash & blow-dry", years: 3, sign: "♈" },
];

// 7×12 grid = 84 tiles. Mix of categories.
// In production these become real photos from /public/grid/01..84.jpg
export type Tile = {
  id: number;
  kind: "photo" | "text" | "stat" | "blank";
  span?: { col?: number; row?: number };
  text?: string;
  sub?: string;
  emphasis?: boolean;
};

const RAW_TILES: Partial<Tile>[] = [
  { id: 3, kind: "text", text: "since", sub: "2018", emphasis: true, span: { col: 2 } },
  { id: 8, kind: "stat", text: "13", sub: "stylists" },
  { id: 11, kind: "stat", text: "4.5★", sub: "90+ reviews" },
  { id: 17, kind: "text", text: "Anand's", sub: "largest", span: { col: 2 } },
  { id: 22, kind: "stat", text: "84", sub: "tiles, on purpose" },
  { id: 28, kind: "text", text: "Hair", emphasis: true },
  { id: 33, kind: "text", text: "Beard" },
  { id: 38, kind: "text", text: "Skin", emphasis: true },
  { id: 41, kind: "text", text: "Nails" },
  { id: 47, kind: "text", text: "Bridal", emphasis: true, span: { col: 2 } },
  { id: 55, kind: "text", text: "Spa" },
  { id: 60, kind: "stat", text: "8AM", sub: "9:30PM" },
  { id: 68, kind: "text", text: "60 Feet Rd", sub: "Anand" },
  { id: 74, kind: "stat", text: "365", sub: "days/yr" },
  { id: 80, kind: "text", text: "7×12", sub: "= 84", emphasis: true },
];

export const TILES: Tile[] = Array.from({ length: 84 }, (_, i): Tile => {
  const id = i + 1;
  const override = RAW_TILES.find((t) => t.id === id);
  if (override) return { id, kind: "photo", ...override } as Tile;
  // Pattern: every 3rd default is a "blank" tinted card for breathing room
  if (id % 7 === 0) return { id, kind: "blank" };
  return { id, kind: "photo" };
});

export const TESTIMONIALS = [
  {
    quote:
      "Best salon I've been to in Anand. Rohit gave me a haircut I'd seen on Pinterest and it actually looked like the picture.",
    author: "Anjali P.",
    source: "Google review",
  },
  {
    quote:
      "Got my bridal trial here and the team made me cry — in a good way. Worth every rupee of the package.",
    author: "Khushi M.",
    source: "Google review",
  },
  {
    quote:
      "Walked in for a beard trim, left feeling like a different person. Aditya knows what he's doing.",
    author: "Parth S.",
    source: "Google review",
  },
];
