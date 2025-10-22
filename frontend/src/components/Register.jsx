import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    role: 'listener',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        email: formData.email,
        password: formData.password,
        fullname: {
          firstname: formData.firstname,
          lastname: formData.lastname,
        },
        role: formData.role,
      });
      if (response.status === 201) {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create an account</h2>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} />
        <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        <div className="role-selection">
          <label>I am a:</label>
          <input type="radio" id="listener" name="role" value="listener" checked={formData.role === 'listener'} onChange={handleChange} />
          <label htmlFor="listener">Listener</label>
          <input type="radio" id="artist" name="role" value="artist" checked={formData.role === 'artist'} onChange={handleChange} />
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
