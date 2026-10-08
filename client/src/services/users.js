import axios from 'axios';
const baseUrl = '/api/users';

const fetchUsers = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const fetchUserBlogs = async(userId) => {
  const response = await axios.get(`${baseUrl}/${userId}`)
  if(response.status !== 200)
    throw new Error('Error Fetching User Details')
  return response.data;
}

export default { fetchUsers, fetchUserBlogs };
