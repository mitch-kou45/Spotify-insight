# init_db.py
import sqlite3

conn = sqlite3.connect('db/spotify.db')
with open('db/schema.sql') as f:
    conn.executescript(f.read())
conn.close()

print("Database initialized.")
