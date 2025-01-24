import os
import random
import pinecone
from dotenv import load_dotenv
from pinecone import Pinecone
from transformers import AutoTokenizer, AutoModel
import torch
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

# ✅ Load environment variables
load_dotenv()

# ✅ Initialize Pinecone client
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# ✅ Get Pinecone Index Name
index_name = os.getenv("PINECONE_INDEX_NAME")

# ✅ Connect to the existing Pinecone index
index = pc.Index(index_name)
print(f"✅ Connected to Pinecone index: {index_name}")

# ✅ Load Hugging Face Embedding Model
tokenizer = AutoTokenizer.from_pretrained("BAAI/bge-large-en")
model = AutoModel.from_pretrained("BAAI/bge-large-en")
intent_model = SentenceTransformer("all-MiniLM-L6-v2")  # ✅ Intent detection model

# ✅ Function to convert user queries into embeddings
def get_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).detach().numpy().tolist()[0]

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

# ✅ Flask App Setup
app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("user_input", "").lower()

    # ✅ If user opens chat, return a random intro
    if user_input == "intro":
        return jsonify({"response": get_random_intro()})

    # ✅ Detect intent
    intent = detect_intent(user_input)
    print(f"🔍 Detected Intent: {intent}")

    # ✅ Convert user input into an embedding
    query_vector = get_embedding(user_input)

    # ✅ Search Pinecone for the best matching response
    search_results = index.query(vector=query_vector, top_k=3, include_metadata=True)

    # ✅ If a match is found, return the best ranked answer
    if search_results and search_results["matches"]:
        best_match = search_results["matches"][0]["metadata"]["answer"]
        return jsonify({"response": best_match})

    # ✅ Custom responses based on intent
    if intent == "calculator":
        return jsonify({"response": "Why did we create a calculator if you're just going to ask me? 🤨"})

    # ✅ If no match is found, return a default message
    return jsonify({"response": "Hmm... I don't have an answer for that yet. Try asking something else!"})

# ✅ Run Flask App
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
