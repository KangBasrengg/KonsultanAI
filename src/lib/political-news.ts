export const POLITIK_CATEGORY_ID = "c1200000-0000-0000-0000-000000000012";

export function toNewsSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, "dan")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function extractNewsTag(content: string): string {
  const match = content.match(/Kategori:\s*([^•\n*]+)/i);
  if (match) return match[1].trim();
  if (content.includes("Tata Negara")) return "Hukum Tata Negara";
  if (content.includes("Kebijakan")) return "Kebijakan Publik";
  if (content.includes("Pemilu") || content.includes("Pilkada")) return "Pemilu & Pilkada";
  if (content.includes("DPR") || content.includes("Parlemen")) return "Parlemen";
  return "Politik & Regulasi";
}

export function extractNewsExcerpt(content: string): string {
  const cleaned = content
    .replace(/^#+.*$/gm, "")
    .replace(/\*.*?\*/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .trim();
  const sentences = cleaned.split(/(?<=[.?!])\s+/);
  return sentences.slice(0, 2).join(" ").substring(0, 220) + "...";
}
