import sqlite3
import os

db_path = 'c:/Users/NOY/OneDrive/Documents/GitHub/my-puzzles-guide/my-puzzles-guide/registry.db'

def check_aliases(aliases):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    results = {}
    for alias in aliases:
        c.execute("SELECT * FROM global_registry WHERE alias = ?", (alias,))
        row = c.fetchone()
        if row:
            results[alias] = row
        else:
            # Try case-insensitive
            c.execute("SELECT * FROM global_registry WHERE alias LIKE ?", (alias,))
            rows = c.fetchall()
            if rows:
                results[alias] = rows
            else:
                results[alias] = None
    conn.close()
    return results

if __name__ == "__main__":
    aliases_to_check = ['I\'m noot', 'noot', 'noothless', 'Noothless', 'testing']
    data = check_aliases(aliases_to_check)
    for alias, result in data.items():
        print(f"{alias}: {result}")
