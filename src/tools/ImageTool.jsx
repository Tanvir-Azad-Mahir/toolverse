import { useEffect, useState } from "react";
import { ArrowRight, Download, Upload } from "lucide-react";
import { downloadBlob, formatBytes } from "../utils/image";

export default function ImageTool({ resize = false }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [quality, setQuality] = useState(75);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [keepRatio, setKeepRatio] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [preview, result]);

  function loadFile(next) {
    if (!next) return;
    if (!next.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setError("");
    setFile(next);
    setPreview(URL.createObjectURL(next));
    setResult(null);

    const image = new window.Image();
    image.onload = () => {
      setWidth(image.naturalWidth);
      setHeight(image.naturalHeight);
    };
    image.src = URL.createObjectURL(next);
  }

  async function processImage() {
    if (!file) return;
    setError("");

    try {
      const image = new window.Image();
      image.src = preview;
      await image.decode();

      let w = image.naturalWidth;
      let h = image.naturalHeight;

      if (resize) {
        w = Math.max(1, Math.min(10000, Number(width) || 1));
        h = Math.max(1, Math.min(10000, Number(height) || 1));
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser could not create a canvas.");

      // JPEG has no transparency, so fill its background white.
      const outputType = resize
        ? (file.type === "image/png" ? "image/png" : "image/jpeg")
        : (file.type === "image/png" ? "image/png" : "image/jpeg");

      if (outputType === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
      }

      ctx.drawImage(image, 0, 0, w, h);

      canvas.toBlob((blob) => {
        if (!blob) {
          setError("Image processing failed. Try another image.");
          return;
        }

        const url = URL.createObjectURL(blob);
        setResult({
          url,
          blob,
          size: blob.size,
          width: w,
          height: h,
        });
      }, outputType, quality / 100);
    } catch {
      setError("Could not process this image. Please try another file.");
    }
  }

  return (
    <div className="tool-form">
      <label className="upload-zone">
        <Upload size={28} />
        <strong>{file ? file.name : "Choose an image"}</strong>
        <span>JPG, PNG, WebP and other browser-supported image formats</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => loadFile(e.target.files?.[0])}
          hidden
        />
      </label>

      {file && (
        <>
          <div className="image-info">
            <img src={preview} alt="Original image preview" />
            <div>
              <strong>{file.name}</strong>
              <p>{formatBytes(file.size)}</p>
            </div>
          </div>

          {resize ? (
            <div className="field-row">
              <label>
                Width (px)
                <input type="number" min="1" max="10000"
                  value={width}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setWidth(next);
                    if (keepRatio && file && width > 0) {
                      setHeight(Math.round(next * height / width));
                    }
                  }} />
              </label>
              <label>
                Height (px)
                <input type="number" min="1" max="10000"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))} />
              </label>
            </div>
          ) : (
            <label className="range-field">
              <span>Image quality <strong>{quality}%</strong></span>
              <input type="range" min="10" max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))} />
            </label>
          )}

          {resize && (
            <label className="check-row">
              <input type="checkbox" checked={keepRatio}
                onChange={(e) => setKeepRatio(e.target.checked)} />
              Preserve aspect ratio
            </label>
          )}

          <button className="primary-button" onClick={processImage}>
            {resize ? "Resize image" : "Compress image"} <ArrowRight size={17} />
          </button>
        </>
      )}

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div className="result-panel">
          <img src={result.url} alt="Processed image preview" />
          <strong>{formatBytes(result.size)}</strong>
          <p>{result.width} × {result.height} px</p>
          {!resize && (
            <p>
              {result.size <= file.size
                ? `${Math.round((1 - result.size / file.size) * 100)}% smaller`
                : "This format produced a larger file."}
            </p>
          )}
          <button className="primary-button"
            onClick={() => downloadBlob(
              result.blob,
              `${file.name.replace(/\.[^.]+$/, "")}-${resize ? "resized" : "compressed"}.${result.blob.type === "image/png" ? "png" : "jpg"}`
            )}>
            <Download size={17} /> Download image
          </button>
        </div>
      )}
    </div>
  );
}
