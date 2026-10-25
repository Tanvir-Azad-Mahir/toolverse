
import {
  Image,
  Maximize,
  QrCode,
  Type,
  Braces,
  Calculator,
  CaseUpper,
  KeyRound,
  Fingerprint,
  Binary,
} from "lucide-react";

export const tools = [
  {
    id: "compress",
    name: "Image Compressor",
    description: "Shrink image files while keeping them looking sharp.",
    icon: Image,
    category: "Images",
  },
  {
    id: "resize",
    name: "Image Resizer",
    description: "Get the exact dimensions you need in seconds.",
    icon: Maximize,
    category: "Images",
  },
  {
    id: "qr",
    name: "QR Code Generator",
    description: "Turn links and text into downloadable QR codes.",
    icon: QrCode,
    category: "Utilities",
  },
  {
    id: "words",
    name: "Word Counter",
    description: "Count words, characters, and reading time.",
    icon: Type,
    category: "Writing",
  },
  {
    id: "json",
    name: "JSON Formatter",
    description: "Validate, format, and minify JSON with ease.",
    icon: Braces,
    category: "Developer",
  },
  {
    id: "percent",
    name: "Percentage Calculator",
    description: "Calculate percentages, discounts, and changes.",
    icon: Calculator,
    category: "Calculators",
  },
  {
    id: "textcase",
    name: "Text Case Converter",
    description: "Switch between uppercase, lowercase, and more.",
    icon: CaseUpper,
    category: "Writing",
  },
  {
    id: "password",
    name: "Password Generator",
    description: "Create secure passwords with customizable settings.",
    icon: KeyRound,
    category: "Security",
  },
  {
    id: "uuid",
    name: "UUID Generator",
    description: "Generate random UUID v4 identifiers instantly.",
    icon: Fingerprint,
    category: "Developer",
  },
  {
    id: "base64",
    name: "Base64 Converter",
    description: "Encode and decode text with UTF-8 support.",
    icon: Binary,
    category: "Developer",
  },
];

export const descriptions = {
  compress: {
    eyebrow: "IMAGE TOOLS",
    title: "Image Compressor",
    description: "Reduce image file size directly in your browser.",
  },
  resize: {
    eyebrow: "IMAGE TOOLS",
    title: "Image Resizer",
    description: "Resize images to the dimensions you need.",
  },
  qr: {
    eyebrow: "QUICK UTILITIES",
    title: "QR Code Generator",
    description: "Turn text or links into downloadable QR codes.",
  },
  words: {
    eyebrow: "WRITING TOOLS",
    title: "Word Counter",
    description: "Analyze word count, characters, and reading time.",
  },
  json: {
    eyebrow: "DEVELOPER TOOLS",
    title: "JSON Formatter",
    description: "Validate, format, and minify JSON instantly.",
  },
  percent: {
    eyebrow: "CALCULATORS",
    title: "Percentage Calculator",
    description: "Solve percentage, discount, and change calculations.",
  },
  textcase: {
    eyebrow: "WRITING TOOLS",
    title: "Text Case Converter",
    description: "Convert text between capitalization styles.",
  },
  password: {
    eyebrow: "SECURITY TOOLS",
    title: "Password Generator",
    description: "Generate strong random passwords in your browser.",
  },
  uuid: {
    eyebrow: "DEVELOPER TOOLS",
    title: "UUID Generator",
    description: "Generate UUID version 4 identifiers in bulk.",
  },
  base64: {
    eyebrow: "DEVELOPER TOOLS",
    title: "Base64 Encoder / Decoder",
    description: "Encode and decode Base64 text directly in your browser.",
  },
};

export const categories = [
  "All tools",
  "Images",
  "Writing",
  "Developer",
  "Utilities",
  "Calculators",
  "Security",
];
