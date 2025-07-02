import React, { useEffect, useState } from "react";
import axios from "axios";

function CurrentlyPlaying() {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/current-song", {
      withCredentials: true
    })
    .then(res => {
      setSong(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching current song:", err);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Checking what you're listening to...</p>;

  if (!song || song.status === "paused") {
    return <p>Nothing is currently playing.</p>;
  }

  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>Now Playing 🎶</h2>
      <img src={song.image_url} alt="Album art" style={{ width: 200, borderRadius: 10 }} />
      <p><strong>{song.track}</strong> by {song.artist}</p>
      <p><em>{song.album}</em></p>
    </div>
  );
}

export default CurrentlyPlaying;
