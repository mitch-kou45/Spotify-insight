import React, { useEffect, useState } from "react";
import axios from "axios";

function TopArtists({ refreshTrigger }) {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/top-artists", {
      withCredentials: true
    })
    .then(res => setArtists(res.data))
    .catch(err => console.error(err));
  }, [refreshTrigger]); // runs whenever refreshTrigger changes

  return (
    <div>
      <h2>Top Artists</h2>
      <table>
        <thead>
          <tr>
            <th>Artist</th>
            <th>Play Count</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist, i) => (
            <tr key={i}>
              <td>{artist.artist}</td>
              <td>{artist.play_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopArtists;
