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

# ✅ Predefined Responses
predefined_responses = {
    "how do i use this guide": [
        "Oh, come on! This isn't a puzzle itself. Just explore the sections and get smarter. 😏",
        "Step 1: Open the guide. Step 2: Read it. Step 3: Profit.",
        "You click, you read, you learn. Not that hard, right?",
        "You want me to spoon-feed you too? Just read it! 😆"
    ],
    "can you help me with the game": [
        "Yeah, I can help you with strategies and some general tips. No magic, though. 😏",
        "Sure, I’ll guide you through strategies and insights. You do the actual playing!",
        "I can help with strategies, but if you want me to play for you, that's a bit much. 😆"
    ],
    "what kind of guides do you have": [
        "Most of the guides here are written by the creator, except for the Talent Memory Guide—that was Lisette!",
        "Looking for something specific? Lisette wrote the Talent Memory Guide, but the rest is all from the creator!",
        "The Talent Memory Guide is Lisette’s work, the rest? Straight from the creator’s brain!"
    ],
    "what about the troop calculator": [
        "Why did we create a calculator if you're just going to ask me? 😆",
        "You have a calculator. Use it. Don’t make me do all the work! 😏",
        "Math is hard, I get it. But that’s why we have a calculator, genius!",
        "Oh wow, you want me to do the calculations? What’s next? Should I play the game for you too? 😂"
    ],
    "what is noyzzing": [
        "Noyzzing is both a guide and the creator of this website. Even gods need a guide, don’t they?"
    ],
    "who runs noyzzing": [
        "A god never runs himself, don't you think? Well, apart from that, he is the creator and the guide who made this website."
    ],
    "what does this website offer": [
        "Well-researched guides, strategies, and tips to help players optimize their gameplay."
    ],
    "how can i contact the creator": [
        "You can reach out via email at pranoykrishna944@gmail.com for any questions or feedback."
    ],
    "why did you create this website": [
        "To build a community of strategy gamers, share insights, and help players understand fundamentals in Puzzles and Conquest!"
    ],
    "is this guide updated": [
        "Absolutely! The creator ensures this guide stays fresh with the latest strategies."
    ],
    "is this only noyzzing’s guide": [
        "Nope! This website is a place where most players share their own strategies, not just Noyzzing."
    ]
}

def generate_intro():
    """Returns a random sassy intro message."""
    return random.choice(sassy_intros)

def get_predefined_response(user_input):
    for key in predefined_responses:
        if key in user_input:
            return random.choice(predefined_responses[key])
    return None

# ✅ Fix: Add /intro Route
@app.route("/intro", methods=["GET"])
def intro():
    return jsonify({"response": generate_intro()})

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("user_input", "").lower()

    # ✅ Check predefined responses first
    predefined_response = get_predefined_response(user_input)
    if predefined_response:
        return jsonify({"response": predefined_response})

    # ✅ If not predefined, use NLP model
    bot_response = chatbot(user_input, max_length=50, num_return_sequences=1)[0]['generated_text']
    return jsonify({"response": bot_response})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)
