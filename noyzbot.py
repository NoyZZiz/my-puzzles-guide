from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import random  

app = Flask(__name__)
CORS(app)  

chatbot = pipeline("text-generation", model="microsoft/DialoGPT-medium")

# ✅ List of Random Sassy Intros
sassy_intros = [
    "Oh, you again? What do you need now? 😏",
    "Welcome! I’m just a bot training like you. Don’t expect too much. 😉",
    "You want answers? I got 'em. But don’t expect sugarcoating. 🔥",
    "Another day, another question. Let's see if you can impress me. 😎",
    "I don’t do free coaching, but since you’re here… ask away. 🤖",
    "If I don’t know the answer, it’s because your question is bad. 😂"
]

def generate_intro():
    """Returns a random sassy intro message."""
    return random.choice(sassy_intros)

# ✅ Fix: Add /intro Route
@app.route("/intro", methods=["GET"])
def intro():
    return jsonify({"response": generate_intro()})

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("user_input", "")

    if user_input.lower() == "intro":
        return jsonify({"response": generate_intro()})

    bot_response = chatbot(user_input, max_length=50, num_return_sequences=1)[0]['generated_text']
    return jsonify({"response": bot_response})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)
