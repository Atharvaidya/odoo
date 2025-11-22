import React, { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="app-container">
      <div className="background-glow"></div>

      {showSignup ? (
        <Signup onLoginClick={() => setShowSignup(false)} />
      ) : (
        <Login onSignupClick={() => setShowSignup(true)} />
      )}
    </div>
  );
}

export default App;
