export const ESSY_LUX_CONFIG = {
  brandName: "ESSY-LUX",
  tagline: "LUXURY BAGS",
  phone: "0113835508",
  whatsappNumber: "254113835508",
  location: "Mombasa – Bamburi, Kenya",
  currency: "KES",
  instagramHandle: "@essylux",
  /** Set real links here when the accounts are confirmed. */
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },
} as const;

export function formatPrice(amount: number) {
  return `${ESSY_LUX_CONFIG.currency} ${amount.toLocaleString("en-KE")}`;
}

export function whatsappUrl(message: string) {
  return `https://wa.me/${ESSY_LUX_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string) {
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
}

export type CustomerDetails = {
  name: string;
  phone: string;
  location: string;
  note?: string;
};

export type OrderLine = {
  name: string;
  color: string;
  quantity: number;
  price: number;
};

const NUMBER_EMOJI = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

/** Single product order message. */
export function buildSingleOrderMessage(line: OrderLine, customer: CustomerDetails) {
  const total = line.price * line.quantity;
  return [
    "🌸✨ *ESSY-LUX ORDER REQUEST* ✨🌸",
    "",
    "Hello Essy-Lux! 💕",
    "",
    "I would like to order the following handbag:",
    "",
    `👜 *Product:* ${line.name}`,
    `🎨 *Color:* ${line.color}`,
    `🔢 *Quantity:* ${line.quantity}`,
    `💰 *Price:* ${formatPrice(line.price)}${line.quantity > 1 ? " each" : ""}`,
    "",
    "━━━━━━━━━━━━━━",
    `🧾 *ORDER TOTAL: ${formatPrice(total)}*`,
    "━━━━━━━━━━━━━━",
    "",
    "👤 *Customer Details*",
    "",
    `Name: ${customer.name}`,
    `📞 Phone: ${customer.phone}`,
    `📍 Location: ${customer.location}`,
    ...(customer.note?.trim() ? ["", "📝 *Note:*", customer.note.trim()] : []),
    "",
    "Please confirm availability and let me know the next steps for payment and delivery. 💕✨",
    "",
    "Thank you! 🌷",
    "",
    "*ESSY-LUX*",
    "*LUXURY BAGS*",
  ].join("\n");
}

/** Multi-item cart order message. */
export function buildCartOrderMessage(lines: OrderLine[], customer: CustomerDetails) {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  return [
    "🌸✨ *ESSY-LUX — NEW ORDER REQUEST* ✨🌸",
    "",
    "Hello Essy-Lux! 💕",
    "",
    "I would like to place an order:",
    "",
    "🛍️ *ITEMS*",
    "",
    ...lines.flatMap((l, i) => [
      `${NUMBER_EMOJI[i] ?? `${i + 1}.`} *${l.name}*`,
      `🎨 Color: ${l.color}`,
      `🔢 Quantity: ${l.quantity}`,
      `💰 Price: ${formatPrice(l.price)}${l.quantity > 1 ? " each" : ""}`,
      "",
    ]),
    "━━━━━━━━━━━━━━━━",
    "🧾 *ORDER SUMMARY*",
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    "Delivery: To be confirmed",
    `💰 *TOTAL: ${formatPrice(subtotal)}*`,
    "",
    "━━━━━━━━━━━━━━━━",
    "",
    "👤 *CUSTOMER DETAILS*",
    "",
    `Name: ${customer.name}`,
    `📞 Phone: ${customer.phone}`,
    `📍 Location: ${customer.location}`,
    ...(customer.note?.trim() ? ["", "📝 *NOTE*", customer.note.trim()] : []),
    "",
    "Please confirm availability, delivery details and payment instructions. 💕🌷",
    "",
    "Thank you for choosing:",
    "",
    "✨ *ESSY-LUX*",
    "*LUXURY BAGS* ✨",
  ].join("\n");
}

/** General enquiry message used by the contact page. */
export function buildEnquiryMessage(fields: {
  name: string;
  email?: string;
  phone: string;
  subject: string;
  message: string;
}) {
  return [
    "🌸 *ESSY-LUX ENQUIRY* 🌸",
    "",
    "Hello Essy-Lux! 💕",
    "",
    `👤 Name: ${fields.name}`,
    ...(fields.email?.trim() ? [`📧 Email: ${fields.email.trim()}`] : []),
    `📞 Phone: ${fields.phone}`,
    `📝 Subject: ${fields.subject}`,
    "",
    "💬 *Message*",
    fields.message,
    "",
    "Thank you! 🌷",
  ].join("\n");
}
