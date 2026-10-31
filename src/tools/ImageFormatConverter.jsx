import { useState } from "react";
import { Download, Image as ImageIcon, AlertCircle } from "lucide-react";

const fieldClass =
  "mt-2 w-full min-w-0 rounded-xl border border-[#34453A] bg-[#101712] px-4 py-3 text-sm text-[#F0FDF4] outline-none transition-colors focus:border-[#86EFAC]/60 focus-visible:ring-2 focus-visible:ring-[#86EFAC]/15 file:mr-3 file:rounded-lg file:border-0 file:bg-[#273A2C] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#C9F5D6]";

const MAX_PIXELS = 80_000_000;
const FORMAT_EXTENSIONS = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to decode this image."));
    image.src = src;
  });
}

export default function ImageFormatConverter() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState(0.9);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function convert() {
    if (!file || busy) return;

    setBusy(true);
    setError("");
    let sourceUrl;
    let downloadUrl;

    try {
      sourceUrl = URL.createObjectURL(file);
      const image = await loadImage(sourceUrl);
      const width = image.naturalWidth;
      const height = image.naturalHeight;

      if (!width || !height || width * height > MAX_PIXELS) {
        throw new Error("Image is too large or has invalid dimensions.");
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable in this browser.");

      if (format === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
      }
      context.drawImage(image, 0, 0);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, format, quality)
      );
      if (!blob || blob.type !== format) {
        throw new Error("This browser cannot export the selected format.");
      }

      downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${file.name.replace(/\.[^.]+$/, "")}.${FORMAT_EXTENSIONS[format]}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to convert image.");
    } finally {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (downloadUrl) {
        const urlToRevoke = downloadUrl;
        window.setTimeout(() => URL.revokeObjectURL(urlToRevoke), 1000);
      }
      setBusy(false);
    }
  }

  return (
    <div className="space-y-7 text-[#F0FDF4]">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
          <ImageIcon size={22} className="text-[#86EFAC]" />
          Image Format Converter
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#A8B8AC]">
          Convert an image to PNG, JPEG, or WebP directly in your browser.
        </p>
      </div>

      <div className="space-y-5 rounded-2xl border border-[#34453A] bg-[#171F1A] p-4 sm:p-6">
        <label className="block text-sm font-medium text-[#DCEBDD]">
          Choose image
          <input
            className={fieldClass}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/bmp,image/gif"
            onChange={(event) => {
              setFile(event.target.files?.[0] || null);
              setError("");
            }}
          />
        </label>

        {file && (
          <p className="break-all text-xs text-[#A8B8AC]">
            Selected: {file.name}
          </p>
        )}

        <label className="block text-sm font-medium text-[#DCEBDD]">
          Output format
          <select
            className={fieldClass}
            value={format}
            onChange={(event) => setFormat(event.target.value)}
          >
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
          </select>
        </label>

        {format !== "image/png" && (
          <label className="block text-sm font-medium text-[#DCEBDD]">
            Quality: {Math.round(quality * 100)}%
            <input
              className="mt-3 w-full accent-[#86EFAC]"
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(event) => setQuality(Number(event.target.value))}
            />
          </label>
        )}
      </div>

      <p className="text-xs leading-6 text-[#A8B8AC]">
        Animated images are converted using their first frame. Transparent areas
        are filled white when exporting JPEG.
      </p>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-400/25 bg-red-400/[0.06] p-4 text-sm text-red-300"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="button"
        onClick={convert}
        disabled={!file || busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#86EFAC] px-5 py-3.5 text-sm font-bold text-[#101210] transition-colors hover:bg-[#A7F3C0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86EFAC] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        <Download size={17} />
        {busy ? "Converting..." : "Convert & Download"}
      </button>
    </div>
  );
}
