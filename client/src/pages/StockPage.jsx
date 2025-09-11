import React, { useEffect, useState, useRef } from "react";
import StockCard from "../components/StockCard";
import StockDetailModal from "../components/StockDetailModal";
import { getStocks } from "../services/stockService";
import { Link } from "react-router-dom";

// Stock types
const DEFAULT_TYPES = ["all", "image", "video", "audio", "icon", "png"];

// Categories (main + subcategories)
const CATEGORIES_BY_TYPE = {
  all: ["all", "nature", "people", "tech", "abstract", "food", "business"],
  image: ["all", "nature", "people", "tech", "abstract", "food"],
  video: ["all", "travel", "music", "sports", "tutorial"],
  audio: ["all", "music", "sfx", "ambient"],
  icon: ["all", "ui", "social", "arrow"],
  png: ["all", "sticker", "overlay"],
};

// Example subcategories for main categories
const SUBCATEGORIES = {
  nature: ["forest", "mountains", "ocean", "flowers"],
  people: ["portraits", "family", "friends", "business"],
  tech: ["gadgets", "ai", "robotics"],
  travel: ["beach", "city", "adventure"],
  music: ["pop", "rock", "classical"],
};

export default function StockPage() {
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [subcategory, setSubcategory] = useState("all");
  const [q, setQ] = useState("");
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const searchTimer = useRef(null);

  useEffect(() => {
    fetchStocks();
    setSubcategory("all"); // reset subcategory when main category changes
  }, [type, category]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchStocks();
    }, 450);
    return () => clearTimeout(searchTimer.current);
  }, [q, subcategory]);

  const fetchStocks = async (page = 1) => {
    setLoading(true);
    try {
      const params = {};
      if (type && type !== "all") params.type = type;
      if (category && category !== "all")
        params.category = category.toLowerCase();
      if (subcategory && subcategory !== "all")
        params.subcategory = subcategory.toLowerCase();
      if (q) params.q = q;
      params.page = page;
      params.limit = 36;

      const data = await getStocks(params);
      const arr = Array.isArray(data)
        ? data
        : data.stocks || data.results || [];
      setStocks(arr);
    } catch (e) {
      console.error("Fetch stocks error", e);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (s) => setSelected(s);
  const closeDetail = () => setSelected(null);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h1 className="text-2xl font-bold">Stock Library</h1>
        <Link
          to="/stocks/upload"
          className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        >
          Upload
        </Link>
      </div>

      <div className="mb-6 space-y-3">
        {/* Stock types */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {DEFAULT_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => {
                setType(t);
                setCategory("all");
                setSubcategory("all");
              }}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                t === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search input */}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title, tags..."
          className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300"
        />

        {/* Main Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(CATEGORIES_BY_TYPE[type] || CATEGORIES_BY_TYPE.all).map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c.toLowerCase());
                setSubcategory("all"); // reset subcategory
              }}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                category === c.toLowerCase()
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Subcategories (if available) */}
        {category !== "all" && SUBCATEGORIES[category] && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-2">
            {["all", ...SUBCATEGORIES[category]].map((sub) => (
              <button
                key={sub}
                onClick={() => setSubcategory(sub.toLowerCase())}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  subcategory === sub.toLowerCase()
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stock grid */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : stocks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No results found</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {stocks.map((s) => (
            <StockCard key={s._id} stock={s} onOpen={openDetail} />
          ))}
        </div>
      )}

      {selected && <StockDetailModal stock={selected} onClose={closeDetail} />}
    </div>
  );
}
