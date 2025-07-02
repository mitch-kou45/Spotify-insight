import React, { useEffect, useState } from "react";
import axios from "axios";

function TopTracks({ refreshTrigger }) {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/top-tracks", {
      withCredentials: true
    })
    .then(res => setTracks(res.data))
    .catch(err => console.error(err));
  }, [refreshTrigger]); // trigger re-fetch on change

  return (
    <div>
      <h2>Top Tracks</h2>
      <table>
        <thead>
          <tr>
            <th>Track</th>
            <th>Artist</th>
            <th>Play Count</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, i) => (
            <tr key={i}>
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
