import sqlite3
import os

DB_PATH = 'registry.db'
if not os.path.exists(DB_PATH):
    print(f"Error: {DB_PATH} not found.")
    exit(1)

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

alias = "Kiatura"
new_pic = "/uploads/Kiatura_profile.webp"

c.execute("UPDATE global_registry SET profile_pic = ? WHERE alias = ?", (new_pic, alias))
if c.rowcount > 0:
    print(f"Successfully updated {alias}'s profile picture to {new_pic}")
else:
    # Try case-insensitive search if direct match fails
    c.execute("UPDATE global_registry SET profile_pic = ? WHERE UPPER(alias) = UPPER(?)", (new_pic, alias))
    if c.rowcount > 0:
        print(f"Successfully updated {alias}'s profile picture (case-insensitive match) to {new_pic}")
    else:
        print(f"Error: Could not find user with alias {alias}")

conn.commit()
conn.close()
