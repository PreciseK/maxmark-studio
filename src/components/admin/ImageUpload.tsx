"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  bucket?: "project-posters" | "project-gallery" | "site-media";
};

export default function ImageUpload({ value, onChange, label = "Poster Image", bucket = "project-posters" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("File must be an image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const filename = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filename, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = async () => {
    if (!value) return;
    const filename = value.split("/").pop();
    if (!filename) return;
    const supabase = createClient();
    if (value.includes(`/storage/v1/object/public/${bucket}/`)) {
      await supabase.storage.from(bucket).remove([filename]);
    }
    onChange("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)" }}>
        {label}
      </p>

      {value ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Poster preview" style={{ width: "200px", height: "133px", objectFit: "cover", borderRadius: "6px", display: "block" }} />
          <button
            type="button"
            onClick={handleRemove}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              backgroundColor: "rgba(0,0,0,0.7)",
              color: "var(--fg-primary)",
              border: "none",
              borderRadius: "4px",
              padding: "4px 8px",
              fontFamily: "var(--font-geist-mono)",
              fontSize: "10px",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          style={{
            height: "120px",
            border: "1px dashed var(--admin-input-border)",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            gap: "8px",
            opacity: uploading ? 0.5 : 1,
          }}
        >
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {uploading ? "Uploading…" : "Click or drag to upload"}
          </p>
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "10px", color: "var(--fg-subtle)" }}>
            Max 5MB · JPG, PNG, WEBP
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && (
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--accent)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
