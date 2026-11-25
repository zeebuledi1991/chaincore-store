// Turns an admin-edited legal section body into the shape LegalPage renders.
// Blank lines separate blocks; a block whose every line starts with "- " becomes a bullet list.
export function parseLegalBody(text) {
  const blocks = String(text || "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const paragraphs = [];
  const bullets = [];

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const isList = lines.length > 0 && lines.every((line) => /^[-•*]\s+/.test(line));
    if (isList) {
      bullets.push(...lines.map((line) => line.replace(/^[-•*]\s+/, "")));
    } else {
      paragraphs.push(lines.join(" "));
    }
  }

  return { paragraphs, bullets: bullets.length ? bullets : undefined };
}

// Builds the section list for a legal page from its content keys.
export function legalSections(t, prefix, count) {
  return Array.from({ length: count }, (_, index) => {
    const key = `${prefix}.s${index + 1}`;
    return { title: t(`${key}.title`), ...parseLegalBody(t(`${key}.body`)) };
  });
}