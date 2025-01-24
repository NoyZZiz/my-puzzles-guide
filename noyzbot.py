from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import random
import pinecone
from dotenv import load_dotenv
from pinecone import Pinecone
from transformers import AutoTokenizer, AutoModel
import torch

# ✅ Load environment variables
load_dotenv()

# ✅ Initialize Pinecone client
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# ✅ Get Pinecone Index Name
index_name = os.getenv("PINECONE_INDEX_NAME")

# ✅ Connect to the existing Pinecone index
index = pc.Index(index_name)
print(f"✅ Connected to Pinecone index: {index_name}")

# ✅ Enable CORS
app = Flask(__name__)
CORS(app, resources={r"/chat": {"origins": "*"}})  # Allow requests from any domain

# ✅ Load Hugging Face Embedding Model
tokenizer = AutoTokenizer.from_pretrained("BAAI/bge-large-en")
model = AutoModel.from_pretrained("BAAI/bge-large-en")

# ✅ Function to convert user queries into embeddings
def get_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).detach().numpy().tolist()[0]

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
@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("user_input", "").lower()

    # ✅ Handle Greetings
    greetings = ["hi", "hello", "hey"]
    if user_input in greetings:
        return jsonify({"response": random.choice([
            "Hey there! What's up? 😏",
            "Hello, fellow strategist! What’s on your mind? 🔥",
            "Hey, let’s get to business. What do you need? 😉"
        ])})

    # ✅ Handle Specific Questions
    if "lisette" in user_input:
        return jsonify({"response": "Lisette wrote the Talent Memory Guide on this site!"})

    if "talent memory" in user_input:
        return jsonify({"response": "The Talent Memory Guide is written by Lisette. It’s all about maximizing hero potential!"})

    # ✅ Convert user input into an embedding
    query_vector = get_embedding(user_input)

    # ✅ Search Pinecone for the best matching response
    search_results = index.query(vector=query_vector, top_k=1, include_metadata=True)

    # ✅ If a confident match is found, return the stored answer
    if search_results and search_results["matches"] and search_results["matches"][0]["score"] > 0.7:
        best_match = search_results["matches"][0]["metadata"]["answer"]
        return jsonify({"response": best_match})

    # ✅ If no good match is found, return a default message
    return jsonify({"response": "Hmm... I don't have an answer for that yet. Try asking something else!"})





# ✅ Run Flask App
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
