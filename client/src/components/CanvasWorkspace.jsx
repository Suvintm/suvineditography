import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { fabric } from "fabric";

const CanvasWorkspace = forwardRef(({ onInit, initialJson }, ref) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [zoom, setZoom] = useState(1);

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvas,
    zoomIn: () => setZoom((z) => Math.min(z + 0.1, 2)),
    zoomOut: () => setZoom((z) => Math.max(z - 0.1, 0.5)),
    resetZoom: () => setZoom(1),
    getZoom: () => zoom,
    toJSON: () => (canvas ? canvas.toJSON() : null),
    loadFromJSON: (json) => {
      if (canvas && json) {
        canvas.loadFromJSON(json, () => {
          canvas.renderAll();
        });
      }
    },
  }));

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#111",
      selection: true,
      preserveObjectStacking: true,
    });
    setCanvas(fabricCanvas);

    const resizeCanvas = () => {
      if (!fabricCanvas) return;
      if (initialJson && initialJson.canvasWidth && initialJson.canvasHeight) {
        // ✅ restore saved size
        fabricCanvas.setWidth(initialJson.canvasWidth);
        fabricCanvas.setHeight(initialJson.canvasHeight);
      } else {
        // default 1:1
        const parentWidth = canvasRef.current.parentNode.offsetWidth;
        let newWidth = Math.min(Math.max(parentWidth - 20, 280), 900);
        fabricCanvas.setWidth(newWidth);
        fabricCanvas.setHeight(newWidth);
      }
      fabricCanvas.renderAll();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    if (onInit) onInit(fabricCanvas);

    // ✅ load saved state
    if (initialJson && initialJson.canvasState) {
      fabricCanvas.loadFromJSON(initialJson.canvasState, () => {
        fabricCanvas.renderAll();
      });
    }

    return () => {
      fabricCanvas.dispose();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [onInit, initialJson]);

  // ✅ zoom wrapper
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setZoom((z) => Math.min(z + 0.1, 2));
      } else {
        setZoom((z) => Math.max(z - 0.1, 0.5));
      }
    };

    wrapper.addEventListener("wheel", handleWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="flex justify-center w-full mt-2 mb-16 overflow-auto">
      <div
        ref={wrapperRef}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          transition: "transform 0.15s ease",
        }}
      >
        <canvas
          ref={canvasRef}
          className="rounded-lg border border-gray-700 shadow-lg max-w-full h-auto"
        />
      </div>
    </div>
  );
});

export default CanvasWorkspace;
