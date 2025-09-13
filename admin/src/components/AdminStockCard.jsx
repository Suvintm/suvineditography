import React, { useState } from "react";
import { CheckBadgeIcon } from "@heroicons/react/24/solid"; // ✅ Verified icon

export default function AdminStockCard({ stock, onDelete }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Stock Card */}
      <div
        className="bg-white border rounded-xl shadow-md p-4 flex flex-col items-center cursor-pointer hover:shadow-xl transition-all duration-200"
        onClick={handleOpen}
      >
        {/* Thumbnail */}
        <div className="mb-3 w-full flex justify-center">
          {stock.type === "video" ? (
            <video
              src={stock.url}
              className="w-full rounded-lg max-h-48 object-cover"
            />
          ) : stock.type === "audio" || stock.type === "music" ? (
            <audio src={stock.url} controls className="w-full" />
          ) : (
            <img
              src={stock.url}
              alt={stock.title}
              className="w-full rounded-lg max-h-48 object-cover"
            />
          )}
        </div>

        {/* Title + Category */}
        <h3 className="font-semibold text-gray-800 text-center line-clamp-1">
          {stock.title}
        </h3>
        <p className="text-sm text-gray-500">{stock.category}</p>

        {/* Uploader */}
        <div className="flex items-center gap-1 mt-2">
          <span className="text-xs text-gray-600">{stock.uploaderName}</span>
          {stock.uploaderName === "suvineditography" && (
            <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
          )}
        </div>
      </div>

      {/* Popover Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-2xl w-full relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
            >
              &times;
            </button>

            {/* Preview */}
            <div className="mb-4">
              {stock.type === "video" ? (
                <video
                  src={stock.url}
                  controls
                  className="w-full rounded-lg max-h-[500px] object-contain"
                />
              ) : stock.type === "audio" || stock.type === "music" ? (
                <audio src={stock.url} controls className="w-full" />
              ) : (
                <img
                  src={stock.url}
                  alt={stock.title}
                  className="w-full rounded-lg max-h-[500px] object-contain"
                />
              )}
            </div>

            {/* Details */}
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              {stock.title}
            </h2>
            <p className="text-gray-700 mb-2">{stock.description}</p>
            <p className="text-sm text-gray-600 mb-3">
              <strong>Category:</strong> {stock.category} |{" "}
              <strong>Status:</strong> {stock.status}
            </p>

            {/* Uploader Name */}
            <div className="flex items-center gap-1 mb-3">
              <span className="text-sm font-medium text-gray-700">
                Uploaded by: {stock.uploaderName}
              </span>
              {stock.uploaderName === "suvineditography" && (
                <CheckBadgeIcon className="w-5 h-5 text-blue-500" />
              )}
            </div>

            {/* Tags */}
            {stock.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {stock.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Delete Button */}
            <button
              onClick={() => {
                handleClose();
                onDelete(stock._id);
              }}
              className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </>
  );
}
