import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ChatInterface from './ChatInterface';

const Dashboard = () => {
  const { agent, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');

  const handleLogout = () => {
    logout();
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 0'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    logoutButton: {
      padding: '8px 16px',
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 20px',
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      gap: '32px'
    },
    sidebar: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    },
    tabButton: {
      width: '100%',
      padding: '12px',
      marginBottom: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      backgroundColor: 'white',
      cursor: 'pointer',
      textAlign: 'left'
    },
    activeTab: {
      backgroundColor: '#dbeafe',
      borderColor: '#3b82f6',
      color: '#1e40af'
    },
    quickActions: {
      marginTop: '24px',
      paddingTop: '24px',
      borderTop: '1px solid #e5e7eb'
    },
    quickAction: {
      display: 'block',
      width: '100%',
      padding: '8px',
      marginBottom: '8px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      textAlign: 'left',
      color: '#6b7280'
    },
    profileCard: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      textAlign: 'center'
    },
    profileAvatar: {
      width: '80px',
      height: '80px',
      backgroundColor: '#dbeafe',
      borderRadius: '50%',
      margin: '0 auto 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      color: '#1e40af'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>Brand Metrics</div>
          <div style={styles.userInfo}>
            <span>Welcome, {agent?.name}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <button
            onClick={() => setActiveTab('chat')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'chat' ? styles.activeTab : {})
            }}
          >
            Chat Assistant
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'profile' ? styles.activeTab : {})
            }}
          >
            Profile
          </button>

          {/* Quick Actions */}
          <div style={styles.quickActions}>
            <h3 style={{ marginBottom: '12px', fontSize: '14px' }}>Quick Actions</h3>
            <button
              onClick={() => setActiveTab('chat')}
              style={styles.quickAction}
            >
              • Payroll this week
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              style={styles.quickAction}
            >
              • Orders for John Smith
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              style={styles.quickAction}
            >
              • Payroll this month
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div>
          {activeTab === 'chat' ? (
            <ChatInterface />
          ) : (
            <div style={styles.profileCard}>
              <div style={styles.profileAvatar}>👤</div>
              <h2 style={{ marginBottom: '8px' }}>{agent?.name}</h2>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>{agent?.email}</p>
              
              <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '4px', textAlign: 'left' }}>
                <h3 style={{ marginBottom: '12px' }}>Account Information</h3>
                <p><strong>Agent ID:</strong> {agent?.id}</p>
                <p><strong>Member Since:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span style={{ color: 'green' }}>Active</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
