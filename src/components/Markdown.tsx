"use client";

/**
 * Lightweight markdown renderer for AI chat output.
 * Handles: **bold**, headers, bullet lists, `code`, ```code blocks```, line breaks.
 */
export function Markdown({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);

  return (
    <div className="space-y-2">
      {blocks.map((block, i) => (
        <Block key={i} text={block.trim()} />
      ))}
    </div>
  );
}

function Block({ text }: { text: string }) {
  // Code block
  if (text.startsWith("```")) {
    const code = text.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");
    return (
      <pre className="bg-background/80 border border-border/40 rounded-md px-3 py-2 overflow-x-auto">
        <code className="text-[12px] font-mono text-emerald-300/90">{code}</code>
      </pre>
    );
  }

  // Header
  if (text.startsWith("### ")) return <p className="text-[13px] font-semibold mt-1">{inline(text.slice(4))}</p>;
  if (text.startsWith("## ")) return <p className="text-[13px] font-semibold mt-1">{inline(text.slice(3))}</p>;
  if (text.startsWith("# ")) return <p className="text-[14px] font-bold mt-1">{inline(text.slice(2))}</p>;

  // Bullet list
  const lines = text.split("\n");
  const isList = lines.every((l) => /^[\-\•\*]\s/.test(l.trim()) || l.trim() === "");
  if (isList && lines.length > 1) {
    return (
      <ul className="space-y-0.5 pl-0.5">
        {lines
          .filter((l) => l.trim())
          .map((l, i) => (
            <li key={i} className="flex gap-1.5 text-[13px] leading-relaxed">
              <span className="text-emerald-400/60 shrink-0 mt-[3px]">&#8226;</span>
              <span>{inline(l.replace(/^[\-\•\*]\s*/, ""))}</span>
            </li>
          ))}
      </ul>
    );
  }

  // Paragraph (may contain line breaks)
  return (
    <p className="text-[13px] leading-relaxed">
      {lines.map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {inline(line)}
        </span>
      ))}
    </p>
  );
}

function inline(text: string): React.ReactNode {
  // Split by inline patterns: **bold**, `code`, regular text
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Inline code
    const codeMatch = remaining.match(/`([^`]+)`/);

    const matches = [
      boldMatch ? { type: "bold", index: boldMatch.index!, length: boldMatch[0].length, content: boldMatch[1] } : null,
      codeMatch ? { type: "code", index: codeMatch.index!, length: codeMatch[0].length, content: codeMatch[1] } : null,
    ]
      .filter(Boolean)
      .sort((a, b) => a!.index - b!.index);

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    const match = matches[0]!;

    if (match.index > 0) {
      parts.push(remaining.slice(0, match.index));
    }

    if (match.type === "bold") {
      parts.push(<strong key={key++} className="font-semibold text-foreground">{match.content}</strong>);
    } else {
      parts.push(
        <code key={key++} className="text-[12px] font-mono bg-background/60 border border-border/30 rounded px-1 py-px text-emerald-300/80">
          {match.content}
        </code>
      );
    }

    remaining = remaining.slice(match.index + match.length);
  }

  return <>{parts}</>;
}
