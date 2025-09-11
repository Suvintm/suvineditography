import { BadgeCheckIcon } from "lucide-react";
import React from "react";
import logo from "../assets/logo.png";

export default function StockCard({ stock, onOpen, onEdit, onDelete }) {
  // stock may come as stock.stock if wrapped; handle that
  const s = stock.stock || stock;

  const preview = (() => {
    if (!s.url && !s.fileUrl) return null;

    // Use fileUrl if available, otherwise fallback to url
    const src = s.fileUrl || s.thumbnailUrl || s.url;

    if (s.type === "image" || s.type === "png" || s.type === "icon") {
      return (
        <img
          src={src}
          alt={s.title}
          className="w-full h-40 object-cover rounded-t"
        />
      );
    }
    if (s.type === "video") {
      return (
        <video className="w-full h-40 object-cover rounded-t" controls muted>
          <source src={src} />
          Your browser does not support the video tag.
        </video>
      );
    }
    if (s.type === "audio" || s.type === "music") {
      return (
        <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-t">
          <audio controls>
            <source src={src} />
          </audio>
        </div>
      );
    }

    // fallback for unknown types
    return (
      <img
        src={src}
        alt={s.title}
        className="w-full h-40 object-cover rounded-t"
      />
    );
  })();

  return (
    <div className="max-w-xs bg-white rounded-2xl shadow-2xl shadow-gray-200 overflow-hidden">
      <div className="cursor-pointer" onClick={() => onOpen && onOpen(s)}>
        {preview}
      </div>

      <div className="p-2">
        <div className="flex items-center gap-2">
          <img src={logo} alt="avatar" className="w-5 h-5 rounded-full" />
          <div className="flex-1 text-sm">
            <div className="font-bold text-gray-600 text-[12px] flex items-center">
              {s.uploaderName || "Unknown"}
              {s.uploaderRole === "admin" && (
                <span
                  title="Admin upload"
                  className="ml-1 inline-flex items-center text-blue-500"
                >
                  <BadgeCheckIcon className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-[10px] text-gray-500 mt-1">
          {s.category
            ? s.category.charAt(0).toUpperCase() + s.category.slice(1)
            : ""}
          {s.subcategory
            ? ` + ${
                s.subcategory.charAt(0).toUpperCase() + s.subcategory.slice(1)
              }`
            : ""}
        </div>

        <h3 className="mt-2 font-semibold text-sm truncate">{s.title}</h3>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
          {s.description}
        </p>

        <div
          className="text-xs px-2 py-0.5 rounded text-white mt-1 inline-block"
          style={{
            background: s.status === "premium" ? "#b45309" : "#059669",
          }}
        >
          {s.status}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(s)}
                className="text-blue-600 text-xs"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(s._id)}
                className="text-red-500 text-xs"
              >
                Delete
              </button>
            )}
          </div>
          <button
            onClick={() => onOpen && onOpen(s)}
            className="text-sm bg-slate-100 px-2 py-1 rounded"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
