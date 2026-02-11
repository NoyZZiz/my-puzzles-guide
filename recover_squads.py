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
        # We are looking for users who have 6 or more pokemon (Squad + Mascot)
        if len(ids) >= 6:
            # Check if they already exist in the new squad_registry
            c.execute("SELECT alias FROM squad_registry WHERE alias = ?", (alias,))
            if not c.fetchone():
                # They are missing from the Hall! Let's rebuild them.
                # First 6 IDs are likely the squad
                squad = ",".join(ids[:6])
                print(f"RESCUE: Found squad for {alias} in lock-table. Restoring...")
                
                # We'll use a placeholder for identity/character since that was lost, 
                # but they can edit it later. The important part is the POKEMON are back.
                c.execute("""
                    INSERT INTO squad_registry (alias, identity, squad, timestamp) 
                    VALUES (?, ?, ?, ?)
                """, (alias, "Recovered Alliance Member", squad, "2026-02-11 RECOVERY"))
                recovered_count += 1

    conn.commit()
    conn.close()
    print(f"--- Recovery Complete: {recovered_count} squads restored ---")

if __name__ == "__main__":
    recover_data()
