import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/login/register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the backend API to insert data into the Account table
      const response = await axios.post(
        "http://localhost:5000/api/register",
        formData
      );
      console.log(response.data);

      // Redirect to login after successful registration
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register. Please try again.");
    }
  };

  return (
    <div className="register-body">
      <div className="register-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Gender:</label>
          <div className="radio-container">
            <input
              type="radio"
              id="male"
              name="gender"
              value="0"
              checked={formData.gender === "0"}
              onChange={handleChange}
              required
            />
            <label htmlFor="male">Male</label>
            <input
              type="radio"
              id="female"
              name="gender"
              value="1"
              checked={formData.gender === "1"}
              onChange={handleChange}
              required
            />
            <label htmlFor="female">Female</label>
          </div>

          <label htmlFor="dob">Date Of Birth:</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />

          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="address">Address:</label>
          <input
            type="address"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <label>Role:</label>
          <div className="radio-container">
            <input
              type="radio"
              id="carowner"
              name="role"
              value="1"
              checked={formData.role === "1"}
              onChange={handleChange}
              required
            />
            <label htmlFor="carowner">Car Owner</label>
            <input
              type="radio"
              id="customer"
              name="role"
              value="2"
              checked={formData.role === "2"}
              onChange={handleChange}
              required
            />
            <label htmlFor="customer">Customer</label>
          </div>
          <div className="buttons">
            <button type="submit" className="confirm">
              Confirm
            </button>
            <button type="button" className="cancel">
              <Link to="/login">Cancel</Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
