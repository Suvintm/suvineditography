// client/src/pages/StockPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BadgeCheck, Download, Search, Loader2, X, Tag } from "lucide-react"; // icons
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import "react-toastify/dist/ReactToastify.css";

const DEFAULT_TYPES = ["all", "image", "video", "audio", "music"];
const DEFAULT_CATEGORIES = [
  "all",
  "posters",
  "banners",
  "flyers",
  "wallpapers",
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
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stocks/${stock._id}/download`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const link = document.createElement("a");
      link.href = stock.url;
      link.download = stock.originalFileName || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started!");
      setSelectedStock(null);
    } catch (err) {
      console.error(err);
      toast.error("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      {/* Navbar */}
      <nav className="bg-white  px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="logo" className="w-8 h-8" />
          <span className="font-bold text-lg">SuvinEditography</span>
        </div>
      </nav>

      <div className="p-4 space-y-4 flex-1">
        {/* Search bar */}
        <div className="relative w-full max-w-lg mx-auto">
          <div className="flex items-center  rounded-full bg-white px-3 py-2 ">
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
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
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

        {/* Loader */}
        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Stocks grid */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4    rounded-3xl">
            {stocks.map((stock) => (
              <div
                key={stock._id}
                className="bg-white border-1 border-white rounded-3xl overflow-hidden flex flex-col hover:shadow-lg transition"
              >
                {/* Preview */}
                {/* Preview */}
                <div className="w-full bg-black flex justify-center items-center">
                  {stock.type === "video" ? (
                    <video
                      src={stock.url}
                      controls
                      className="w-full max-h-80 object-contain"
                    />
                  ) : stock.type === "audio" || stock.type === "music" ? (
                    <audio src={stock.url} controls className="w-full" />
                  ) : (
                    <img
                      src={stock.url}
                      alt={stock.title}
                      className="w-full max-h-80 object-contain"
                    />
                  )}
                </div>

                <div className="p-3 flex flex-col flex-1">
                  {/* Uploader */}
                  <div className="flex items-center space-x-2">
                    <img
                      src="/logo.png"
                      alt="uploader"
                      className="w-7 h-7 rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Uploaded by</span>
                      <span className="sm:text-sm text-[12px] font-medium flex items-center">
                        {stock.uploaderName}
                        {stock.uploaderName === "suvineditography" && (
                          
                          <CheckBadgeIcon className="w-3 h-4 text-blue-500 ml-1" />
                        )}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-sm mt-2">{stock.title}</h3>

                  {/* Tags */}
                  {stock.tags && stock.tags.length > 0 && (
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

                  {/* Status */}
                  <span
                    className={`mt-2 inline-block w-15 items-center-safe justify-center-safe px-4 py-0.5 text-xs rounded-full mb-1 ${
                      stock.status === "free"
                        ? "bg-green-400 text-white"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {stock.status.toUpperCase()}
                  </span>

                  {/* Download btn */}
                  <button
                    onClick={() => setSelectedStock(stock)}
                    className="mt-auto bg-black text-white gap-1 py-1.5 px-3 rounded-md flex items-center text-[12px] justify-center hover:bg-blue-700 transition"
                  >
                    <span>View &</span>
                    <Download className="w-4 h-4 mr-1  " />
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
              <p className="text-xs text-gray-500 mb-1">Original File</p>
              <a
                href={selectedStock.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm break-all"
              >
                <img
                  src={selectedStock.url}
                  alt={selectedStock.title}
                  className="mt-2 rounded-md"
                />
              </a>
            </div>

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
