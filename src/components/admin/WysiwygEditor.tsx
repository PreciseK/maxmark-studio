"use client";

import { useEffect, useRef } from "react";

type Props = { value: string; onChange: (html: string) => void; label?: string };

const tools = [
  ["bold", "Bold"], ["italic", "Italic"], ["formatBlock:h2", "Heading"],
  ["formatBlock:p", "Paragraph"], ["insertUnorderedList", "List"], ["createLink", "Link"],
] as const;

export default function WysiwygEditor({ value, onChange, label = "Content" }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (editorRef.current && editorRef.current.innerHTML !== value) editorRef.current.innerHTML = value; }, [value]);

  function run(command: string) {
    const [name, argument] = command.split(":");
    const value = name === "createLink" ? window.prompt("Paste a URL") ?? "" : argument;
    document.execCommand(name, false, value);
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML ?? "");
  }

  return (
    <div>
      <p style={labelStyle}>{label}</p>
      <div style={toolbarStyle} aria-label="Text formatting">
        {tools.map(([command, text]) => <button type="button" onClick={() => run(command)} key={command} style={toolStyle}>{text}</button>)}
      </div>
      <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={(event) => onChange(event.currentTarget.innerHTML)} style={editorStyle} />
    </div>
  );
}

const labelStyle: React.CSSProperties = { margin: "0 0 8px", color: "var(--fg-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase" };
const toolbarStyle: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "6px", padding: "8px", border: "1px solid var(--border)", borderBottom: 0 };
const toolStyle: React.CSSProperties = { border: "1px solid var(--border)", background: "var(--bg-elevated)", color: "var(--fg-muted)", padding: "7px 10px", cursor: "pointer", fontFamily: "var(--font-geist-mono)", fontSize: "10px" };
const editorStyle: React.CSSProperties = { minHeight: "280px", padding: "22px", border: "1px solid var(--admin-input-border)", outline: "none", color: "var(--fg-primary)", fontFamily: "var(--font-geist-sans)", fontSize: "16px", lineHeight: 1.65 };
