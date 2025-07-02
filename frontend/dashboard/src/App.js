import React, { useEffect, useState } from "react";
import './App.css';
import axios from "axios";
import Login from "./components/Login";
import TopArtists from "./components/TopArtists";
import TopTracks from "./components/TopTracks";
import CurrentlyPlaying from "./components/CurrentlyPlaying";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/top-artists", {
      withCredentials: true
    })
    .then(() => setIsLoggedIn(true))
    .catch(err => {
      if (err.response?.status === 401) {
        setIsLoggedIn(false);
      }
    });
  }, []);

  // Manual refresh function
  const handleRefresh = () => {
    axios.get("http://127.0.0.1:5000/recent", {
      withCredentials: true
    })
    .then(() => {
      setRefreshKey(prev => prev + 1); // trigger component updates
      console.log(" Dashboard refreshed");
    })
    .catch(err => {
      console.error("Refresh failed:", err);
    });
  };

  if (isLoggedIn === null) return <p>Loading...</p>;
  if (!isLoggedIn) return <Login />;

  return (
    <div className="App">
      <h1>Spotify Dashboard</h1>
      <CurrentlyPlaying />
      <button onClick={handleRefresh} style={{ marginBottom: "20px", padding: "10px 15px", fontSize: "16px" }}>
         Refresh Dashboard
      </button>
      <TopArtists refreshTrigger={refreshKey} />
      <TopTracks refreshTrigger={refreshKey} />
    </div>
  );
}

export default App;
