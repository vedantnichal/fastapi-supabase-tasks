import os

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

SUPABASE_URL=os.getenv("SUPABASE_URL")
SUPABASE_KEY=os.getenv("SUPABASE_KEY")

if not SUPABASE_KEY or not SUPABASE_URL:
    raise RuntimeError(
        "Missing environment variables for Supabase"
    )

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

print("connected to supabase")