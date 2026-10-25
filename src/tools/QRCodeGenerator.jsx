
import { useState } from "react";
import QRCode from "qrcode";
import {
  QrCode,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Link2,
  Palette,
  Settings2,
  ShieldCheck,
  Copy,
  Check,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0b1422] px-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10 placeholder:text-slate-600";

export default function QRCodeGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(320);
  const [darkColor, setDarkColor] = useState("#10131a");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [errorCorrection, setErrorCorrection] = useState("M");

  const [qr, setQr] = useState("");
  const [svg, setSvg] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  function clearResult() {
    setQr("");
    setSvg("");
    setGeneratedText("");
    setError("");
    setCopied(false);
  }

  async function generate() {
    if (!text.trim()) {
      setError("Please enter a URL or text first.");
      return;
    }

    setGenerating(true);
    setError("");
    setCopied(false);
    setQr("");
    setSvg("");

    try {
      const options = {
        width: size,
        margin: 3,
        errorCorrectionLevel: errorCorrection,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      };

      const [pngResult, svgResult] = await Promise.all([
        QRCode.toDataURL(text.trim(), options),
        QRCode.toString(text.trim(), {
          ...options,
          type: "svg",
        }),
      ]);

      setQr(pngResult);
      setSvg(svgResult);
      setGeneratedText(text.trim());
    } catch {
      setError(
        "Could not generate the QR code. Try shorter text or different settings."
      );
    } finally {
      setGenerating(false);
    }
  }

  function downloadPNG() {
    if (!qr) return;

    const link = document.createElement("a");
    link.href = qr;
    link.download = "toolverse-qr.png";
    link.click();
  }

  function downloadSVG() {
    if (!svg) return;

    const blob = new Blob([svg], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "toolverse-qr.svg";
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copyText() {
    if (!generatedText) return;

    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
    } catch {
      setError("Clipboard access failed. Copy the text manually.");
    }
  }

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2.5 text-lg font-bold text-white sm:text-xl">
            <QrCode size={22} className="text-cyan-300" />
            QR Code Studio
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Create customized QR codes for websites, text, and more.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
          <ShieldCheck size={14} />
          Browser-based
        </span>
      </div>

      {/* Text input */}
      <div className="space-y-3">
        <label
          htmlFor="qr-input"
          className="flex items-center gap-2 text-sm font-semibold text-slate-200"
        >
          <Link2 size={17} className="text-cyan-300" />
          URL or text
        </label>

        <textarea
          id="qr-input"
          rows={4}
          maxLength={2000}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            clearResult();
          }}
          placeholder="https://example.com"
          className={`${inputClass} resize-y leading-7`}
        />

        <div className="flex justify-between text-xs text-slate-500">
          <span>Enter a link, message, or other text.</span>
          <span>{text.length}/2000</span>
        </div>
      </div>

      {/* Customization */}
      <div className="space-y-6 rounded-2xl border border-white/10 bg-[#0c1625] p-5 sm:p-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-white">
          <Settings2 size={18} className="text-cyan-300" />
          Customize QR code
        </h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-xs font-medium text-slate-300">
              Image size
            </span>
            <select
              value={size}
              onChange={(event) => {
                setSize(Number(event.target.value));
                clearResult();
              }}
              className={inputClass}
            >
              <option value={256}>256 × 256 px</option>
              <option value={320}>320 × 320 px</option>
              <option value={512}>512 × 512 px</option>
              <option value={1024}>1024 × 1024 px</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="block text-xs font-medium text-slate-300">
              Error correction
            </span>
            <select
              value={errorCorrection}
              onChange={(event) => {
                setErrorCorrection(event.target.value);
                clearResult();
              }}
              className={inputClass}
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </label>
        </div>

        <div className="space-y-3">
          <p className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <Palette size={16} className="text-cyan-300" />
            QR colors
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b1422] p-3">
              <input
                type="color"
                value={darkColor}
                onChange={(event) => {
                  setDarkColor(event.target.value);
                  clearResult();
                }}
                className="h-10 w-12 cursor-pointer rounded-lg border-0 bg-transparent"
                aria-label="QR foreground color"
              />
              <span className="text-xs text-slate-300">
                Foreground
                <span className="mt-1 block font-mono text-slate-500">
                  {darkColor.toUpperCase()}
                </span>
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b1422] p-3">
              <input
                type="color"
                value={lightColor}
                onChange={(event) => {
                  setLightColor(event.target.value);
                  clearResult();
                }}
                className="h-10 w-12 cursor-pointer rounded-lg border-0 bg-transparent"
                aria-label="QR background color"
              />
              <span className="text-xs text-slate-300">
                Background
                <span className="mt-1 block font-mono text-slate-500">
                  {lightColor.toUpperCase()}
                </span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Generate button */}
      <button
        type="button"
        onClick={generate}
        disabled={generating || !text.trim()}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-4 text-sm font-bold text-slate-950 shadow-[0_12px_35px_rgba(34,211,238,0.13)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {generating ? (
          <>
            <RefreshCw size={18} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <QrCode size={18} />
            Generate QR Code
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-300"
        >
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Generated QR */}
      {qr && (
        <div className="overflow-hidden rounded-2xl border border-emerald-400/20 bg-[#0c1726]">
          <div className="flex items-center gap-2 border-b border-emerald-400/15 bg-emerald-400/[0.04] px-5 py-4 text-sm font-semibold text-emerald-300">
            <CheckCircle2 size={19} />
            QR code generated successfully
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <div className="flex justify-center rounded-xl border border-white/10 bg-[#090f1c] p-6">
              <img
                src={qr}
                alt="Generated QR code"
                className="h-auto w-full max-w-[320px] rounded-lg bg-white p-3"
              />
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0b1422] p-4">
              <p className="mb-2 text-xs font-medium text-slate-400">
                Encoded content
              </p>

              <p className="break-all text-sm leading-6 text-slate-200">
                {generatedText}
              </p>

              <button
                type="button"
                onClick={copyText}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
              >
                {copied ? (
                  <>
                    <Check size={15} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    Copy text
                  </>
                )}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={downloadPNG}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:brightness-110"
              >
                <Download size={17} />
                Download PNG
              </button>

              <button
                type="button"
                onClick={downloadSVG}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15"
              >
                <Download size={17} />
                Download SVG
              </button>
            </div>

            <p className="text-center text-xs leading-6 text-slate-500">
              Test your QR code with a phone camera before printing.
              Maintain sufficient contrast for reliable scanning.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
