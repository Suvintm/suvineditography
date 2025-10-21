// client/src/pages/StockPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BadgeCheck,
  Download,
  Search,
  Loader2,
  X,
  Tag,
  CircleArrowRightIcon,
} from "lucide-react"; // icons
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import "react-toastify/dist/ReactToastify.css";

const DEFAULT_TYPES = ["all", "image", "video", "audio", "music"];
const DEFAULT_CATEGORIES = [
  "all",
  "nature",
  "People",
  "Sports",
  "travel",
  "others",
];

export default function StockPage() {
  const [stocks, setStocks] = useState([]);
  const [types] = useState(DEFAULT_TYPES);
  const [categories] = useState(DEFAULT_CATEGORIES);

  const [activeType, setActiveType] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [selectedStock, setSelectedStock] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);

  // fetch stocks
  const fetchStocks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeType && activeType !== "all") params.type = activeType;
      if (activeCategory && activeCategory !== "all")
        params.category = activeCategory;
      if (search) params.search = search;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/stocks`,
        {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStocks(res.data.stocks || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch stocks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [activeType, activeCategory, search]);

  // fetch auto suggestions (simple version: query every keystroke)
  const fetchSuggestions = async (q) => {
    if (!q) return setSuggestions([]);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/stocks`,
        {
          params: { search: q },
        }
      );
      setSuggestions(res.data.stocks.slice(0, 5)); // top 5
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (stock) => {
    try {
      setDownloading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/stocks/${stock._id}/download`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Get file type from server response
      const contentType = res.headers["content-type"];
      const extension = contentType?.split("/")[1] || ""; // e.g., image/png → png

      // Pick filename: originalFileName > title > fallback
      let filename = stock.originalFileName || stock.title || "download";
      if (extension && !filename.includes(".")) {
        filename = `${filename}.${extension}`;
      }

      // Create a download link
      const blob = new Blob([res.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Download started!");
      setSelectedStock(null);
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Download failed. Try again!");
    } finally {
      setDownloading(false);
    }
  };

  const ShimmerSkeleton = () => {
    return (
      <div className="animate-pulse space-y-4">
        {/* Search bar skeleton */}
        

        {/* Category bar skeleton */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {Array(6)
            .fill("")
            .map((_, i) => (
              <div
                key={i}
                className="w-20 h-8 bg-gray-300 rounded-full shrink-0"
              ></div>
            ))}
        </div>

        {/* Masonry-style grid skeleton */}
        <div className="columns-2 sm:columns-3 lg:columns-6 gap-4 p-2">
          {Array(18)
            .fill("")
            .map((_, i) => (
              <div
                key={i}
                className="mb-4 break-inside-avoid rounded-3xl bg-white shadow-sm overflow-hidden"
              >
                <div className="w-full h-40 bg-gray-300"></div>
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      {/* Navbar
      <nav className="bg-white  px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="logo" className="w-8 h-8" />
          <span className="font-bold text-lg">SuvinEditography</span>
        </div>
      </nav> */}

      <div className="p-4 space-y-4 flex-1">
        {/* Search bar */}
        <div className="relative w-full max-w-lg mx-auto ">
          <div className="flex items-center border border-gray-600 sm:p-4 rounded-full bg-white px-3 py-2 ">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stocks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              className="flex-1 px-3 outline-none rounded-full"
            />
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white shadow rounded-lg mt-1 z-10">
              {suggestions.map((s) => (
                <li
                  key={s._id}
                  onClick={() => {
                    setSearch(s.title);
                    setSuggestions([]);
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {s.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Type scroll bar */}
        <div className="flex space-x-2 overflow-x-auto sm:gap-10 pb-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-4 py-2 sm:px-20 sm:shadow-black sm:shadow-md rounded-full whitespace-nowrap transition ${
                activeType === t
                  ? "bg-black border-1 border-white text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Category scroll bar */}
        {activeType !== "all" && (
          <div className="flex space-x-2  overflow-x-auto pb-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-full  whitespace-nowrap transition ${
                  activeCategory === c
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {c.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="py-6">
            <ShimmerSkeleton />
          </div>
        )}

        {/* Stocks grid */}
        {/* Masonry layout like Pinterest */}
        {!loading && (
          <div className="columns-2 sm:columns-3 lg:columns-6 gap-4 p-2">
            {stocks.map((stock) => (
              <div
                onClick={() => setSelectedStock(stock)}
                key={stock._id}
                className="mb-4 break-inside-avoid overflow-hidden bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-blue-500 transition flex flex-col"
              >
                {/* Preview */}
                <div className="relative w-full bg-black flex justify-center items-center">
                  {stock.type === "video" ? (
                    <video
                      src={stock.url}
                      controls
                      className="w-full rounded-t-3xl object-cover"
                    />
                  ) : stock.type === "audio" || stock.type === "music" ? (
                    <div className="w-full bg-gray-100 p-3 flex flex-col items-center">
                      <audio src={stock.url} controls className="w-full" />
                    </div>
                  ) : (
                    <img
                      src={stock.url}
                      alt={stock.title}
                      className="w-full rounded-t-3xl object-cover"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/logo.png"
                      alt="uploader"
                      className="w-7 h-7 rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Uploaded by</span>
                      <span className="sm:text-sm text-[10px] font-medium flex items-center">
                        {stock.uploaderName}
                        {stock.uploaderName === "suvineditography" && (
                          <CheckBadgeIcon className="w-3 h-4 text-blue-500 ml-1" />
                        )}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-sm mt-2">{stock.title}</h3>

                  {stock.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {stock.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <span
                    className={`mt-2 inline-block w-fit px-3 py-0.5 text-xs rounded-full ${
                      stock.status === "free"
                        ? "bg-green-400 text-white"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {stock.status.toUpperCase()}
                  </span>

                  <div className="flex items-center justify-between mt-1 mb-1 text-xs text-gray-500">
                    <span>Downloads: {stock.downloads || 0}</span>
                  </div>

                  <button
                    onClick={() => setSelectedStock(stock)}
                    className="mt-auto bg-black text-white gap-1 py-1.5 px-3 rounded-md flex items-center text-[12px] justify-center hover:bg-blue-700 transition"
                  >
                    <span>View &</span>
                    <Download className="w-4 h-4 mr-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popover modal for download */}
      {selectedStock && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setSelectedStock(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-2">{selectedStock.title}</h2>
            <p className="text-sm text-gray-600 mb-1">
              Uploaded by: {selectedStock.uploaderName}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Category: {selectedStock.category} | Type: {selectedStock.type}
            </p>
            <p
              className={`text-sm text-gray-600 w-20 rounded-3xl pl-6 p-2 mb-3 ${
                selectedStock.status === "free"
                  ? "bg-green-400 text-white"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {selectedStock.status === "free" ? "Free" : "Paid"}
            </p>

            <div className="bg-white border border-black  rounded-3xl p-3 mb-4">
              <a
                href={selectedStock.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm break-all"
              ></a>

              <p className="text-xs text-gray-500 mb-1">Preview</p>

              {selectedStock.type === "video" ? (
                <video
                  src={selectedStock.url}
                  controls
                  className="w-full rounded-md max-h-60"
                />
              ) : selectedStock.type === "audio" ||
                selectedStock.type === "music" ? (
                <div className="flex flex-col items-center bg-gray-100 rounded-md p-3">
                  <span className="text-sm font-semibold mb-2">
                    🎵 {selectedStock.title}
                  </span>
                  <audio controls src={selectedStock.url} className="w-full" />
                </div>
              ) : (
                <img
                  src={selectedStock.url}
                  alt={selectedStock.title}
                  className="w-full rounded-md max-h-60 object-contain"
                />
              )}
            </div>
            {selectedStock.type === "video" ? (
              <p className="rounded-3xl text-[10px] bg-zinc-300 p-2 flex gap-2 mb-2">
                {" "}
                <CircleArrowRightIcon className="text-green-500 w-4 h-4" /> "If
                Download Fails use three (:) dot menu on the video"
              </p>
            ) : (
              ""
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => handleDownload(selectedStock)}
                disabled={downloading}
                className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                {downloading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />{" "}
                    Downloading
                  </span>
                ) : (
                  "Confirm Download"
                )}
              </button>
              <button
                onClick={() => setSelectedStock(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
