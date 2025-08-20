# main.py
from fastapi import FastAPI, File, UploadFile, Depends
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
import uvicorn

from auth import verify_token
from bg_model import remove_bg_bytes

app = FastAPI(title="Background Remover API", version="1.0")

# Enable CORS so React frontend can call FastAPI directly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can set ["http://localhost:5173"] for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/remove-bg")
async def remove_background(
    file: UploadFile = File(...),
    user_data: dict = Depends(verify_token)  # Validates JWT
):
    """
    Removes background from uploaded image.
    """
    image_bytes = await file.read()
    output_bytes = remove_bg_bytes(image_bytes)
    return StreamingResponse(BytesIO(output_bytes), media_type="image/png")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
