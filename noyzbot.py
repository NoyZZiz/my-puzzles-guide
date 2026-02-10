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
                 (alias TEXT PRIMARY KEY, identity TEXT, pool TEXT, house TEXT, timestamp TEXT, squad TEXT, character TEXT, castle_name TEXT, castle_level INTEGER, lore TEXT, profile_pic TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS claimed_pokemon
                 (pokemon_id INTEGER PRIMARY KEY, claimed_by TEXT)''')
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
    squad = data.get('squad') # Comma separated IDs
    character = data.get('character')
    castle_name = data.get('castle_name')
    castle_level = data.get('castle_level')
    lore = data.get('lore')
    profile_pic = data.get('profile_pic')
    mascot_id = data.get('mascot_id') # New single pick
    
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    try:
        # Save Registry Data
        c.execute("INSERT OR REPLACE INTO global_registry VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                  (alias, identity, pool, house, time.strftime('%Y-%m-%d %H:%M:%S'), squad, character, castle_name, castle_level, lore, profile_pic, mascot_id))
        
        # Mark IDs as claimed
        if squad:
            ids = squad.split(',')
            for p_id in ids:
                c.execute("INSERT OR IGNORE INTO claimed_pokemon (pokemon_id, claimed_by) VALUES (?, ?)", (int(p_id), alias))
        
        if mascot_id:
            c.execute("INSERT OR IGNORE INTO claimed_pokemon (pokemon_id, claimed_by) VALUES (?, ?)", (int(mascot_id), alias))
        
        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        conn.close()

@app.route('/get_gym_leaders')
def get_gym_leaders():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT alias, squad, character, castle_name, castle_level, lore, profile_pic FROM global_registry WHERE squad IS NOT NULL")
    rows = c.fetchall()
    conn.close()
    leaders = [{"name": r[0], "squad": r[1].split(','), "character": r[2], "castle_name": r[3], "castle_level": r[4], "lore": r[5], "profile_pic": r[6]} for r in rows]
    return jsonify(leaders)

@app.route('/get_available_draft', methods=['POST'])
def get_available_draft():
    # Provide dynamic number of specimens that haven't been claimed
    data = request.get_json()
    all_legends = data.get('pool', []) 
    requested_count = data.get('count', 10) # Default to 10 for Leaders
    
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT pokemon_id FROM claimed_pokemon")
    claimed = {row[0] for row in c.fetchall()}
    conn.close()
    
    available = [p_id for p_id in all_legends if p_id not in claimed]
    
    # Guaranteed composition: 1 Gen1 + (requested_count - 1) random mix
    legendary_ids = [
        144, 145, 146, 150, 151,
        243, 244, 245, 249, 250, 251,
        377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
        480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493,
        494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,
        716, 717, 718, 719, 720, 721,
        772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 807,
        888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898,
        1001, 1002, 1003, 1004, 1007, 1008, 1010,
        658, 448
    ]
    
    avail_legends = [p for p in available if p in legendary_ids]
    avail_gen1 = [p for p in available if p <= 151 and p not in legendary_ids]
    avail_others = [p for p in available if p not in avail_legends and p not in avail_gen1]
    
    random.shuffle(avail_legends)
    random.shuffle(avail_gen1)
    random.shuffle(avail_others)
    
    draft = []
    
    # 1. Guarantee at least 1 Gen 1 Pokémon
    if avail_gen1:
        draft.append(avail_gen1.pop(0))
    
    # 2. Fill remaining slots with 30% legendary chance
    fill_count = requested_count - len(draft)
    for _ in range(fill_count):
        if random.random() < 0.30 and avail_legends:
            draft.append(avail_legends.pop(0))
        elif avail_gen1 and random.random() < 0.5:
            draft.append(avail_gen1.pop(0))
        elif avail_others:
            draft.append(avail_others.pop(0))
        elif avail_legends:
            draft.append(avail_legends.pop(0))
        elif avail_gen1:
            draft.append(avail_gen1.pop(0))
            
    random.shuffle(draft)
    return jsonify(draft[:requested_count])

# --- Profile Pic Upload ---
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload_profile_pic', methods=['POST'])
def upload_profile_pic():
    if 'file' not in request.files:
        return jsonify({"error": "No file"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
    
    # Save with a unique name
    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else 'png'
    alias = request.form.get('alias', 'unknown').replace(' ', '_')
    filename = f"{alias}_profile.{ext}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    return jsonify({"url": f"/uploads/{filename}"})

@app.route('/uploads/<filename>')
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# --- Admin Endpoints (Protected by Secret Key) ---
ADMIN_KEY = 'ROL-OAK-2026'

@app.route('/admin/leaders', methods=['GET'])
def admin_list_leaders():
    key = request.args.get('key')
    if key != ADMIN_KEY:
        return jsonify({"error": "Unauthorized"}), 403
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT alias, castle_name, castle_level, character, squad, profile_pic, timestamp FROM global_registry WHERE squad IS NOT NULL")
    rows = c.fetchall()
    conn.close()
    leaders = [{"alias": r[0], "castle_name": r[1], "castle_level": r[2], "character": r[3], "squad": r[4], "profile_pic": r[5], "timestamp": r[6]} for r in rows]
    return jsonify(leaders)

@app.route('/admin/delete_leader/<alias>', methods=['DELETE'])
def admin_delete_leader(alias):
    key = request.args.get('key')
    if key != ADMIN_KEY:
        return jsonify({"error": "Unauthorized"}), 403
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    # Release their claimed pokémon back to the pool
    c.execute("SELECT squad FROM global_registry WHERE alias = ?", (alias,))
    row = c.fetchone()
    if row and row[0]:
        for pid in row[0].split(','):
            c.execute("DELETE FROM claimed_pokemon WHERE pokemon_id = ?", (int(pid.strip()),))
    c.execute("DELETE FROM global_registry WHERE alias = ?", (alias,))
    conn.commit()
    conn.close()
    return jsonify({"status": "deleted", "alias": alias})

@app.route('/admin/update_profile_pic', methods=['POST'])
def admin_update_profile_pic():
    key = request.args.get('key')
    if key != ADMIN_KEY:
        return jsonify({"error": "Unauthorized"}), 403
    
    data = request.get_json()
    alias = data.get('alias')
    new_pic_url = data.get('profile_pic')
    
    if not alias or not new_pic_url:
        return jsonify({"error": "Missing alias or profile_pic"}), 400
        
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE global_registry SET profile_pic = ? WHERE alias = ?", (new_pic_url, alias))
    conn.commit()
    conn.close()
    
    return jsonify({"status": "updated", "alias": alias})

@app.route('/admin/fix_kiatura', methods=['GET'])
def admin_fix_kiatura():
    key = request.args.get('key')
    if key != ADMIN_KEY:
        return jsonify({"error": "Unauthorized"}), 403
    
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE global_registry SET profile_pic = ? WHERE alias = ?", ("/uploads/Kiatura_profile.webp", "Kiatura"))
    conn.commit()
    conn.close()
    return "✅ Kiatura profile picture has been fixed! Refresh the Hall of Leaders."

@app.route('/admin/clear_all', methods=['DELETE'])
def admin_clear_all():
    key = request.args.get('key')
    if key != ADMIN_KEY:
        return jsonify({"error": "Unauthorized"}), 403
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("DELETE FROM global_registry")
    c.execute("DELETE FROM claimed_pokemon")
    conn.commit()
    conn.close()
    return jsonify({"status": "cleared"})

# --- Run the Flask Development Server ---
if __name__ == '__main__':
    print("🚀 Starting the Flask development server...")
    # Set host to 0.0.0.0 to make it accessible externally
    # Set debug to False for more stable operation
    app.run(host='0.0.0.0', port=5000, debug=False)
