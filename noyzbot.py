import os
import random
import pinecone
from dotenv import load_dotenv
from pinecone import Pinecone
from transformers import AutoTokenizer, AutoModel
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer

# ✅ Load environment variables
load_dotenv()
app = Flask(__name__)
CORS(app)  # ✅ Allow all origins locally for testing

# ✅ Initialize Pinecone client
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# ✅ Get Pinecone Index Name
index_name = os.getenv("PINECONE_INDEX_NAME")

# ✅ Connect to the existing Pinecone index
if index_name not in pc.list_indexes().names():
    print(f"❌ Index '{index_name}' not found. Ensure Pinecone is properly set up.")
else:
    index = pc.Index(index_name)
    print(f"✅ Connected to Pinecone index: {index_name}")

# ✅ Load Hugging Face Embedding Model
tokenizer = AutoTokenizer.from_pretrained("BAAI/bge-large-en")
model = AutoModel.from_pretrained("BAAI/bge-large-en", torch_dtype="auto", device_map="auto")
intent_model = SentenceTransformer("all-MiniLM-L6-v2")  # ✅ Intent detection model

# ✅ Function to convert user queries into embeddings
def get_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    outputs = model(**inputs)
    embedding = outputs.last_hidden_state.mean(dim=1).detach().numpy().tolist()[0]

    # ✅ Debugging Step: Print Embedding Size
    print(f"🔍 Query Embedding Shape: {len(embedding)}")
    print(f"🔍 Query Embedding Values (First 10): {embedding[:10]}")

    return embedding

# ✅ Function to detect intent
def detect_intent(text):
    keywords = {
        "strategy": ["strategy", "troop", "battle", "attack", "defense"],
        "guides": ["guide", "help", "how to", "tips", "advice"],
        "calculator": ["calculate", "troop calculator", "resource calculator"],
    }
    for intent, words in keywords.items():
        if any(word in text.lower() for word in words):
            return intent
    return "general"

# ✅ List of Random Sassy Intros
sassy_intros = [
    "Oh, you again? What do you need now? 😏",
    "Welcome! I’m just a bot training like you. Don’t expect too much. 😉",
    "You want answers? I got 'em. But don’t expect sugarcoating. 🔥",
    "Another day, another question. Let's see if you can impress me. 😎",
    "I don’t do free coaching, but since you’re here… ask away. 🤖",
    "If I don’t know the answer, it’s because your question is bad. 😂"
]

def get_random_intro():
    """Returns a random sassy intro message."""
    return random.choice(sassy_intros)

@app.route("/", methods=["GET"])
def home():
    return "NoyzBot is running locally!"

# ✅ Flask App Setup
@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("user_input", "").lower()
    print(f"📥 Received Message from User: {user_input}")

    # ✅ Step 1: Check Custom Responses First
    custom_responses = {
        "who created this website": "Noyzzing created this platform to help players master Puzzles and Conquest!",
        "who made this guide": "This guide was made by Noyzzing with contributions from Lisette and the community.",
        "what is siege troop": "Siege troops? Really? They are *useless*. You should never train them. 🚨"
    }

    if user_input in custom_responses:
        print(f"🎯 Matched Custom Response: {custom_responses[user_input]}")
        return jsonify({"response": custom_responses[user_input]})

    # ✅ Step 2: Detect Intent
    intent = detect_intent(user_input)
    print(f"🔍 Detected Intent: {intent}")

    # ✅ Step 3: Handle Broad Questions (Ask for Clarification)
    if intent == "general":
        return jsonify({"response": "Hmm... can you be more specific? Are you asking about troops, battles, or guides?"})

    # ✅ Step 4: Convert to Embedding & Query Pinecone
    query_vector = get_embedding(user_input)
    print(f"🔍 Query Embedding Shape: {len(query_vector)}")

    search_results = index.query(vector=query_vector, top_k=1, include_metadata=True)
    print(f"🔍 Search Results: {search_results}")

    if search_results and "matches" in search_results and search_results["matches"]:
        best_match = search_results["matches"][0]
        metadata = best_match["metadata"]
        
        # ✅ Fix: Check if "text" exists, otherwise check for "answer"
        response = metadata.get("text") or metadata.get("answer") or "I couldn't find an answer for that!"
        
        category = metadata.get("category", "general")

        # ✅ Fix: Only roast Siege users if they are asking about Siege
        if category == "siege" and "siege" in user_input.lower():
            print(f"🔥 Roasting Siege Users: {response}")
            return jsonify({"response": response})

        print(f"✅ Returning Response: {response}")
        return jsonify({"response": response})

    # ✅ Step 5: Fallback Response
    print("❌ No match found, returning fallback.")
    return jsonify({"response": "I don't have that answer yet, but I'm learning! Try something else."})
# ✅ Run Flask Locally
if __name__ == "__main__":
    print("🚀 Starting Flask server...")
    app.run(host="127.0.0.1", port=5000, debug=True)  # ✅ Run locally at http://127.0.0.1:5000