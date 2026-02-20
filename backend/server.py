import os
import re
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")

app = FastAPI(title="NoYzzing OPS API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]


class NewsletterSubscription(BaseModel):
    email: str


class ContactMessage(BaseModel):
    name: str
    email: str
    message: str


@app.get("/api/health")
async def health_check():
    return {"status": "operational", "timestamp": datetime.now(timezone.utc).isoformat(), "version": "2.0.0"}


@app.post("/api/newsletter/subscribe")
async def subscribe_newsletter(sub: NewsletterSubscription):
    email = sub.email.strip().lower()
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    existing = await db.subscribers.find_one({"email": email}, {"_id": 0})
    if existing:
        return {"message": "Already subscribed", "email": email}
    await db.subscribers.insert_one({
        "email": email,
        "subscribed_at": datetime.now(timezone.utc).isoformat()
    })
    return {"message": "Subscribed successfully", "email": email}


@app.post("/api/contact")
async def submit_contact(msg: ContactMessage):
    await db.contacts.insert_one({
        "name": msg.name,
        "email": msg.email,
        "message": msg.message,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    return {"message": "Message received. We'll get back to you!"}


@app.get("/api/stats")
async def get_stats():
    subscribers = await db.subscribers.count_documents({})
    contacts = await db.contacts.count_documents({})
    return {
        "subscribers": subscribers,
        "contacts": contacts,
        "guides": 5,
        "tools": 7,
        "pages": 16
    }
