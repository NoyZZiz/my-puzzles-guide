from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import random
import time
import os
import sqlite3

# Initialize the Flask application
app = Flask(__name__, static_folder=os.path.dirname(os.path.abspath(__file__)))

# Enable CORS for all routes
CORS(app)

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'registry.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS global_registry
                 (alias TEXT PRIMARY KEY, identity TEXT, pool TEXT, house TEXT, timestamp TEXT)''')
    conn.commit()
    conn.close()

init_db()

def get_bot_response(user_input):
    """
    Simulates a simple bot response based on predefined keywords.
    """
    time.sleep(0.5)  # Simulate a short processing delay

    # Define a dictionary of more detailed responses
    responses = {
        "hello": random.choice(["Hey! How can I help you?", "Hello there! What Puzzles and Conquest question do you have?", "Greetings! Ready to explore the guide?"]),
        "hi": random.choice(["Hello.", "Hi!", "Hey! What can I assist you with today?"]),
        "hey": random.choice(["Hello!", "Hey there!", "What's up?", "How can I help you today?"]), # Added responses for "hey"
        "greetings": random.choice(["Hi!", "Greetings, fellow strategist!", "Hello! How can I be of service?"]),
        "how are you": random.choice(["I'm functioning optimally, ready to assist!", "Doing well, ready to help you navigate the guide!", "Feeling digital and ready to go!"]),
        "what is your name": "I am NoyzBot, your helpful AI assistant for this guide.",
        "thank you": random.choice(["You're welcome! Glad I could help.", "You're welcome! Is there anything else you need?", "No problem at all! Happy to assist!"]),
        "bye": random.choice(["Goodbye!", "See you later!", "Farewell!", "Until next time!"]),
        "help": "I can assist you with questions about game mechanics, guides, tools, or the alliance. Just ask!",
        "welcome": "Welcome to the Puzzles and Conquest guide by Noyzzing! We're here to help you succeed.",
        "noyzzing": "Noyzzing is the creator of this comprehensive Puzzles and Conquest guide.",
        "talent memory guide": "The Talent Memory Guide was crafted by Lisette. It provides detailed information on hero talents.",
        "guide purpose": "This guide aims to enhance your Puzzles and Conquest experience by providing valuable information and tools.",
        "guide mission": "We're building a strong community focused on strategic growth and collaboration in Puzzles and Conquest.",
        "guide confused": random.choice(["Explore the sections, you'll find your way! 😉 Take your time to discover all the resources.", "Take your time, the knowledge is here. Feel free to ask if you get lost!", "It's all about discovery! What are you looking for specifically?"]),
        "troop calculator": "The Troop Calculator is a tool to help you calculate the resource costs for training different troop types. You can find it in the tools section.",
        "calculate resources": "The Troop Calculator is your go-to tool for estimating the resources needed for troop training.",
        "contact": "You can reach out via email at pranoykrishna944@gmail.com for any inquiries or feedback.",
        # --- Infantry ---
        "infantry barracks": "The Infantry Barracks is where you train your frontline foot soldiers. It becomes available after Chapter 2.",
        "infantry units": "Infantry units excel in close-quarters combat and are effective at holding the line.",
        "infantry stats": "You can find detailed statistics on Infantry troop types in the Barracks menu within the game.",
        "infantry training cost": "The resource costs for training Infantry vary depending on the unit type and level. Use the Troop Calculator for precise estimations.",
        "infantry upgrades": "You can upgrade the Infantry Barracks from levels 1 to 40. New Infantry units unlock as you upgrade your Castle Level.",
        "infantry unlock levels": "Infantry units unlock at specific Castle Levels, from Recruit (CL 1) to Crusade Warmaster (CL 40).",
        "infantry strengths": "Infantry units are strong against Ranged units.",
        "infantry weaknesses": "Infantry units are vulnerable to Cavalry charges.",
        "how do i upgrade infantry barracks": "To upgrade your Infantry Barracks, you need to increase your Castle Level. Upgrading the Barracks unlocks higher-tier Infantry units.",
        "barracks upgrade": "Upgrading your Barracks, including the Infantry, Ranged, and Cavalry Barracks, is tied to your Castle Level.",
        # --- Ranged ---
        "ranged barracks": "The Ranged Barracks is where you train your archers and other long-range units.",
        "ranged troops offensive": "Ranged troops are ideal for attacking fortifications and hunting monsters from a distance.",
        "ranged world map": "Deploy Ranged units on the World Map for strategic engagements and sieges.",
        "ranged upgrades": "Similar to the other Barracks, upgrading the Ranged Barracks is linked to your Castle Level (levels 1-40).",
        "ranged unlock levels": "Ranged units unlock at specific Castle Levels, from Archer (CL 1) to Crusade Deadshot (CL 40).",
        "ranged strengths": "Ranged units are effective against Cavalry units.",
        "ranged weaknesses": "Ranged units can be overwhelmed by Infantry units in close combat.",
        # --- Cavalry ---
        "cavalry barracks": "The Cavalry Barracks is where you train your fast and mobile mounted units.",
        "cavalry units mobility": "Cavalry units are known for their high mobility, allowing them to bypass traps and quickly support Infantry.",
        "cavalry stats": "You can find detailed attributes for Cavalry units by checking the Barracks menu in the game.",
        "cavalry upgrades": "Upgrading the Cavalry Barracks follows the same pattern: levels 1-40, unlocks based on Castle Level.",
        "cavalry unlock levels": "Cavalry units unlock as your Castle Level increases, from Scout (CL 1) to Crusade Overlord (CL 40).",
        "cavalry strengths": "Cavalry units are powerful against Infantry units.",
        "cavalry weaknesses": "Cavalry units are susceptible to Ranged attacks.",
        # --- Siege ---
        "siege troops": "Siege units have limited use in standard battles. They are primarily used for attacking structures.",
        "siege daily quest": "It's often recommended to train a small number of T1 Siege units for completing daily quests.",
        "siege apex matches": "Siege units are rarely seen in competitive play, such as Apex matches.",
        "siege high-tier": "Investing heavily in high-tier Siege units is generally not recommended due to their limited combat effectiveness.",
        "siege train": "In most cases, you'll find it more beneficial to focus on training other troop types for combat.",
        "siege win fights": "Don't rely on Siege units to win fights; they are not designed for direct combat.",
        "siege useless": "While they have their purpose, Siege units are generally not very effective in regular battles.",
        "siege waste resources": "It's often considered a waste of resources to prioritize Siege units over other troop types for combat purposes.",
        # --- General Game Info ---
        "what is puzzles and conquest": "Puzzles and Conquest is a mobile strategy game that combines match-3 puzzle gameplay with kingdom building and strategic warfare.",
        "tell me a tip": random.choice(["Focus on upgrading your resource buildings early to ensure a steady income.",
                                     "Joining an active alliance is crucial for getting help and participating in events.",
                                     "Participate in daily events to earn valuable rewards and speed up your progress.",
                                     "Always scout your enemies before attacking to gain a strategic advantage.",
                                     "Coordinate with your alliance members for stronger attacks and defenses."]),
        "what's new": "Keep an eye on the website for the latest guides, updates, and strategies!",
        "can you help me": "I'll do my best! What Puzzles and Conquest question do you have? I'm here to guide you.",
        "good bot": random.choice(["Thanks!", "Appreciate it!", "Glad I could assist!", "I'm happy to help!"]),
        "bad bot": random.choice(["Oops, sorry about that! I'm still learning to provide the best answers.",
                                "I apologize for the unhelpful response. Can you rephrase your question?",
                                "I'll try to do better next time. Please provide more details about what you're looking for."])
    }

    # Convert user input to lowercase for case-insensitive matching
    user_input_lower = user_input.lower()

    # Check if the user input is in our predefined responses
    if user_input_lower in responses:
        return {"response": responses[user_input_lower]}
    else:
        # If no specific match, provide a generic fallback response
        return {"response": random.choice(["Hmm, that's an interesting question! I'm still processing that.",
                                         "Let me see... I don't have an exact answer for that right now. Perhaps try rewording your query?",
                                         "Could you try asking in a different way? I might understand better.",
                                         "Sorry, my knowledge base on that is limited. I'm always expanding it!",
                                         "I'm not quite sure I understand. Can you provide more details?"])}
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

@app.route('/get_global_assignment/<alias>')
def get_global_assignment(alias):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT * FROM global_registry WHERE alias=?", (alias,))
    row = c.fetchone()
    conn.close()
    if row:
        return jsonify({
            "alias": row[0],
            "identity": row[1],
            "pool": row[2],
            "house": row[3],
            "timestamp": row[4]
        })
    return jsonify(None)

@app.route('/get_all_assigned')
def get_all_assigned():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT identity FROM global_registry")
    rows = c.fetchall()
    conn.close()
    return jsonify([r[0] for r in rows])

@app.route('/save_global_assignment', methods=['POST'])
def save_global_assignment():
    data = request.get_json()
    alias = data.get('alias')
    identity = data.get('identity')
    pool = data.get('pool')
    house = data.get('house')
    
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    try:
        c.execute("INSERT OR REPLACE INTO global_registry VALUES (?, ?, ?, ?, ?)",
                  (alias, identity, pool, house, time.strftime('%Y-%m-%d %H:%M:%S')))
        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        conn.close()

# --- Run the Flask Development Server ---
if __name__ == '__main__':
    print("🚀 Starting the Flask development server...")
    # Set host to 0.0.0.0 to make it accessible externally
    # Set debug to False for more stable operation
    app.run(host='0.0.0.0', port=5000, debug=False)
