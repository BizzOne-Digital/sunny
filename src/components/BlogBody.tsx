"use client";

/** Shared blog body parsing + render (## headings, **bold**). Safe for client components. */

export type BlogBodyBlock = { type: "h2" | "h3" | "p"; text: string };

export function normalizeBlogBody(raw: string): BlogBodyBlock[] {
  const source = (raw || "")
    .replace(/\r\n/g, "\n")
    // Keep heading markers readable even when stored as one long line.
    .replace(/([^\n])\s*(#{2,3})\s+/g, "$1\n\n$2 ")
    .replace(/(#{2,3}\s+[^\n]+?)\s+(?=\*\*)/g, "$1\n\n")
    // Split "**Label:**" style points into their own paragraphs (colon may be inside or after bold).
    .replace(/([.!?—])\s+(\*\*[^*]+?:\*\*|\*\*[^*]+\*\*:)/g, "$1\n\n$2")
    .trim();

  if (!source) return [];

  return source
    .split(/\n{2,}/)
    .map((chunk) => chunk.replace(/\n+/g, " ").trim())
    .filter(Boolean)
    .map((line) => {
      if (/^###\s+/.test(line)) return { type: "h3" as const, text: line.replace(/^###\s+/, "").trim() };
      if (/^##\s+/.test(line)) return { type: "h2" as const, text: line.replace(/^##\s+/, "").trim() };
      if (/^#\s+/.test(line)) return { type: "h2" as const, text: line.replace(/^#\s+/, "").trim() };
      return { type: "p" as const, text: line };
    });
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-bold text-forest">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export function BlogBody({
  content,
  compact = false,
}: {
  content: string;
  compact?: boolean;
}) {
  const blocks = normalizeBlogBody(content);

  if (!blocks.length) {
    return <p className="text-sm italic text-ink/45">Nothing to preview yet.</p>;
  }

  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      {blocks.map((block, index) => {
        if (block.type === "h2") {
          return (
            <h2
              key={index}
              className={
                compact
                  ? "mt-4 font-serif text-xl leading-snug text-forest first:mt-0"
                  : "mt-10 font-serif text-2xl leading-snug text-forest first:mt-0 sm:text-3xl md:text-4xl"
              }
            >
              {renderInlineMarkdown(block.text)}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3
              key={index}
              className={
                compact
                  ? "mt-3 font-serif text-lg leading-snug text-forest"
                  : "mt-8 font-serif text-xl leading-snug text-forest sm:text-2xl"
              }
            >
              {renderInlineMarkdown(block.text)}
            </h3>
          );
        }
        return (
          <p
            key={index}
            className={
              compact
                ? "text-sm leading-7 text-ink/75"
                : "text-base leading-8 text-ink/75 sm:text-lg sm:leading-9"
            }
          >
            {renderInlineMarkdown(block.text)}
          </p>
        );
      })}
    </div>
  );
}
