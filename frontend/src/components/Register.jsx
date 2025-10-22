import React from 'react';
import './Register.css';

const Register = () => {
  return (
    <div className="register-container">
      <form className="register-form">
        <h2>Create an account</h2>
        <input type="email" placeholder="Email" />
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Last Name" />
        <input type="password" placeholder="Password" />
        <div className="role-selection">
          <label>I am a:</label>
          <input type="radio" id="listener" name="role" value="listener" defaultChecked />
          <label htmlFor="listener">Listener</label>
          <input type="radio" id="artist" name="role" value="artist" />
          <label htmlFor="artist">Artist</label>
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <button className="google-btn">
        <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="google logo" />
        Continue with Google
      </button>
    </div>
  );
};

export default Register;
