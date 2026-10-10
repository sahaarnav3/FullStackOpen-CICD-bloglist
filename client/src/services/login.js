import axios from 'axios';
const loginUrl = '/api/login';

const login = async (credentials) => {
  try {
    const response = await axios.post(loginUrl, credentials);
    return response.data;
  } catch {
    return false;
  }
};

export default { login };
