import logo from "../assets/logo.png";

export default function LoadingSplash() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90">
      <img src={logo} alt="Logo" className="w-20 mb-6 animate-bounce" />
      <div className="w-48 h-2 bg-gray-300 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-600 animate-loading-bar" />
      </div>
      <style>
        {`
          @keyframes loading-bar {
            0% { width: 0; }
            100% { width: 100%; }
          }
          .animate-loading-bar {
            animation: loading-bar 2s linear forwards;
          }
        `}
      </style>
    </div>
  );
}