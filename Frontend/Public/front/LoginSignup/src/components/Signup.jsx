import React from 'react';

const Signup = ({ onLoginClick }) => {
    return (
        <div className="auth-container signup-mode">
            <div className="logo-placeholder">
                <div className="logo-circle"></div>
                <h1 className="app-name">nuvio</h1>
            </div>

            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                    <label>Login ID</label>
                    <input type="text" placeholder="Choose a Login ID" />
                </div>

                <div className="input-group">
                    <label>Email ID</label>
                    <input type="email" placeholder="Enter your Email" />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input type="password" placeholder="Create a Password" />
                </div>

                <div className="input-group">
                    <label>Re-enter Password</label>
                    <input type="password" placeholder="Confirm Password" />
                </div>

                <button type="submit" className="btn-primary">Signup</button>

                <div className="auth-links">
                    <button type="button" className="btn-link" onClick={onLoginClick}>Already have an account? Login</button>
                </div>
            </form>
        </div>
    );
};

export default Signup;
