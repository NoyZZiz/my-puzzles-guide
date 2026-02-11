import sqlite3
import os

DB_PATH = 'registry.db'
UPLOAD_FOLDER = 'uploads'

def audit_and_recover():
    if not os.path.exists(DB_PATH):
        print(f"Error: {DB_PATH} not found.")
        return

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    print("--- Starting FINAL AUDIT & RECOVERY (v4.1.1) ---")

    # 1. Get lock receipts
    c.execute("SELECT claimed_by, GROUP_CONCAT(pokemon_id) FROM claimed_pokemon GROUP BY claimed_by")
    claims = c.fetchall()

    recovered_count = 0
    for alias, ids_str in claims:
        ids = ids_str.split(',')
        if len(ids) >= 6:
            # Check if they exist in the new squad_registry
            c.execute("SELECT alias, profile_pic, castle_level FROM squad_registry WHERE alias = ?", (alias,))
            squad_row = c.fetchone()
            
            squad = ",".join(ids[:6])
            
            # If they don't exist OR have recovered placeholders, try to salvage
            if not squad_row or squad_row[1] == "" or squad_row[2] == "N/A" or squad_row[2] == "Recovered Member":
                print(f"AUDIT: Checking {alias} for missing data...")
                
                # Defaults
                identity, char, castle_name, castle_level, lore, profile_pic = "Alliance Member", "Trainer", alias, "N/A", "", ""
                
                # A. Try to salvage from global_registry (if any data remains)
                try:
                    c.execute("SELECT identity, character, castle_name, castle_level, lore, profile_pic FROM global_registry WHERE alias = ?", (alias,))
                    old = c.fetchone()
                    if old:
                        identity = old[0] if old[0] not in ['Aspirant Mascot', 'Recovered Member'] else identity
                        char = old[1] or char
                        castle_name = old[2] or castle_name
                        castle_level = old[3] if old[3] and old[3] != 'N/A' else castle_level
                        lore = old[4] or lore
                        profile_pic = old[5] or profile_pic
                except: pass

                # B. Try to salvage from DISK (Profile Pics)
                # Check for various extensions
                if not profile_pic or profile_pic == "":
                    for ext in ['png', 'jpg', 'jpeg', 'webp']:
                        filename = f"{alias.replace(' ', '_')}_profile.{ext}"
                        if os.path.exists(os.path.join(UPLOAD_FOLDER, filename)):
                            profile_pic = f"/uploads/{filename}"
                            print(f"  FOUND orphan profile pic on disk: {filename}")
                            break

                # Write to the new registry
                if not squad_row:
                    c.execute("""
                        INSERT INTO squad_registry (alias, identity, squad, character, castle_name, castle_level, lore, profile_pic, timestamp) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (alias, identity, squad, char, castle_name, castle_level, lore, profile_pic, "2026-02-11 RECOVERY FIXED"))
                    recovered_count += 1
                else:
                    # Update existing entry with salvaged info
                    c.execute("""
                        UPDATE squad_registry SET 
                            identity = COALESCE(?, identity),
                            character = COALESCE(?, character),
                            castle_level = CASE WHEN castle_level = 'N/A' THEN ? ELSE castle_level END,
                            profile_pic = CASE WHEN profile_pic = '' THEN ? ELSE profile_pic END
                        WHERE alias = ?
                    """, (identity, char, castle_level, profile_pic, alias))
                    print(f"  UPDATED existing squad for {alias} with salvaged metadata.")

    conn.commit()
    conn.close()
    print(f"--- Final Recovery Complete: {recovered_count} squads added/fixed ---")

if __name__ == "__main__":
    audit_and_recover()
