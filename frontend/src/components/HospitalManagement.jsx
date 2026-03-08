import { useState, useEffect } from 'react';
import { hospitalAPI, userAPI } from '../api';

export default function HospitalManagement() {
  const [hospitals, setHospitals] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('register');
  const [formData, setFormData] = useState({
    name: '',
    ccuBeds: '',
    icuBeds: '',
    generalWard: '',
  });
  const [bookingData, setBookingData] = useState({
    name: '',
    hospital: '',
    bed_type: 'CCU',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHospitals();
    loadUsers();
  }, []);

  async function loadHospitals() {
    try {
      const data = await hospitalAPI.getAll();
      setHospitals(data);
    } catch (error) {
      alert('Failed to load hospitals');
    }
  }

  async function loadUsers() {
    try {
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (error) {
      alert('Failed to load users');
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await hospitalAPI.register({
        ...formData,
        ccuBeds: parseInt(formData.ccuBeds),
        icuBeds: parseInt(formData.icuBeds),
        generalWard: parseInt(formData.generalWard),
      });
      setFormData({ name: '', ccuBeds: '', icuBeds: '', generalWard: '' });
      loadHospitals();
    } catch (error) {
      alert('Failed to register hospital');
    } finally {
      setLoading(false);
    }
  }

  async function handleBook(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await hospitalAPI.book(bookingData);
      setBookingData({ name: '', hospital: '', bed_type: 'CCU' });
      loadHospitals();
      alert('Hospital booked successfully');
    } catch (error) {
      alert('Failed to book hospital');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h2>Hospital Management</h2>
      
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('register')}
          style={activeTab === 'register' ? styles.activeTab : styles.tab}
        >
          Register Hospital
        </button>
        <button
          onClick={() => setActiveTab('book')}
          style={activeTab === 'book' ? styles.activeTab : styles.tab}
        >
          Book Bed
        </button>
        <button
          onClick={() => setActiveTab('view')}
          style={activeTab === 'view' ? styles.activeTab : styles.tab}
        >
          View Hospitals
        </button>
      </div>

      {activeTab === 'register' && (
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Hospital Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={styles.input}
          />
          <input
            type="number"
            placeholder="CCU Beds"
            value={formData.ccuBeds}
            onChange={(e) => setFormData({ ...formData, ccuBeds: e.target.value })}
            required
            style={styles.input}
          />
          <input
            type="number"
            placeholder="ICU Beds"
            value={formData.icuBeds}
            onChange={(e) => setFormData({ ...formData, icuBeds: e.target.value })}
            required
            style={styles.input}
          />
          <input
            type="number"
            placeholder="General Ward Beds"
            value={formData.generalWard}
            onChange={(e) => setFormData({ ...formData, generalWard: e.target.value })}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Registering...' : 'Register Hospital'}
          </button>
        </form>
      )}

      {activeTab === 'book' && (
        <form onSubmit={handleBook} style={styles.form}>
          <select
            value={bookingData.name}
            onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
            required
            style={styles.input}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
          <select
            value={bookingData.hospital}
            onChange={(e) => setBookingData({ ...bookingData, hospital: e.target.value })}
            required
            style={styles.input}
          >
            <option value="">Select Hospital</option>
            {hospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.name}>
                {hospital.name}
              </option>
            ))}
          </select>
          <select
            value={bookingData.bed_type}
            onChange={(e) => setBookingData({ ...bookingData, bed_type: e.target.value })}
            required
            style={styles.input}
          >
            <option value="CCU">CCU</option>
            <option value="ICU">ICU</option>
            <option value="GENERAL">General Ward</option>
          </select>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Booking...' : 'Book Bed'}
          </button>
        </form>
      )}

      {activeTab === 'view' && (
        <div style={styles.list}>
          {hospitals.map((hospital) => (
            <div key={hospital.id} style={styles.card}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                {hospital.name}
              </div>
              <div style={styles.bedInfo}>
                <span>CCU Beds: {hospital.ccuBeds}</span>
                <span>ICU Beds: {hospital.icuBeds}</span>
                <span>General Ward: {hospital.generalWard}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  tabs: {
    display: 'flex',
    gap: '5px',
    marginBottom: '20px',
  },
  tab: {
    padding: '10px 20px',
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px 4px 0 0',
    cursor: 'pointer',
  },
  activeTab: {
    padding: '10px 20px',
    background: '#007bff',
    color: 'white',
    border: '1px solid #007bff',
    borderRadius: '4px 4px 0 0',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '30px',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  button: {
    padding: '10px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  card: {
    padding: '15px',
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  bedInfo: {
    display: 'flex',
    gap: '15px',
    fontSize: '14px',
  },
};
