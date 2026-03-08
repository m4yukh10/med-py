const API_BASE = '/api';

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  return response.json();
}

export const userAPI = {
  register: (data) => fetchAPI('/adduser', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getAll: () => fetchAPI('/adduser'),
};

export const hospitalAPI = {
  register: (data) => fetchAPI('/hospitalregister', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getAll: () => fetchAPI('/hospitalregister'),
  update: (data) => fetchAPI('/updatehospital', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  book: (data) => fetchAPI('/bookhospitals', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const ambulanceAPI = {
  register: (data) => fetchAPI('/ambulances', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getAll: () => fetchAPI('/ambulances'),
  book: (data) => fetchAPI('/bookambulances', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const doctorAPI = {
  register: (data) => fetchAPI('/doctorsregister', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getAll: () => fetchAPI('/doctors'),
};

export const aiAPI = {
  analyzeImage: async (file) => {
    const formData = new FormData();
    formData.append('my_image', file);
    
    const response = await fetch(`${API_BASE}/ai-upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return response.json();
  },
};
