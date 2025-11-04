import Notification from "../model/Notification.js";

// Create and emit notification
export const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
    });

    // Emit notification in real-time
    const io = req.app.get("io");
    io.to(userId.toString()).emit("new-notification", notification);

    res.status(201).json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Fetch user notifications
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
