# bg_model.py
from rembg import remove

def remove_bg_bytes(image_bytes: bytes) -> bytes:
    """
    Removes background from an image and returns PNG bytes.
    """
    return remove(image_bytes)
