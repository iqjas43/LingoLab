const API_BASE = process.env.REACT_APP_API_URL || 'https://lingolab-production-url.up.railway.app'; // (tera jo bhi Railway URL hai)

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  return response;
};