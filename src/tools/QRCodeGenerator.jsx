import { useState } from "react";
import QRCode from "qrcode";
import { ArrowRight, Download } from "lucide-react";

export default function QRCodeGenerator() {
  const [text, setText] = useState("");
  const [qr, setQr] = useState("");
  const [error, setError] = useState("");

  async function generate() {
    if (!text.trim()) {
      setError("Enter a URL or text first.");
      return;
    }
    try {
      setQr(await QRCode.toDataURL(text.trim(), {
        width: 320, margin: 2,
        color: { dark: "#10131A", light: "#FFFFFF" },
      }));
      setError("");
    } catch {
      setError("Could not generate the QR code.");
    }
  }

  return (
    <div className="tool-form">
      <label>
        Text or URL
        <textarea rows="3" value={text} onChange={(e) => setText(e.target.value)}
          placeholder="https://example.com" />
      </label>
      <button className="primary-button" onClick={generate}>
        Generate QR code <ArrowRight size={17} />
      </button>
      {error && <p className="error-text">{error}</p>}
      {qr && <div className="result-panel">
        <img className="qr-image" src={qr} alt="Generated QR code" />
        <button className="secondary-button"
          onClick={() => {
            const a = document.createElement("a");
            a.href = qr;
            a.download = "toolverse-qr.png";
            a.click();
          }}>
          <Download size={17} /> Download PNG
        </button>
      </div>}
    </div>
  );
}
