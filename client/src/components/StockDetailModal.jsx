// client/src/components/StockDetailModal.jsx
import React, { useState } from "react";

export default function StockDetailModal({ stock, onClose }) {
  if (!stock) return null;
  const s = stock.stock || stock;

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const a = document.createElement("a");
      a.href = s.url;
      const filename =
        s.originalFileName ||
        `${s.title || "download"}.${
          (s.mimeType || "bin").split("/").pop()
        }`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error("Download failed", e);
      alert("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  // Generate proper preview based on type
  const preview = (() => {
    const src = s.thumbnailUrl || s.url;
    if (!src) return null;

    if (["image", "png", "icon"].includes(s.type)) {
      return <img src={src} alt={s.title} className="max-h-[60vh] object-contain" />;
    }

    if (s.type === "video") {
      return (
        <video controls className="max-h-[60vh] w-full object-contain">
          <source src={src} />
        </video>
      );
    }

    if (s.type === "audio") {
      return (
        <div className="w-full flex justify-center items-center h-24 bg-gray-100 rounded">
          <audio controls>
            <source src={src} />
          </audio>
        </div>
      );
    }

    // fallback
    return <img src={src} alt={s.title} className="max-h-[60vh] object-contain" />;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">{s.title}</h2>
          <button onClick={onClose} className="text-gray-600">
            Close
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-center bg-gray-50 rounded">
            {preview}
          </div>

          <div>
            <div className="text-sm text-gray-600">
              By <strong>{s.uploaderName || "Unknown"}</strong>{" "}
              {s.uploaderRole === "admin" && (
                <span className="text-blue-500">✔ Admin</span>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-700">{s.description}</div>

            <div className="mt-4">
              <div className="text-xs text-gray-500">Category</div>
              <div className="text-sm">
                {s.category} {s.subcategory ? ` / ${s.subcategory}` : ""}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-gray-500">Tags</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(s.tags || []).map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-1 bg-slate-100 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={downloading}
              >
                {downloading ? "Downloading..." : "Download"}
              </button>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 border rounded text-sm"
              >
                Open raw
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
