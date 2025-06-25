import React from 'react';

function Login() {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/";
};

  return (
    <div>
      <h2>Login Required</h2>
      <button onClick={handleLogin} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Login with Spotify
      </button>
    </div>
  );
}

export default Login;
