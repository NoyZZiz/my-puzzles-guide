import sqlite3

db_path = 'c:/Users/NOY/OneDrive/Documents/GitHub/my-puzzles-guide/my-puzzles-guide/registry.db'

def clear_aliases(aliases):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    for alias in aliases:
        # Delete exact match
        c.execute("DELETE FROM global_registry WHERE alias = ?", (alias,))
        # Also try case-insensitive or similar spelling just in case
        c.execute("DELETE FROM global_registry WHERE alias LIKE ?", (alias,))
    conn.commit()
    conn.close()
    print(f"Cleared aliases: {', '.join(aliases)}")

if __name__ == "__main__":
    aliases_to_clear = ["I'm noot", "noothless", "Noothless", "testing"]
    clear_aliases(aliases_to_clear)
