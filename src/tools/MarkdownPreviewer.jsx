import { useState } from "react";

const editorClass =
  "mt-2 min-h-[350px] w-full resize-y rounded-xl border border-[#304038] bg-[#101210] px-4 py-3 font-mono text-sm leading-7 text-[#F0FDF4] outline-none transition placeholder:text-[#74877D] focus:border-[#86EFAC]/60 focus-visible:ring-2 focus-visible:ring-[#86EFAC]/15";

const previewClass =
  "min-h-[350px] space-y-2 break-words rounded-xl border border-[#304038] bg-[#171F1A] p-4 text-sm leading-7 text-[#DCE9DE]";

function inlineMd(text) {
  return text
    .split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\(https?:\/\/[^ )]+\))/g)
    .map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={index} className="rounded bg-[#304038] px-1 text-[#BBF7D0]">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^ )]+)\)$/);
      if (link) {
        return (
          <a
            key={index}
            className="text-[#86EFAC] underline underline-offset-2 hover:text-[#BBF7D0]"
            href={link[2]}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link[1]}
          </a>
        );
      }
      return part;
    });
}

export default function MarkdownPreviewer() {
  const [value, setValue] = useState(
    "# ToolVerse\n\n**Markdown** preview with *simple* formatting.\n\n- First item\n- Second item\n\n[Website](https://example.com)"
  );
  const lines = value.split("\n");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[#F0FDF4]">Markdown Previewer</h2>
        <p className="mt-2 text-sm text-[#94A3A0]">
          Write Markdown and preview the formatted text instantly.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block min-w-0 text-sm font-semibold text-[#DCE9DE]">
          Markdown
          <textarea
            className={editorClass}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            spellCheck={false}
          />
        </label>

        <div className="min-w-0">
          <p className="mb-2 text-sm font-semibold text-[#DCE9DE]">Preview</p>
          <div className={previewClass} aria-live="polite">
            {lines.map((line, index) => {
              if (line.startsWith("### ")) {
                return <h3 key={index} className="text-lg font-bold text-[#F0FDF4]">{inlineMd(line.slice(4))}</h3>;
              }
              if (line.startsWith("## ")) {
                return <h2 key={index} className="text-xl font-bold text-[#F0FDF4]">{inlineMd(line.slice(3))}</h2>;
              }
              if (line.startsWith("# ")) {
                return <h1 key={index} className="text-2xl font-bold text-[#F0FDF4]">{inlineMd(line.slice(2))}</h1>;
              }
              if (/^[-*] /.test(line)) {
                return <p key={index}>• {inlineMd(line.slice(2))}</p>;
              }
              if (line.startsWith("> ")) {
                return (
                  <blockquote key={index} className="border-l-2 border-[#86EFAC] pl-3 text-[#AFC1B5]">
                    {inlineMd(line.slice(2))}
                  </blockquote>
                );
              }
              return <p key={index}>{inlineMd(line) || "\u00a0"}</p>;
            })}
          </div>
        </div>
      </div>

      <p className="text-xs leading-6 text-[#94A3A0]">
        Supports common headings, emphasis, links, inline code, lists, and quotes.
        HTML is rendered as text, not executed.
      </p>
    </div>
  );
}
