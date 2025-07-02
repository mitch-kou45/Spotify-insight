from flask import Flask, redirect, request, session, jsonify
from flask_cors import CORS
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import sqlite3
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")

CORS(app, supports_credentials=True, origins=[os.getenv("FRONTEND_URL")])

sp_oauth = SpotifyOAuth(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
    redirect_uri=os.getenv("SPOTIFY_REDIRECT_URI"),
    scope="user-read-playback-state user-read-currently-playing user-read-recently-played user-top-read user-read-private"
)

def get_db_connection():
    conn = sqlite3.connect('db/spotify.db')
    conn.row_factory = sqlite3.Row
    return conn

def get_token():
    token_info = session.get("token_info", None)
    if not token_info:
        return None
    if sp_oauth.is_token_expired(token_info):
        token_info = sp_oauth.refresh_access_token(token_info["refresh_token"])
        session["token_info"] = token_info
    return token_info

@app.route("/")
def login():
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

@app.route("/callback")
def callback():
    code = request.args.get("code")
    token_info = sp_oauth.get_access_token(code)
    session["token_info"] = token_info
    return redirect(os.getenv("FRONTEND_URL"))

@app.route("/recent")
def recent():
    token_info = get_token()
    if not token_info:
        return redirect("/")

    sp = spotipy.Spotify(auth=token_info["access_token"])
    user = sp.current_user()
    user_id = user["id"]
    display_name = user["display_name"]
    country = user["country"]

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT OR IGNORE INTO users (user_id, display_name, country)
        VALUES (?, ?, ?)
    """, (user_id, display_name, country))

    results = sp.current_user_recently_played(limit=20)
    for item in results["items"]:
        track = item["track"]
        played_at = item["played_at"]

        cur.execute("""
            INSERT OR IGNORE INTO tracks (track_id, name, artist, album, duration_ms, popularity)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (track["id"], track["name"], track["artists"][0]["name"], track["album"]["name"],
              track["duration_ms"], track["popularity"]))

        cur.execute("""
            INSERT INTO listening_history (user_id, track_id, played_at)
            VALUES (?, ?, ?)
        """, (user_id, track["id"], played_at))

    conn.commit()
    conn.close()

    return "Recent tracks saved."

@app.route("/api/top-artists")
def top_artists():
    token_info = get_token()
    if not token_info:
        return jsonify({"error": "unauthorized"}), 401

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
    rows = cur.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route("/api/top-tracks")
def top_tracks():
    token_info = get_token()
    if not token_info:
        return jsonify({"error": "unauthorized"}), 401

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
    rows = cur.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route("/api/current-song")
def current_song():
    token_info = get_token()
    if not token_info:
        return jsonify({"error": "unauthorized"}), 401

    sp = spotipy.Spotify(auth=token_info["access_token"])
    current = sp.current_playback()

    if not current or not current.get("is_playing"):
        return jsonify({"status": "paused"})

    item = current["item"]
    return jsonify({
        "status": "playing",
        "track": item["name"],
        "artist": item["artists"][0]["name"],
        "album": item["album"]["name"],
        "image_url": item["album"]["images"][0]["url"]
    })

@app.route("/logout")
def logout():
    session.clear()
    return redirect(os.getenv("FRONTEND_URL"))

@app.route("/session-check")
def session_check():
    return jsonify({
        "has_token": "token_info" in session,
        "token_info": session.get("token_info")
    })

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1")
