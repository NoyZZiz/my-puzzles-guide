import sqlite3
import json
import os

db_path = r'c:\Users\NOY\OneDrive\Documents\GitHub\my-puzzles-guide\my-puzzles-guide\registry.db'

def get_all(table, cursor):
    cursor.execute(f'PRAGMA table_info({table})')
    cols = [col[1] for col in cursor.fetchall()]
    cursor.execute(f'SELECT * FROM {table}')
    return [dict(zip(cols, row)) for row in cursor.fetchall()]

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    data = {
        'registrations': get_all('global_registry', c),
        'claims': get_all('claimed_pokemon', c)
    }
    print(json.dumps(data, indent=2))
    conn.close()
else:
    print(f"Error: {db_path} not found")
