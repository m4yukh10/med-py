import { useState, useEffect } from 'react';
import { doctorAPI } from '../api';

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    dob: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  async function loadDoctors() {
    try {
      const data = await doctorAPI.getAll();
      setDoctors(data);
    } catch (error) {
      alert('Failed to load doctors');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await doctorAPI.register(formData);
      setFormData({ name: '', specialization: '', dob: '', gender: '' });
      loadDoctors();
    } catch (error) {
      alert('Failed to register doctor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h2>Doctor Management</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Doctor Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="date"
          placeholder="Date of Birth"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          required
          style={styles.input}
        />
        <select
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          required
          style={styles.input}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Registering...' : 'Register Doctor'}
        </button>
      </form>

      <h3>Registered Doctors</h3>
      <div style={styles.list}>
        {doctors.map((doctor) => (
          <div key={doctor.id} style={styles.card}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
              {doctor.name}
            </div>
            <div>Specialization: {doctor.specialization}</div>
            <div>DOB: {doctor.dob}</div>
            <div>Gender: {doctor.gender}</div>
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
