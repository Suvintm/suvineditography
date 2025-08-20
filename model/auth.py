# auth.py
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer
from config import JWT_SECRET, JWT_ALGORITHM

security = HTTPBearer()

def verify_token(credentials = Security(security)):
    """
    Verifies JWT token issued by Node.js backend.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload  # Contains decoded user data
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
