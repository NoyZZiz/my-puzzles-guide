from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import random
import time
import os

# Initialize the Flask application
app = Flask(__name__, static_folder=os.path.dirname(os.path.abspath(__file__)))

# Enable CORS for all routes
CORS(app)

# --- Bot Response Logic ---
def get_bot_response(user_input):
    """
    Simulates a simple bot response based on predefined keywords.
    """
    time.sleep(0.5)  # Simulate a short processing delay

    # Define a dictionary of simple responses
    responses = {
        "hello": random.choice(["Hey!", "Hello there!", "Greetings!"]),
        "hi": random.choice(["Hello.", "Hi!", "Hey!"]),
        "greetings": random.choice(["Hi!", "Greetings, fellow strategist!", "Hello!"]),
        "how are you": random.choice(["I'm functioning optimally.", "Doing well, ready to assist!", "Feeling digital and ready to go!"]),
        "what is your name": "I am NoyzBot, your helpful AI assistant for this guide.",
        "thank you": random.choice(["You're welcome!", "No problem at all!", "Happy to help!"]),
        "bye": random.choice(["Goodbye!", "See you later!", "Farewell!", "Until next time!"]),
        "help": "Ask me about game mechanics, guides, tools, or the alliance.",
        "welcome": "Welcome to the Puzzles and Conquest guide by Noyzzing!",
        "noyzzing": "Noyzzing is the creator of this comprehensive guide.",
        "talent memory guide": "The Talent Memory Guide was crafted by Lisette.",
        "guide purpose": "This guide aims to enhance your Puzzles and Conquest experience.",
        "guide mission": "We're building a strong community focused on strategic growth.",
        "guide confused": random.choice(["Explore the sections, you'll find your way! 😉", "Take your time, the knowledge is here.", "It's all about discovery!"]),
        "troop calculator": "Use the Troop Calculator for all your troop cost calculations.",
        "calculate resources": "The Troop Calculator is your go-to for resource estimations.",
        "contact": "Reach out via email at pranoykrishna944@gmail.com for inquiries.",
        "infantry barracks": "Train your frontline foot soldiers here after Chapter 2.",
        "infantry units": "Infantry excel in close-quarters combat.",
        "infantry stats": "Details on troop stats are in the Barracks menu.",
        "infantry training cost": "Resource costs vary by unit type and level.",
        "infantry upgrades": "Upgrade the Barracks (levels 1-40), unlocks depend on Castle Level.",
        "infantry unlock levels": "Recruit (CL 1) to Crusade Warmaster (CL 40).",
        "infantry strengths": "Strong against Ranged.",
        "infantry weaknesses": "Vulnerable to Cavalry charges.",
        "ranged barracks": "Train your archers and other long-range units here.",
        "ranged troops offensive": "Ideal for attacking fortifications and hunting monsters.",
        "ranged world map": "Deploy Ranged units for strategic engagements.",
        "ranged upgrades": "Upgrade the Barracks (levels 1-40), unlocks by Castle Level.",
        "ranged unlock levels": "Archer (CL 1) to Crusade Deadshot (CL 40).",
        "ranged strengths": "Effective against Cavalry.",
        "ranged weaknesses": "Can be overwhelmed by Infantry.",
        "cavalry barracks": "Train your fast and mobile mounted units here.",
        "cavalry units mobility": "High mobility, bypass traps, support Infantry.",
        "cavalry stats": "Check the Barracks for detailed attributes.",
        "cavalry upgrades": "Upgrade the Barracks (levels 1-40), unlocks by Castle Level.",
        "cavalry unlock levels": "Scout (CL 1) to Crusade Overlord (CL 40).",
        "cavalry strengths": "Powerful against Infantry.",
        "cavalry weaknesses": "Susceptible to Ranged attacks.",
        "siege troops": "Siege units have limited battle use.",
        "siege daily quest": "Train a small number of T1 Siege for daily tasks.",
        "siege apex matches": "Siege units are rarely seen in competitive play.",
        "siege high-tier": "Investing heavily in high-tier Siege is not recommended.",
        "siege train": "Consider focusing on other troop types for combat.",
        "siege win fights": "Don't rely on Siege for victory.",
        "siege useless": "Generally, Siege units are not very effective in battles.",
        "siege waste resources": "Prioritize other troop types over Siege for resource investment.",
        "what is puzzles and conquest": "Puzzles and Conquest is a mobile strategy game combining match-3 puzzles with kingdom building and war.",
        "tell me a tip": random.choice(["Focus on upgrading your resource buildings early.", "Join an active alliance for mutual benefits.", "Participate in daily events for rewards.", "Always scout before attacking.", "Coordinate with your alliance members for stronger attacks."]),
        "what's new": "Keep an eye on the website for the latest guides and updates!",
        "can you help me": "I'll do my best! What Puzzles and Conquest question do you have?",
        "good bot": random.choice(["Thanks!", "Appreciate it!", "Glad I could assist!"]),
        "bad bot": random.choice(["Oops, sorry about that!", "I'm still learning!", "I'll try to do better next time."])
    }

    # Convert user input to lowercase for case-insensitive matching
    user_input_lower = user_input.lower()

    # Check if the user input is in our predefined responses
    if user_input_lower in responses:
        return {"response": responses[user_input_lower]}
    else:
        # If no specific match, provide a generic fallback response
        return {"response": random.choice(["Hmm, that's an interesting question!",
                                           "Let me see... I don't have an exact answer for that right now.",
                                           "Could you try asking in a different way?",
                                           "Sorry, my knowledge base on that is limited."])}

# --- Flask Routes ---
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/assets/<path:path>')
def serve_assets(path):
    return send_from_directory('assets', path)

@app.route('/chat', methods=['POST'])
def chat():
    """
    Handles POST requests to the '/chat' endpoint.
    Expects a JSON payload with a 'user_input' key.
    Returns a JSON response with the bot's reply.
    """
    # Get the JSON data from the request
    data = request.get_json()

    # Extract the user's input from the JSON data
    user_input = data.get('user_input')

    # Check if user input was provided
    if not user_input:
        return jsonify({"error": "No user input provided"}), 400  # Return a 400 error if no input

    # Get the bot's response based on the user input
    bot_response = get_bot_response(user_input)

    # Return the bot's response as a JSON object
    return jsonify(bot_response)

# --- Run the Flask Development Server ---
if __name__ == '__main__':
    print("🚀 Starting the Flask development server...")
    # Set host to 0.0.0.0 to make it accessible externally
    # Set debug to False for more stable operation
    app.run(host='0.0.0.0', port=5000, debug=False)
