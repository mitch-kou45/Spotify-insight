import React from 'react';
import './App.css';
import TopArtists from './components/TopArtists';
import TopTracks from './components/TopTracks';

function App() {
  return (
    <div className="App">
      <h1>Spotify Dashboard</h1>
      <TopArtists />
      <TopTracks />
    </div>
  );
}

export default App;
