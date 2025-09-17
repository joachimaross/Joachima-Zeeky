import React, { useState } from 'react';
import SignIn from './components/SignIn';

function App() {
  const [user, setUser] = useState(null);

  const handleSignIn = (userData) => {
    setUser(userData);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  if (!user) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #eee'
      }}>
        <h1 style={{ color: '#333', margin: 0 }}>Welcome to Joachima Zeeky</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#666' }}>Hello, {user.name}!</span>
          <button
            onClick={handleSignOut}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </header>
      
      <main>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '2rem', 
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#495057', marginTop: 0 }}>Dashboard</h2>
          <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
            You have successfully signed in to Joachima Zeeky! This is a placeholder dashboard 
            that demonstrates the authentication flow. You can now add your application features here.
          </p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1rem' 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#495057', marginTop: 0 }}>Feature 1</h3>
            <p style={{ color: '#6c757d' }}>Add your first feature here.</p>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#495057', marginTop: 0 }}>Feature 2</h3>
            <p style={{ color: '#6c757d' }}>Add your second feature here.</p>
          </div>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#495057', marginTop: 0 }}>Feature 3</h3>
            <p style={{ color: '#6c757d' }}>Add your third feature here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
