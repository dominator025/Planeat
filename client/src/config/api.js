const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

export default API_BASE_URL;
