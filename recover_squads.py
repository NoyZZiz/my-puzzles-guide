import sqlite3
import os

# Configuration
DB_PATH = 'registry.db' # Adjust if path is different on server

def recover_data():
    if not os.path.exists(DB_PATH):
        print(f"Error: {DB_PATH} not found.")
        return

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    print("--- Starting Data Recovery ---")

    # 1. Get all claimed pokemon grouped by user
    c.execute("SELECT claimed_by, GROUP_CONCAT(pokemon_id) FROM claimed_pokemon GROUP BY claimed_by")
    claims = c.fetchall()

    recovered_count = 0
    for alias, ids_str in claims:
        ids = ids_str.split(',')
        if len(ids) >= 6:
            # Check if they already exist in the new squad_registry
            c.execute("SELECT alias FROM squad_registry WHERE alias = ?", (alias,))
            if not c.fetchone():
                # Rebuild squad
                squad = ",".join(ids[:6])
                print(f"RESCUE: Found squad for {alias} in lock-table. Salvaging metadata...")
                
                # Try to salvage identity/profile_pic/castle_level from old table
                identity = "Recovered Alliance Member"
                char = "Trainer"
                castle_name = alias
                castle_level = "N/A"
                lore = ""
                profile_pic = ""
                
                try:
                    c.execute("SELECT identity, character, castle_name, castle_level, lore, profile_pic FROM global_registry WHERE alias = ?", (alias,))
                    old_data = c.fetchone()
                    if old_data:
                        # Use old data but override identity if it says 'Aspirant Mascot'
                        identity = old_data[0] if old_data[0] != 'Aspirant Mascot' else "Recovered Alliance Member"
                        char = old_data[1] or char
                        castle_name = old_data[2] or castle_name
                        castle_level = old_data[3] or castle_level
                        lore = old_data[4] or lore
                        profile_pic = old_data[5] or profile_pic
                except:
                    pass # Table might be gone or schema different
                
                c.execute("""
                    INSERT INTO squad_registry (alias, identity, squad, character, castle_name, castle_level, lore, profile_pic, timestamp) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (alias, identity, squad, char, castle_name, castle_level, lore, profile_pic, "2026-02-11 RECOVERY"))
                recovered_count += 1

    conn.commit()
    conn.close()
    print(f"--- Recovery Complete: {recovered_count} squads restored ---")

if __name__ == "__main__":
    recover_data()
