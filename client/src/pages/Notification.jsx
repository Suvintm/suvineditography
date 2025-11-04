import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { AppContext } from "../context/AppContext";
import {
  CheckCircle,
  XCircle,
  Info,
  Loader2,
  X,
  Clock,
  Mail,
  MailOpen,
  Inbox,
} from "lucide-react";
import { IoMdReturnLeft } from "react-icons/io";
import { useNavigate } from "react-router-dom";


const NotificationPage = () => {
  const { user, backendUrl } = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const Navigate = useNavigate();

  // ⏰ Auto-update time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // 🕒 Convert timestamp to relative time
  const timeAgo = (createdAt) => {
    const diffMs = currentTime - new Date(createdAt);
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
    if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`;
    return new Date(createdAt).toLocaleDateString();
  };

  // 🔄 Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/notifications/${user.id}`);
      const data = res.data.notifications || [];
      setNotifications(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ WebSocket real-time connection
  useEffect(() => {
    if (!user) return;
    const run = async () => {
      await fetchNotifications();

      const socket = io(backendUrl, { transports: ["websocket"] });
      socket.emit("register", user.id);
      socket.on("new-notification", (data) => {
        setNotifications((prev) => [data, ...prev]);
        if (filterType !== "read") setFiltered((prev) => [data, ...prev]);
      });
      return () => socket.disconnect();
    };
    run();
  }, [user]);

  // ✅ Mark a single notification as read
  const markAsRead = async (id) => {
    try {
      await axios.patch(`${backendUrl}/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  // ✅ Mark all as read
  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.isRead);
      if (unread.length === 0) return;

      await Promise.all(
        unread.map((n) =>
          axios.patch(`${backendUrl}/api/notifications/${n._id}/read`)
        )
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setFiltered((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  // 🎯 Icon selector
  const renderIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-600 w-6 h-6 flex-shrink-0" />;
      case "error":
        return <XCircle className="text-red-600 w-6 h-6 flex-shrink-0" />;
      default:
        return <Info className="text-blue-600 w-6 h-6 flex-shrink-0" />;
    }
  };

  // 🔍 Filter notifications (Unread / Read / All)
  useEffect(() => {
    if (filterType === "unread") {
      setFiltered(notifications.filter((n) => !n.isRead));
    } else if (filterType === "read") {
      setFiltered(notifications.filter((n) => n.isRead));
    } else {
      setFiltered(notifications);
    }
  }, [filterType, notifications]);

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6 sm:p-12 items-center justify-center">
      <div
        onClick={() => Navigate("/")}
        className="flex items-center gap-4 mb-8 text-indigo-700 font-semibold text-lg cursor-pointer"
      >
        {" "}
        <IoMdReturnLeft className="cursor-pointer" />
        Back
      </div>
      <h1 className="text-3xl font-bold text-indigo-700 mb-4 text-center">
        Notifications
      </h1>

      {/* 🧭 Filter Bar + Mark All */}
      <div className="max-w-3xl mx-auto flex justify-between items-center mb-6 flex-wrap gap-3">
        <div className="flex gap-3">
          <button
            onClick={() => setFilterType("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
              filterType === "all"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            <Inbox className="w-4 h-4" /> All
          </button>
          <button
            onClick={() => setFilterType("unread")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
              filterType === "unread"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            <Mail className="w-4 h-4" /> Unread
          </button>
          <button
            onClick={() => setFilterType("read")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
              filterType === "read"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            <MailOpen className="w-4 h-4" /> Read
          </button>
        </div>

        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        >
          <CheckCircle className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      {/* 📨 Notifications Section */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          {filterType === "unread"
            ? "No unread notifications."
            : filterType === "read"
            ? "No read notifications."
            : "No notifications yet."}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-3">
          {filtered.map((n) => {
            const shortMessage =
              n.message.length > 70
                ? `${n.message.slice(0, 70)}... more`
                : n.message;

            return (
              <div
                key={n._id}
                onClick={() => {
                  setSelected(n);
                  if (!n.isRead) markAsRead(n._id);
                }}
                className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  n.isRead
                    ? "bg-white hover:bg-gray-100"
                    : "bg-indigo-100 border border-indigo-300"
                }`}
              >
                {renderIcon(n.type)}
                <div className="flex flex-col w-full">
                  <div className="flex justify-between">
                    <h3
                      className={`font-semibold ${
                        n.isRead ? "text-gray-800" : "text-indigo-800"
                      }`}
                    >
                      {n.title}
                    </h3>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {shortMessage}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 💬 Popup Modal for full message */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-[90%] sm:w-[450px] relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon + Title */}
            <div className="flex items-center gap-3 mb-4">
              {renderIcon(selected.type)}
              <div>
                <h2 className="text-lg font-bold text-indigo-700">
                  {selected.title}
                </h2>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" /> {timeAgo(selected.createdAt)}
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">{selected.message}</p>

            <div className="flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
