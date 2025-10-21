import { useEffect, useRef } from "react";
import { DotLottie } from "@lottiefiles/dotlottie-web";

export default function LoaderAnimation({
  src,
  width = 300,
  height = 300,
  logoSrc = "/logo.png", // default logo path
  appName = "SuvinEditography", // default app name
}) {
  const canvasRef = useRef(null);
  const lottieInstance = useRef(null);

  useEffect(() => {
    lottieInstance.current = new DotLottie({
      canvas: canvasRef.current,
      autoplay: true,
      loop: true,
      src,
      renderConfig: {
        autoResize: true,
        devicePixelRatio: window.devicePixelRatio,
      },
      layout: { fit: "contain", align: [0.5, 0.5] },
    });

    return () => lottieInstance.current?.destroy();
  }, [src]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {/* Lottie Animation as background */}
      <canvas
        ref={canvasRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
        }}
      />

      {/* Logo and Text in center */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "fadeInUp 1s ease-out",
        }}
      >
        {/* Logo */}
        <img
          src={logoSrc}
          alt="Logo"
          style={{
            width: "100px",
            animation: "scaleBounce 1.2s ease-in-out infinite alternate",
          }}
        />

        {/* App Name */}
        <h1
          style={{
            color: "white",
            marginTop: "15px",
            fontSize: "28px",
            fontWeight: "bold",
            textAlign: "center",
            animation: "fadeIn 1.5s ease-in",
          }}
        >
          {appName}
        </h1>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes scaleBounce {
          0% { transform: scale(0.9); }
          100% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
