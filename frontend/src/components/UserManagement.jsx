import { useState, useEffect } from 'react';
import { userAPI } from '../api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', contact: '', address: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (error) {
      alert('Failed to load users');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await userAPI.register(formData);
      setFormData({ name: '', contact: '', address: '' });
      loadUsers();
    } catch (error) {
      alert('Failed to register user');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h2>User Registration</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Contact"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Registering...' : 'Register User'}
        </button>
      </form>

      <h3>Registered Users</h3>
      <div style={styles.list}>
        {users.map((user) => (
          <div key={user.id} style={styles.card}>
            <div><strong>{user.name}</strong></div>
            <div>Contact: {user.contact}</div>
            <div>Address: {user.address}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
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
