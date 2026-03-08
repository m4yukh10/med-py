import { useState } from 'react';
import { aiAPI } from '../api';

export default function AIImageAnalysis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    try {
      const data = await aiAPI.analyzeImage(selectedFile);
      setResult(data);
    } catch (error) {
      alert('Failed to analyze image');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <h2>AI Image Analysis</h2>
      <p style={styles.description}>Upload a medical image for AI-powered analysis</p>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          style={styles.fileInput}
        />
        <button type="submit" disabled={loading || !selectedFile} style={styles.button}>
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </form>

      {result && (
        <div style={styles.result}>
          <h3>Analysis Result</h3>
          <img src={result.image_url} alt="Uploaded" style={styles.image} />
          <div style={styles.explanation}>
            <strong>Analysis:</strong>
            <p>{result.explanation}</p>
          </div>
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
  description: {
    color: '#666',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '30px',
  },
  fileInput: {
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
  result: {
    background: 'white',
    padding: '20px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '4px',
    marginTop: '10px',
    marginBottom: '15px',
  },
  explanation: {
    lineHeight: '1.6',
  },
};
