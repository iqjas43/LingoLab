const API_BASE = process.env.REACT_APP_API_URL || 'https://lingolab-production.up.railway.app';

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

  const text = await response.text();
  
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    console.error("Backend returned non-JSON:", text);
    data = { message: text || "Server returned an invalid response" };
  }

  return {
    ok: response.ok,
    status: response.status,
    json: async () => data,
    text: async () => text
  };
};