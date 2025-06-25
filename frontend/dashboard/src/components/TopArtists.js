import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TopArtists() {
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/top-artists")
      .then(res => setArtists(res.data))
      .catch(err => setError("Failed to fetch top artists"));
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Top 5 Artists</h2>
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
