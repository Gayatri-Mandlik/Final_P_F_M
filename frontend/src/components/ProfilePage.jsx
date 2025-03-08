import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Header'; 
import Footer from '../components/Footer'; 

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || {
      username: 'Avenger001',
      email: 'avenger@shield.com',
    };
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user');  
    navigate('/login'); 
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>🦸‍♂️ Hero Profile</h1>
          {user ? (
            <>
              <p style={styles.info}><strong>Codename:</strong> {user.username}</p>
              <p style={styles.info}><strong>SHIELD ID:</strong> {user.email}</p>
              <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </>
          ) : (
            <p>Loading Avengers Database...</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

// Avengers-Themed Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0A192F',  // Dark blue (Captain America)
    padding: '20px',
  },
  card: {
    background: '#1C1C1C', // Dark gray (Stealth Suit)
    padding: '2rem',
    borderRadius: '15px',
    boxShadow: '0px 5px 15px rgba(255, 215, 0, 0.5)', // Gold glow
    textAlign: 'center',
    width: '400px',
    maxWidth: '100%',
  },
  title: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#FFD700',  // Gold (Iron Man)
    marginBottom: '1rem',
  },
  info: {
    fontSize: '18px',
    color: '#FFFFFF', // White text for contrast
    marginBottom: '10px',
  },
  logoutButton: {
    backgroundColor: '#D32F2F', // Red (Iron Man)
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '15px',
    transition: '0.3s',
  },
  logoutButtonHover: {
    backgroundColor: '#B71C1C', // Darker red on hover
  },
};

export default Profile;
