import jsPDF from "jspdf";
import { LOGO_BASE64 } from "./logo-base64";

// ── Color Palette (matching KonsultanAI branding) ─────────────────────
const COLORS = {
  navy:      { r: 11,  g: 19,  b: 43  },  // #0B132B
  navyLight: { r: 28,  g: 37,  b: 65  },  // #1C2541
  navyDark:  { r: 6,   g: 10,  b: 23  },  // #060A17
  gold:      { r: 212, g: 175, b: 55  },  // #D4AF37
  goldLight: { r: 243, g: 229, b: 171 },  // #F3E5AB
  goldDark:  { r: 170, g: 140, b: 44  },  // #AA8C2C
  white:     { r: 255, g: 255, b: 255 },
  textDark:  { r: 30,  g: 30,  b: 50  },
  textMuted: { r: 100, g: 110, b: 130 },
  divider:   { r: 200, g: 210, b: 225 },
  bgSection: { r: 240, g: 242, b: 248 },
};

type RGB = { r: number; g: number; b: number };

// ── Helper Functions ──────────────────────────────────────────────────
function setColor(doc: jsPDF, color: RGB) {
  doc.setTextColor(color.r, color.g, color.b);
}

function setDrawColor(doc: jsPDF, color: RGB) {
  doc.setDrawColor(color.r, color.g, color.b);
}

function setFillColor(doc: jsPDF, color: RGB) {
  doc.setFillColor(color.r, color.g, color.b);
}

// ── Decorative Elements ───────────────────────────────────────────────

/** Draw the premium header banner with logo */
function drawHeader(doc: jsPDF, modelChoice: 'freemodel' | 'gemini') {
  const pageW = doc.internal.pageSize.getWidth();

  // Navy gradient background (simulated with layered rects)
  setFillColor(doc, COLORS.navy);
  doc.rect(0, 0, pageW, 52, "F");
  setFillColor(doc, COLORS.navyDark);
  doc.rect(0, 0, pageW, 4, "F");

  // Gold accent bar at bottom of header
  setFillColor(doc, COLORS.gold);
  doc.rect(0, 50, pageW, 2.5, "F");

  // Logo
  try {
    doc.addImage(LOGO_BASE64, "PNG", 14, 8, 35, 35);
  } catch {
    // If logo fails, skip gracefully
  }

  // Title text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  setColor(doc, COLORS.gold);
  doc.text("KonsultanAI", 54, 23);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  setColor(doc, COLORS.goldLight);
  doc.text(`AI Legal Assistant Indonesia (${modelChoice === 'gemini' ? 'Gemini Native' : 'Freemodel'})`, 54, 30);

  // Small decorative text - report label on the right
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  setColor(doc, COLORS.white);
  doc.text("LAPORAN KONSULTASI HUKUM", pageW - 14, 20, { align: "right" });

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  setColor(doc, COLORS.goldLight);
  doc.text("Dokumen Resmi • Rahasia", pageW - 14, 26, { align: "right" });
}

/** Draw page metadata info (date, page number, etc.) */
function drawMetaInfo(doc: jsPDF, dateStr: string, yStart: number): number {
  const pageW = doc.internal.pageSize.getWidth();
  let y = yStart;

  // Info box with light background
  setFillColor(doc, COLORS.bgSection);
  doc.roundedRect(14, y, pageW - 28, 22, 3, 3, "F");
  setDrawColor(doc, COLORS.divider);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, y, pageW - 28, 22, 3, 3, "S");

  y += 8;
  doc.setFontSize(8);

  // Left column - Date
  doc.setFont("helvetica", "bold");
  setColor(doc, COLORS.textMuted);
  doc.text("TANGGAL KONSULTASI", 20, y);
  doc.setFont("helvetica", "normal");
  setColor(doc, COLORS.textDark);
  doc.text(dateStr, 20, y + 6);

  // Middle column - Reference ID
  doc.setFont("helvetica", "bold");
  setColor(doc, COLORS.textMuted);
  doc.text("NO. REFERENSI", 90, y);
  doc.setFont("helvetica", "normal");
  setColor(doc, COLORS.textDark);
  const refId = "KAI-" + Date.now().toString(36).toUpperCase();
  doc.text(refId, 90, y + 6);

  // Right column - Status
  doc.setFont("helvetica", "bold");
  setColor(doc, COLORS.textMuted);
  doc.text("STATUS", 155, y);

  // Status badge
  setFillColor(doc, { r: 34, g: 139, b: 34 }); // forest green
  doc.roundedRect(155, y + 1, 22, 6, 1.5, 1.5, "F");
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  setColor(doc, COLORS.white);
  doc.text("SELESAI", 166, y + 5.2, { align: "center" });

  return yStart + 30;
}

/** Draw a section title divider */
function drawSectionTitle(doc: jsPDF, title: string, y: number, isUser: boolean): number {
  const pageW = doc.internal.pageSize.getWidth();
  const color = isUser ? COLORS.navyLight : COLORS.gold;

  // Icon circle
  setFillColor(doc, color);
  doc.circle(20, y + 3, 3.5, "F");

  // Icon letter inside circle
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  setColor(doc, COLORS.white);
  doc.text(isUser ? "U" : "AI", 20, y + 4.8, { align: "center" });

  // Title text
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  setColor(doc, isUser ? COLORS.navyLight : COLORS.goldDark);
  doc.text(title, 28, y + 5.5);

  // Decorative line
  const titleWidth = doc.getTextWidth(title);
  setDrawColor(doc, isUser ? COLORS.navyLight : COLORS.gold);
  doc.setLineWidth(0.5);
  doc.line(28 + titleWidth + 3, y + 3.5, pageW - 14, y + 3.5);

  return y + 12;
}

// ── Markdown Token Types ──────────────────────────────────────────────
type MdToken =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; segments: TextSegment[] }
  | { type: "bullet"; indent: number; segments: TextSegment[] }
  | { type: "numbered"; indent: number; number: string; segments: TextSegment[] }
  | { type: "code_block"; lines: string[] }
  | { type: "hr" }
  | { type: "blank" };

type TextSegment = { text: string; bold: boolean };

/** Parse inline bold markers (**text**) into segments */
function parseInlineSegments(line: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: line.slice(lastIndex, match.index), bold: false });
    }
    segments.push({ text: match[1], bold: true });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < line.length) {
    segments.push({ text: line.slice(lastIndex), bold: false });
  }
  if (segments.length === 0) {
    segments.push({ text: line, bold: false });
  }
  return segments;
}

/** Tokenize raw markdown text into structured tokens */
function tokenizeMarkdown(text: string): MdToken[] {
  const rawLines = text.split("\n");
  const tokens: MdToken[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];

    // Code block (```)
    if (line.trimStart().startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < rawLines.length && !rawLines[i].trimStart().startsWith("```")) {
        codeLines.push(rawLines[i]);
        i++;
      }
      i++; // skip closing ```
      tokens.push({ type: "code_block", lines: codeLines });
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|_{3,}|\*{3,})\s*$/.test(line.trim())) {
      tokens.push({ type: "hr" });
      i++;
      continue;
    }

    // Heading (# ... ######)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      tokens.push({ type: "heading", level: headingMatch[1].length, text: headingMatch[2].replace(/\*\*(.*?)\*\*/g, "$1") });
      i++;
      continue;
    }

    // Bullet list (-, *, •)
    const bulletMatch = line.match(/^(\s*)[•\-\*]\s+(.+)/);
    if (bulletMatch) {
      const indent = Math.floor(bulletMatch[1].length / 2);
      tokens.push({ type: "bullet", indent, segments: parseInlineSegments(bulletMatch[2]) });
      i++;
      continue;
    }

    // Numbered list (1., 2., etc.)
    const numberedMatch = line.match(/^(\s*)(\d+)\.\s+(.+)/);
    if (numberedMatch) {
      const indent = Math.floor(numberedMatch[1].length / 2);
      tokens.push({ type: "numbered", indent, number: numberedMatch[2], segments: parseInlineSegments(numberedMatch[3]) });
      i++;
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      tokens.push({ type: "blank" });
      i++;
      continue;
    }

    // Regular paragraph
    tokens.push({ type: "paragraph", segments: parseInlineSegments(line) });
    i++;
  }

  return tokens;
}

/** Ensure there's space on the page; add a new page if needed. Returns updated y. */
function ensureSpace(doc: jsPDF, currentY: number, needed: number, isAI: boolean): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (currentY + needed > pageHeight - 25) {
    doc.addPage();
    drawPageFooter(doc, 0);
    drawContinuationHeader(doc);
    const newY = 20;
    // Don't pre-draw full-page AI background on continuation pages
    // It will be handled by the drawTextBlock measuring logic
    return newY;
  }
  return currentY;
}

/** Draw AI response background block (cream bg + gold left border) */
function drawAIBlockBackground(doc: jsPDF, startY: number, height: number) {
  const pageW = doc.internal.pageSize.getWidth();
  setFillColor(doc, { r: 252, g: 249, b: 235 });
  doc.roundedRect(26, startY, pageW - 40, height, 2, 2, "F");
  setFillColor(doc, COLORS.gold);
  doc.rect(26, startY, 2, height, "F");
}

/** Render a list of TextSegments with bold support, wrapping lines. Returns new Y. */
function renderSegments(
  doc: jsPDF,
  segments: TextSegment[],
  x: number,
  y: number,
  maxW: number,
  lineHeight: number,
  isAI: boolean
): number {
  // Flatten segments into a single string for wrapping, but track bold ranges
  const fullText = segments.map(s => s.text).join("");
  const wrappedLines = doc.splitTextToSize(fullText, maxW);

  // For each wrapped line, find which parts are bold from original segments
  let globalCharIndex = 0;
  // Build a bold map: for each character index, is it bold?
  const boldMap: boolean[] = [];
  for (const seg of segments) {
    for (let c = 0; c < seg.text.length; c++) {
      boldMap.push(seg.bold);
    }
  }

  let currentY = y;
  for (const wrappedLine of wrappedLines) {
    currentY = ensureSpace(doc, currentY, lineHeight, isAI);

    // Find the character range for this line in the original text
    const lineStart = globalCharIndex;
    const lineEnd = lineStart + wrappedLine.length;

    // Render character-by-character with bold switching
    let curX = x;
    let runStart = lineStart;
    let currentBold = boldMap[lineStart] || false;

    for (let ci = lineStart; ci <= lineEnd; ci++) {
      const charBold = ci < lineEnd ? (boldMap[ci] || false) : !currentBold; // force flush at end
      if (charBold !== currentBold || ci === lineEnd) {
        // Flush the current run
        const runText = fullText.slice(runStart, ci);
        if (runText.length > 0) {
          doc.setFont("helvetica", currentBold ? "bold" : "normal");
          doc.setFontSize(9);
          setColor(doc, COLORS.textDark);
          doc.text(runText, curX, currentY);
          curX += doc.getTextWidth(runText);
        }
        currentBold = charBold;
        runStart = ci;
      }
    }

    globalCharIndex = lineEnd;
    // Skip whitespace that was trimmed by splitTextToSize
    while (globalCharIndex < fullText.length && fullText[globalCharIndex] === " " && globalCharIndex < lineEnd + 1) {
      globalCharIndex++;
    }
    currentY += lineHeight;
  }

  return currentY;
}

/** Render all tokens onto the PDF. Returns new Y position. */
function renderTokens(
  doc: jsPDF,
  tokens: MdToken[],
  startY: number,
  isAI: boolean,
): number {
  const pageW = doc.internal.pageSize.getWidth();
  const baseX = 30;
  const contentW = pageW - 44;
  const lineHeight = 4.8;

  let currentY = startY;

  for (const token of tokens) {
    switch (token.type) {
      case "heading": {
        const fontSize = token.level <= 1 ? 12 : token.level === 2 ? 11 : 10;
        currentY = ensureSpace(doc, currentY, fontSize + 4, isAI);
        currentY += 2;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(fontSize);
        setColor(doc, isAI ? COLORS.goldDark : COLORS.navyLight);

        const headingLines = doc.splitTextToSize(token.text, contentW);
        for (const hl of headingLines) {
          currentY = ensureSpace(doc, currentY, lineHeight + 1, isAI);
          doc.text(hl, baseX, currentY);
          currentY += lineHeight + 1;
        }

        if (token.level <= 2) {
          setDrawColor(doc, isAI ? COLORS.gold : COLORS.navyLight);
          doc.setLineWidth(0.3);
          doc.line(baseX, currentY - 2, baseX + 40, currentY - 2);
        }
        currentY += 2;
        break;
      }

      case "bullet": {
        const indentX = baseX + token.indent * 6;
        const bulletW = contentW - token.indent * 6 - 6;
        currentY = ensureSpace(doc, currentY, lineHeight, isAI);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        setColor(doc, isAI ? COLORS.goldDark : COLORS.navyLight);
        doc.text("•", indentX, currentY);

        setColor(doc, COLORS.textDark);
        currentY = renderSegments(doc, token.segments, indentX + 4, currentY, bulletW, lineHeight, isAI);
        currentY += 1;
        break;
      }

      case "numbered": {
        const indentX = baseX + token.indent * 6;
        const numW = contentW - token.indent * 6 - 8;
        currentY = ensureSpace(doc, currentY, lineHeight, isAI);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        setColor(doc, isAI ? COLORS.goldDark : COLORS.navyLight);
        doc.text(`${token.number}.`, indentX, currentY);

        setColor(doc, COLORS.textDark);
        const numLabelW = doc.getTextWidth(`${token.number}. `);
        currentY = renderSegments(doc, token.segments, indentX + numLabelW + 1, currentY, numW, lineHeight, isAI);
        currentY += 1;
        break;
      }

      case "code_block": {
        currentY = ensureSpace(doc, currentY, token.lines.length * 4 + 8, isAI);
        currentY += 2;

        const codeHeight = token.lines.length * 4 + 6;
        setFillColor(doc, { r: 235, g: 237, b: 242 });
        doc.roundedRect(baseX - 1, currentY - 3, contentW + 2, codeHeight, 1.5, 1.5, "F");
        setDrawColor(doc, COLORS.divider);
        doc.setLineWidth(0.2);
        doc.roundedRect(baseX - 1, currentY - 3, contentW + 2, codeHeight, 1.5, 1.5, "S");

        doc.setFont("courier", "normal");
        doc.setFontSize(7.5);
        setColor(doc, { r: 40, g: 42, b: 54 });

        for (const codeLine of token.lines) {
          currentY = ensureSpace(doc, currentY, 4, isAI);
          const trimmedCode = doc.splitTextToSize(codeLine, contentW - 4);
          for (const tc of trimmedCode) {
            doc.text(tc, baseX + 2, currentY);
            currentY += 4;
          }
        }
        currentY += 4;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        break;
      }

      case "hr": {
        currentY = ensureSpace(doc, currentY, 6, isAI);
        currentY += 2;
        setDrawColor(doc, isAI ? COLORS.gold : COLORS.divider);
        doc.setLineWidth(0.4);
        doc.line(baseX, currentY, pageW - 14, currentY);
        currentY += 4;
        break;
      }

      case "blank": {
        currentY += 3;
        break;
      }

      case "paragraph": {
        currentY = ensureSpace(doc, currentY, lineHeight, isAI);
        currentY = renderSegments(doc, token.segments, baseX, currentY, contentW, lineHeight, isAI);
        currentY += 1.5;
        break;
      }
    }
  }

  return currentY + 2;
}

/** Calculate the height of rendered tokens without actually drawing anything. */
function measureTokensHeight(doc: jsPDF, tokens: MdToken[]): number {
  const pageW = doc.internal.pageSize.getWidth();
  const contentW = pageW - 44;
  const lineHeight = 4.8;
  let height = 0;

  for (const token of tokens) {
    switch (token.type) {
      case "heading": {
        const fontSize = token.level <= 1 ? 12 : token.level === 2 ? 11 : 10;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(fontSize);
        const headingLines = doc.splitTextToSize(token.text, contentW);
        height += 2 + headingLines.length * (lineHeight + 1) + 2 + (token.level <= 2 ? 1 : 0);
        break;
      }
      case "bullet":
      case "numbered": {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const segments = token.type === "bullet" ? token.segments : token.segments;
        const fullText = segments.map(s => s.text).join("");
        const indent = token.indent * 6;
        const w = contentW - indent - 8;
        const wrappedLines = doc.splitTextToSize(fullText, w);
        height += wrappedLines.length * lineHeight + 1;
        break;
      }
      case "code_block":
        height += token.lines.length * 4 + 10;
        break;
      case "hr":
        height += 6;
        break;
      case "blank":
        height += 3;
        break;
      case "paragraph": {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const fullText = token.segments.map(s => s.text).join("");
        const wrappedLines = doc.splitTextToSize(fullText, contentW);
        height += wrappedLines.length * lineHeight + 1.5;
        break;
      }
    }
  }

  return height;
}

/** Draw text content block with full markdown rendering */
function drawTextBlock(
  doc: jsPDF,
  text: string,
  y: number,
  isAI: boolean
): number {
  const pageW = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const tokens = tokenizeMarkdown(text);

  if (isAI) {
    // Measure the total content height to draw proper background
    const totalHeight = measureTokensHeight(doc, tokens);
    const availableOnPage = pageHeight - 25 - y;

    if (totalHeight <= availableOnPage) {
      // Everything fits on current page - draw single background
      drawAIBlockBackground(doc, y - 3, totalHeight + 6);
    } else {
      // Content spans multiple pages - draw background for first page
      drawAIBlockBackground(doc, y - 3, availableOnPage + 3);
    }
  }

  return renderTokens(doc, tokens, y, isAI);
}

/** Draw header for continuation pages */
function drawContinuationHeader(doc: jsPDF) {
  const pageW = doc.internal.pageSize.getWidth();

  // Thin navy bar
  setFillColor(doc, COLORS.navy);
  doc.rect(0, 0, pageW, 12, "F");
  setFillColor(doc, COLORS.gold);
  doc.rect(0, 11.5, pageW, 0.5, "F");

  // Logo small
  try {
    doc.addImage(LOGO_BASE64, "PNG", 8, 1.5, 9, 9);
  } catch {
    // skip if logo fails
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setColor(doc, COLORS.gold);
  doc.text("KonsultanAI — Laporan Konsultasi Hukum", 20, 7.5);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  setColor(doc, COLORS.white);
  doc.text("(lanjutan)", pageW - 14, 7.5, { align: "right" });
}

/** Draw page footer with gold line, disclaimer, and page number */
function drawPageFooter(doc: jsPDF, totalPages: number) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const y = pageH - 18;

  // Gold divider line
  setDrawColor(doc, COLORS.gold);
  doc.setLineWidth(0.5);
  doc.line(14, y, pageW - 14, y);

  // Disclaimer text
  doc.setFontSize(6);
  doc.setFont("helvetica", "italic");
  setColor(doc, COLORS.textMuted);
  doc.text(
    "Disclaimer: Dokumen ini dihasilkan oleh AI dan bukan merupakan nasihat hukum resmi. Konsultasikan dengan pengacara profesional untuk kepastian hukum.",
    14,
    y + 5
  );

  // Footer branding
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  setColor(doc, COLORS.goldDark);
  doc.text("konsultan-ai.com", 14, y + 10);

  // Page number badge
  const pageNum = (doc as any).internal.getCurrentPageInfo().pageNumber;
  const pageText = totalPages > 0 ? `${pageNum} / ${totalPages}` : `${pageNum}`;

  setFillColor(doc, COLORS.navy);
  doc.roundedRect(pageW - 32, y + 3, 18, 8, 2, 2, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  setColor(doc, COLORS.white);
  doc.text(pageText, pageW - 23, y + 8.5, { align: "center" });
}

/** Draw the final summary/closing section */
function drawClosingSection(doc: jsPDF, y: number): number {
  const pageW = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  if (y > pageHeight - 55) {
    doc.addPage();
    drawContinuationHeader(doc);
    y = 25;
  }

  // Decorative closing box
  setFillColor(doc, COLORS.navy);
  doc.roundedRect(14, y, pageW - 28, 35, 3, 3, "F");

  // Gold inner border
  setDrawColor(doc, COLORS.gold);
  doc.setLineWidth(0.5);
  doc.roundedRect(16, y + 2, pageW - 32, 31, 2, 2, "S");

  // Closing text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setColor(doc, COLORS.gold);
  doc.text("Terima Kasih Telah Menggunakan KonsultanAI", pageW / 2, y + 13, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setColor(doc, COLORS.goldLight);
  doc.text(
    "Analisis ini bersifat informatif. Untuk tindakan hukum lebih lanjut,",
    pageW / 2,
    y + 20,
    { align: "center" }
  );
  doc.text(
    "silakan berkonsultasi dengan pengacara atau lembaga hukum terkait.",
    pageW / 2,
    y + 25,
    { align: "center" }
  );

  return y + 40;
}

// ── Main Export Function ──────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | string;
  parts?: { type: string; text: string }[];
  content?: string;
}

function getMessageText(msg: ChatMessage): string {
  if (Array.isArray(msg.parts)) {
    return msg.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");
  }
  if (typeof msg.content === "string") return msg.content;
  return "";
}

export function exportConsultationPDF(messages: ChatMessage[], isWatermarked = false, modelChoice: 'freemodel' | 'gemini' = 'freemodel') {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // ─── Page 1: Header & Content ────────────────────────────────────
  drawHeader(doc, modelChoice);
  let y = drawMetaInfo(doc, dateStr, 58);

  // Section title
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  setColor(doc, COLORS.navy);
  doc.text("Ringkasan Konsultasi", 14, y + 2);
  y += 10;

  // Gold underline
  setDrawColor(doc, COLORS.gold);
  doc.setLineWidth(1);
  doc.line(14, y - 4, 68, y - 4);
  doc.setLineWidth(0.3);
  setDrawColor(doc, COLORS.divider);
  doc.line(68, y - 4, doc.internal.pageSize.getWidth() - 14, y - 4);

  y += 4;

  // ─── Chat Messages ──────────────────────────────────────────────
  let messageIndex = 0;
  messages.forEach((msg) => {
    if (msg.id === "welcome-msg") return;
    const text = getMessageText(msg);
    if (!text.trim()) return;

    messageIndex++;
    const isUser = msg.role === "user";
    const sectionTitle = isUser
      ? `Kronologi Pengguna #${Math.ceil(messageIndex / 2)}`
      : `Analisis Hukum AI #${Math.ceil(messageIndex / 2)}`;

    // Check if we need a new page
    if (y > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      drawContinuationHeader(doc);
      y = 22;
    }

    y = drawSectionTitle(doc, sectionTitle, y, isUser);
    y = drawTextBlock(doc, text, y, !isUser);
    y += 3;
  });

  // ─── Closing Section ─────────────────────────────────────────────
  y = drawClosingSection(doc, y + 5);

  // ─── Add footers to all pages ────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawPageFooter(doc, totalPages);
    
    if (isWatermarked) {
      doc.saveGraphicsState();
      try {
        doc.setGState(new (doc as any).GState({ opacity: 0.15 }));
      } catch (e) {
        // Fallback if GState is not available
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(60);
      setColor(doc, COLORS.navyLight);
      doc.text("KONSULTAN AI - FREE", doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2, {
        align: "center",
        angle: 45
      });
      doc.restoreGraphicsState();
    }
  }

  // ─── Save ────────────────────────────────────────────────────────
  doc.save(`KonsultanAI-Laporan-${new Date().toISOString().split("T")[0]}.pdf`);
}
