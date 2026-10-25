import { useState } from "react";

export default function PercentageCalculator() {
  const [mode, setMode] = useState("of");
  const [a, setA] = useState("20");
  const [b, setB] = useState("150");
  const [c, setC] = useState("200");

  const x = Number(a);
  const y = Number(b);
  const z = Number(c);
  let result = null;

  if ([x, y].every(Number.isFinite)) {
    if (mode === "of") result = y * x / 100;
    if (mode === "what") result = y === 0 ? null : x / y * 100;
    if (mode === "change" && Number.isFinite(z) && x !== 0) {
      result = (y - x) / Math.abs(x) * 100;
    }
    if (mode === "discount" && Number.isFinite(z)) {
      result = z * (1 - x / 100);
    }
  }

  return (
    <div className="tool-form">
      <label>
        Calculation
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="of">What is X% of Y?</option>
          <option value="what">X is what percent of Y?</option>
          <option value="change">Percentage change from X to Y</option>
          <option value="discount">Price after X% discount on Y</option>
        </select>
      </label>
      <div className="field-row">
        <label>{mode === "change" ? "Original value" : mode === "discount" ? "Discount (%)" : "X"}
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} />
        </label>
        <label>{mode === "change" ? "New value" : mode === "discount" ? "Original price" : "Y"}
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} />
        </label>
      </div>
      {mode === "change" && (
        <p className="muted">Enter the original value in X and the new value in Y.</p>
      )}
      <div className="result-panel">
        <span className="muted">Result</span>
        <strong className="big-result">
          {result === null || !Number.isFinite(result)
            ? "Enter valid values"
            : `${Number(result.toFixed(6)).toLocaleString()}${mode === "what" || mode === "change" ? "%" : ""}`}
        </strong>
        {mode === "discount" && Number.isFinite(x) && Number.isFinite(y) && (
          <p>You save {(y * x / 100).toLocaleString()}.</p>
        )}
      </div>
    </div>
  );
}
