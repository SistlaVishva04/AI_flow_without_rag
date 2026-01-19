import requests
from jose import jwt
import os
from dotenv import load_dotenv
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")

JWKS_URL = f"{SUPABASE_URL}/auth/v1/certs"
def verify_token(token: str):
    jwks = requests.get(JWKS_URL).json()
    return jwt.decode(token, jwks, audience="authenticated", algorithms=["RS256"])
