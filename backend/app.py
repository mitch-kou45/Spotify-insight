from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)  

def get_db_connection():
    conn = sqlite3.connect('db/spotify.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/api/top-artists")
def api_top_artists():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT artist, COUNT(*) as play_count
        FROM tracks
        JOIN listening_history ON tracks.track_id = listening_history.track_id
        GROUP BY artist
        ORDER BY play_count DESC
        LIMIT 5
    """)
    top_artists = [dict(row) for row in cur.fetchall()]
    conn.close()
    return jsonify(top_artists)

@app.route("/api/top-tracks")
def api_top_tracks():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT name, artist, COUNT(*) as play_count
        FROM tracks
        JOIN listening_history ON tracks.track_id = listening_history.track_id
        GROUP BY name, artist
        ORDER BY play_count DESC
        LIMIT 5
    """)
    top_tracks = [dict(row) for row in cur.fetchall()]
    conn.close()
    return jsonify(top_tracks)

if __name__ == "__main__":
    app.run(debug=True)
