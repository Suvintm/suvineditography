// utils/playSound.js
import notificatiosound from "../assets/notification.mp3"

const playNotificationSound = () => {
  const audio = new Audio(notificatiosound);
  audio.play().catch((err) => {
    console.warn("Autoplay blocked:", err);
  });
};

export default playNotificationSound;
