import React from 'react';

const Login = ({ onSignupClick }) => {
  return (
    <div className="auth-container">
      <div className="logo-placeholder">
        {/* Placeholder for Logo */}
        <div className="logo-circle"></div>
        <h1 className="app-name">nuvio</h1>
      </div>
      
      <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
        <div className="input-group">
          <label>Login ID</label>
          <input type="text" placeholder="Enter your Login ID" />
        </div>
        
        <div className="input-group">
          <label>Password</label>
          <input type="password" placeholder="Enter your Password" />
        </div>
        
        <button type="submit" className="btn-primary">Login</button>
        
        <div className="auth-links">
          <a href="#" className="forgot-password">Forgot Password?</a>
          <span className="divider">|</span>
          <button type="button" className="btn-link" onClick={onSignupClick}>Signup</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
