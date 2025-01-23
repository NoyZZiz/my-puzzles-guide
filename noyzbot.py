from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # ✅ Allows API requests from external sources

chatbot = pipeline("text-generation", model="microsoft/DialoGPT-medium")


# List of random sassy intros
sassy_intros = [
    "Oh, look who needs my wisdom! Go ahead, impress me. 😏",
    "Finally, someone worthy of my intelligence. What do you need? 😎",
    "You again? Let’s see if you ask something smart this time. 🔥",
    "Ah, another question. I suppose I can spare some wisdom. 😏",
    "Welcome to the sassiest AI in town. Speak wisely! 😆"
]

def generate_intro():
    """Returns a random sassy intro message."""
    return random.choice(sassy_intros)

@app.route("/chat", methods=["POST"])
def chat():
    """Handles incoming chat messages and returns a response."""
    user_input = request.json.get("user_input", "")
    bot_response = chatbot(user_input, max_length=50, num_return_sequences=1)[0]['generated_text']
    return jsonify({"response": bot_response})

    if not user_input:
        return jsonify({"response": "Speak up! I don’t have time for silence. 😏"}), 400

    # Generate a response using the AI model
    response = chatbot(user_input, max_length=50, do_sample=True)
    return jsonify({"response": response[0]['generated_text']})

@app.route("/intro", methods=["GET"])
def intro():
    """Returns a random sassy intro message."""
    return jsonify({"response": generate_intro()})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)

