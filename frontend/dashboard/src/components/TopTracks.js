// src/components/TopTracks.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function TopTracks() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/top-tracks")
      .then(res => setTracks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Top 5 Tracks</h2>
      <table>
        <thead>
          <tr>
            <th>Track</th>
            <th>Artist</th>
            <th>Play Count</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => (
            <tr key={index}>
              <td>{track.name}</td>
              <td>{track.artist}</td>
              <td>{track.play_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopTracks;
