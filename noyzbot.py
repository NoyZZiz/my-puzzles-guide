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
# ✅ Troop Unlock Levels by Castle Level (Max T14)
troop_tier_mapping = {
    "T1": 1, "T2": 4, "T3": 7, "T4": 10, "T5": 13,
    "T6": 16, "T7": 19, "T8": 22, "T9": 26, "T10": 30,
    "T11": 34, "T12": 38, "T13": 40, "T14": 44
}

# ✅ Function to check troop unlock levels
def get_troop_unlock_level(tier, troop_type):
    """
    Returns the Castle Level required to unlock the specified troop type and tier.
    """
    if tier in troop_tier_mapping:
        return f"{tier} {troop_type.capitalize()} unlocks at *Castle Level {troop_tier_mapping[tier]}*."
    return "That troop tier doesn't exist. The highest available is *T14*."

# ✅ Function to detect troop level questions
def detect_troop_tier_question(user_input):
    """
    Detects if the user is asking about troop tier unlock levels.
    """
    words = user_input.lower().split()
    troop_types = ["infantry", "cavalry", "ranged"]
    for word in words:
        if word.startswith("t") and word[1:].isdigit():  # Detects "T1" to "T14"
            troop_tier = word.upper()
            if troop_tier in troop_tier_mapping:  # Ensures it's within T1-T14
                for troop_type in troop_types:
                    if troop_type in words:
                        return get_troop_unlock_level(troop_tier, troop_type)
    return None

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
    print(f"📥 Received Message from User: {user_input}")  # ✅ Debug Log

    # ✅ Step 1: Detect Intent
    intent = detect_intent(user_input)
    print(f"🔍 Detected Intent: {intent}")  # ✅ Debugging Log

    # ✅ Step 2: If the message is too general, return a sassy intro instead
    if intent == "general" and len(user_input.split()) < 4:  # If it's short & general
        response = get_random_intro()
        print(f"😏 Sassy Intro: {response}")
        return jsonify({"response": response})

    # ✅ Step 2.5: Check for troop tier unlock questions BEFORE querying Pinecone
    troop_unlock_response = detect_troop_tier_question(user_input)
    if troop_unlock_response:
        print(f"🎖 Troop Unlock Response: {troop_unlock_response}")  # ✅ Debugging Log
        return jsonify({"response": troop_unlock_response})  # ✅ Return response instantly

    # ✅ Step 3: Convert user input into an embedding (Proceed to Pinecone)
    query_vector = get_embedding(user_input)
    print(f"🔍 Query Embedding Shape: {len(query_vector)}")
    
    # ✅ Step 4: Search Pinecone for the best matching response
    search_results = index.query(vector=query_vector, top_k=1, include_metadata=True)
    print(f"🔍 Search Results: {search_results}")

    # ✅ Step 5: Process search results
    if search_results and "matches" in search_results and search_results["matches"]:
        best_match = search_results["matches"][0]
        
        # ✅ Handle missing 'text' key properly
        if "text" not in best_match["metadata"]:
            print("❌ Error: No valid text response found in metadata.")
            return jsonify({"response": "Oops! Something went wrong. Try again later."})

        category = best_match["metadata"].get("category", "general")
        response = best_match["metadata"]["text"]

        # ✅ Special Roast Response for Siege Users
        if category == "siege":
            print(f"🔥 Roasting Siege Users: {response}")
            return jsonify({"response": response})

        # ✅ Normal response for other categories
        print(f"✅ Returning Response: {response}")
        return jsonify({"response": response})

    # ✅ Step 6: If no good match found, return a fallback response
    print("❌ No good match found, returning fallback.")
    return jsonify({"response": "Hmm... I don't have an answer for that yet. Try asking something else!"})
# ✅ Run Flask Locally
if __name__ == "__main__":
    print("🚀 Starting Flask server...")
    app.run(host="127.0.0.1", port=5000, debug=True)  # ✅ Run locally at http://127.0.0.1:5000