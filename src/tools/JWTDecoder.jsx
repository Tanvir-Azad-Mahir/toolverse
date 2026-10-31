import { useMemo, useState } from "react";
import { Check, Copy, ShieldAlert } from "lucide-react";

const editorClass =
  "w-full rounded-xl border border-[#304038] bg-[#101210] px-4 py-3 font-mono text-sm leading-6 text-[#F0FDF4] outline-none transition placeholder:text-[#718478] focus:border-[#86EFAC]/60 focus-visible:ring-2 focus-visible:ring-[#86EFAC]/15";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      disabled={!text}
      onClick={copy}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#304038] bg-[#1B2420] px-4 py-2.5 text-sm font-semibold text-[#D5EBDD] transition hover:border-[#86EFAC]/40 hover:bg-[#25352B] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function decodePart(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

export default function JWTDecoder() {
  const [token, setToken] = useState("");

  const data = useMemo(() => {
    try {
      const parts = token.trim().split(".");
      if (parts.length !== 3) {
        throw Error("JWT must have three dot-separated sections");
      }
      const payload = decodePart(parts[1]);
      return { header: decodePart(parts[0]), payload, error: null };
    } catch (error) {
      return { error: token ? error.message : null };
    }
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#F0FDF4]">JWT Decoder</h2>
        <p className="mt-2 text-sm leading-6 text-[#94A3A0]">
          Inspect a JWT header and payload locally in your browser.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm leading-6 text-amber-200">
        <ShieldAlert size={18} className="mt-0.5 shrink-0" />
        <p>
          Decodes only. Does not verify signatures or token authenticity. Avoid
          pasting live access tokens.
        </p>
      </div>

      <label htmlFor="jwt-token" className="block space-y-2">
        <span className="block text-sm font-semibold text-[#D5EBDD]">JWT token</span>
        <textarea
          id="jwt-token"
          className={`${editorClass} min-h-32 resize-y`}
          placeholder="Paste JWT"
          spellCheck={false}
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
      </label>

      {data.error && (
        <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-300">
          {data.error}
        </p>
      )}

      {data.payload && (
        <div className="space-y-5">
          <p className="rounded-xl border border-[#304038] bg-[#1B2420] p-4 text-sm text-[#B9CCC0]">
            <span className="font-semibold text-[#F0FDF4]">Expiration: </span>
            {typeof data.payload.exp === "number"
              ? new Date(data.payload.exp * 1000).toLocaleString()
              : "Not specified"}
          </p>

          {[
            ["Header", data.header],
            ["Payload", data.payload],
          ].map(([label, object]) => {
            const formatted = JSON.stringify(object, null, 2);
            return (
              <div key={label} className="space-y-3">
                <h3 className="text-sm font-semibold text-[#F0FDF4]">{label}</h3>
                <pre className="max-h-80 overflow-auto rounded-xl border border-[#304038] bg-[#101210] p-4 font-mono text-sm leading-6 text-[#D5EBDD]">
                  {formatted}
                </pre>
                <CopyButton text={formatted} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
