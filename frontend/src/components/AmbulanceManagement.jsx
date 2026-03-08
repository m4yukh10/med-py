import { useState, useEffect } from 'react';
import { ambulanceAPI, userAPI } from '../api';

export default function AmbulanceManagement() {
  const [ambulances, setAmbulances] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('register');
  const [formData, setFormData] = useState({
    vehicle_name: '',
    vehicle_driver: '',
    driver_contact: '',
    quantity: '',
  });
  const [bookingData, setBookingData] = useState({
    name: '',
    vehicleName: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAmbulances();
    loadUsers();
  }, []);

  async function loadAmbulances() {
    try {
      const data = await ambulanceAPI.getAll();
      setAmbulances(data);
    } catch (error) {
      alert('Failed to load ambulances');
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
      await ambulanceAPI.register({
        ...formData,
        quantity: parseInt(formData.quantity),
      });
      setFormData({ vehicle_name: '', vehicle_driver: '', driver_contact: '', quantity: '' });
      loadAmbulances();
    } catch (error) {
      alert('Failed to register ambulance');
    } finally {
      setLoading(false);
    }
  }

  async function handleBook(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await ambulanceAPI.book(bookingData);
      setBookingData({ name: '', vehicleName: '' });
      loadAmbulances();
      alert('Ambulance booked successfully');
    } catch (error) {
      alert('Failed to book ambulance');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h2>Ambulance Management</h2>
      
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('register')}
          style={activeTab === 'register' ? styles.activeTab : styles.tab}
        >
          Register Ambulance
        </button>
        <button
          onClick={() => setActiveTab('book')}
          style={activeTab === 'book' ? styles.activeTab : styles.tab}
        >
          Book Ambulance
        </button>
        <button
          onClick={() => setActiveTab('view')}
          style={activeTab === 'view' ? styles.activeTab : styles.tab}
        >
          View Ambulances
        </button>
      </div>

      {activeTab === 'register' && (
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Vehicle Name"
            value={formData.vehicle_name}
            onChange={(e) => setFormData({ ...formData, vehicle_name: e.target.value })}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Driver Name"
            value={formData.vehicle_driver}
            onChange={(e) => setFormData({ ...formData, vehicle_driver: e.target.value })}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Driver Contact"
            value={formData.driver_contact}
            onChange={(e) => setFormData({ ...formData, driver_contact: e.target.value })}
            required
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Quantity Available"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Registering...' : 'Register Ambulance'}
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
            value={bookingData.vehicleName}
            onChange={(e) => setBookingData({ ...bookingData, vehicleName: e.target.value })}
            required
            style={styles.input}
          >
            <option value="">Select Ambulance</option>
            {ambulances.filter(a => a.quantity > 0).map((ambulance) => (
              <option key={ambulance.id} value={ambulance.vehicle_name}>
                {ambulance.vehicle_name} (Available: {ambulance.quantity})
              </option>
            ))}
          </select>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Booking...' : 'Book Ambulance'}
          </button>
        </form>
      )}

      {activeTab === 'view' && (
        <div style={styles.list}>
          {ambulances.map((ambulance) => (
            <div key={ambulance.id} style={styles.card}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                {ambulance.vehicle_name}
              </div>
              <div>Driver: {ambulance.vehicle_driver}</div>
              <div>Contact: {ambulance.driver_contact}</div>
              <div>Available: {ambulance.quantity}</div>
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
};
