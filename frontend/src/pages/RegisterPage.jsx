import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token); // Save token in local storage
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-page" style={styles.registerPage}>
      <Header />
      <section className="hero-section" style={styles.heroSection}>
        <main className="register-container" style={styles.registerContainer}>
          <h2 style={styles.registerTitle}>Register</h2>
          {error && <p style={styles.errorMessage}>{error}</p>}
          <form className="register-form" onSubmit={handleRegister} style={styles.registerForm}>
            <div className="form-group" style={styles.formGroup}>
              <label style={styles.label}>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div className="form-group" style={styles.formGroup}>
              <label style={styles.label}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div className="form-group" style={styles.formGroup}>
              <label style={styles.label}>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.registerButton}>
              Register
            </button>
          </form>
          <p style={styles.loginText}>
            Already have an account? <a href="/login" style={styles.loginLink}>Login here</a>.
          </p>
        </main>
      </section>
      <Footer />
    </div>
  );
};

const styles = {
  registerPage: {
    backgroundColor: "#121212", // Dark background
    color: "#FFFFFF", // White text
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Roboto', sans-serif", // Modern font
  },
  heroSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: "40px 20px",
    background: "linear-gradient(135deg, #1E1E1E, #121212)", // Dark gradient
  },
  registerContainer: {
    backgroundColor: "#1E1E1E", // Dark gray
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
  },
  registerTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#4ECDC4", // Teal
  },
  errorMessage: {
    color: "#FF5252", // Red
    marginBottom: "20px",
  },
  registerForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#FFFFFF", // White
  },
  input: {
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #444",
    backgroundColor: "#2A2A2A", // Slightly lighter gray
    color: "#FFFFFF", // White
    fontSize: "16px",
    transition: "border-color 0.3s ease",
    outline: "none", // Remove default outline
  },
  inputFocus: {
    borderColor: "#4ECDC4", // Teal border on focus
  },
  registerButton: {
    padding: "12px",
    backgroundColor: "#4ECDC4", // Teal
    color: "#121212", // Dark background
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s ease, transform 0.3s ease", // Add hover effect
  },
  registerButtonHover: {
    backgroundColor: "#3BB4A9", // Darker teal on hover
    transform: "scale(1.05)", // Slightly enlarge on hover
  },
  loginText: {
    marginTop: "20px",
    color: "#FFFFFF", // White
  },
  loginLink: {
    color: "#4ECDC4", // Teal
    textDecoration: "none",
    fontWeight: "bold",
    borderBottom: "2px solid #4ECDC4", // Teal underline
    transition: "color 0.3s ease, border-color 0.3s ease", // Add hover effect
  },
  loginLinkHover: {
    color: "#3BB4A9", // Darker teal on hover
    borderColor: "#3BB4A9", // Darker teal underline on hover
  },
};

export default RegisterPage;