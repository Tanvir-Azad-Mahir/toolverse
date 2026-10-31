import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Check, Download, Trash2 } from "lucide-react";

const input = "w-full rounded-xl border border-white/10 bg-[#080f1c] px-4 py-3 font-mono text-sm text-slate-100 outline-none focus:border-cyan-400/50 placeholder:text-slate-600";
const button = "rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-semibold text-slate-950 hover:brightness-110 disabled:opacity-40";
const subtle = "rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10";
const box = "rounded-xl border border-white/10 bg-[#080f1c] p-4 text-sm text-slate-200";
function download(filename, content, type = "text/plain") { const url = URL.createObjectURL(new Blob([content], {type})); const a=document.createElement("a");a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000); }
function CopyButton({text}) {const [copied,setCopied]=useState(false);return <button type="button" className={subtle} disabled={!text} onClick={async()=>{try{await navigator.clipboard.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),1500)}catch{setCopied(false)}}}>{copied?<><Check size={15} className="inline"/> Copied</>:<><Copy size={15} className="inline"/> Copy</>}</button>}

export default function URLEncoderDecoder(){const [value,setValue]=useState('hello world & more'),[mode,setMode]=useState('encode');const result=useMemo(()=>{try{return {text:mode==='encode'?encodeURIComponent(value):decodeURIComponent(value),error:''}}catch(e){return {text:'',error:e.message}}},[value,mode]);return <div className="space-y-5"><h2 className="text-xl font-bold">URL Encoder / Decoder</h2><div className="flex gap-2">{['encode','decode'].map(x=><button key={x} className={mode===x?button:subtle} onClick={()=>setMode(x)}>{x==='encode'?'Encode':'Decode'}</button>)}</div><textarea className={input+" min-h-40"} value={value} onChange={e=>setValue(e.target.value)} placeholder="Enter text"/>{result.error&&<p role="alert" className="text-red-300">{result.error}</p>}<pre className={box+" whitespace-pre-wrap break-all"}>{result.text}</pre><CopyButton text={result.text}/></div>}
