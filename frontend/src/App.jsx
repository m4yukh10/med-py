import { useState } from 'react';
import UserManagement from './components/UserManagement';
import HospitalManagement from './components/HospitalManagement';
import AmbulanceManagement from './components/AmbulanceManagement';
import DoctorManagement from './components/DoctorManagement';
import AIImageAnalysis from './components/AIImageAnalysis';

function App() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>Medical Management System</h1>
      </header>
      
      <nav style={styles.nav}>
        <button
          onClick={() => setActiveTab('users')}
          style={activeTab === 'users' ? styles.activeNavBtn : styles.navBtn}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('hospitals')}
          style={activeTab === 'hospitals' ? styles.activeNavBtn : styles.navBtn}
        >
          Hospitals
        </button>
        <button
          onClick={() => setActiveTab('ambulances')}
          style={activeTab === 'ambulances' ? styles.activeNavBtn : styles.navBtn}
        >
          Ambulances
        </button>
        <button
          onClick={() => setActiveTab('doctors')}
          style={activeTab === 'doctors' ? styles.activeNavBtn : styles.navBtn}
        >
          Doctors
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          style={activeTab === 'ai' ? styles.activeNavBtn : styles.navBtn}
        >
          AI Analysis
        </button>
      </nav>

      <main style={styles.main}>
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'hospitals' && <HospitalManagement />}
        {activeTab === 'ambulances' && <AmbulanceManagement />}
        {activeTab === 'doctors' && <DoctorManagement />}
        {activeTab === 'ai' && <AIImageAnalysis />}
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
  },
  header: {
    background: '#007bff',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontSize: '24px',
  },
  nav: {
    display: 'flex',
    gap: '0',
    background: '#fff',
    borderBottom: '2px solid #ddd',
    padding: '0',
  },
  navBtn: {
    flex: 1,
    padding: '15px',
    background: 'white',
    border: 'none',
    borderRight: '1px solid #ddd',
    fontSize: '14px',
  },
  activeNavBtn: {
    flex: 1,
    padding: '15px',
    background: '#f5f5f5',
    border: 'none',
    borderRight: '1px solid #ddd',
    borderBottom: '3px solid #007bff',
    fontSize: '14px',
    fontWeight: '600',
  },
  main: {
    padding: '20px',
  },
};

export default App;
