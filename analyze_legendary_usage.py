import sqlite3
import os

db_path = 'c:/Users/NOY/OneDrive/Documents/GitHub/my-puzzles-guide/my-puzzles-guide/registry.db'

def analyze_legendaries():
    if not os.path.exists(db_path):
        print("Database not found.")
        return

    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    # Get total count
    c.execute("SELECT COUNT(*) FROM global_registry")
    total_registrations = c.fetchone()[0]
    
    # Get all squads
    c.execute("SELECT squad FROM global_registry")
    rows = c.fetchall()
    
    legendary_ids = [
        144, 145, 146, 150, 151,
        243, 244, 245, 249, 250, 251,
        377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
        480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493,
        658, 448
    ]
    
    usage_count = {}
    for row in rows:
        squad_str = row[0]
        if squad_str:
            ids = [int(x.strip()) for x in squad_str.split(',') if x.strip().isdigit()]
            for pkm_id in ids:
                if pkm_id in legendary_ids:
                    usage_count[pkm_id] = usage_count.get(pkm_id, 0) + 1
                    
    print(f"Total Registrations: {total_registrations}")
    print(f"Legendaries currently in use: {len(usage_count)} out of {len(legendary_ids)}")
    print(f"Total legendary slots filled: {sum(usage_count.values())}")
    
    conn.close()

if __name__ == "__main__":
    analyze_legendaries()
