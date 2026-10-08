import axios from 'axios';
const baseUrl = '/api/blogs';
import useUserStore from '../stores/userStore';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (blogObject) => {
  const token = useUserStore.getState().token;
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, blogObject, config);
  return response.data;
};

const update = async (blogObject, blogId) => {
  const token = useUserStore.getState().token;
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(`${baseUrl}/${blogId}`, blogObject, config);
  return response.data;
};

const deleteBlog = async (blogId) => {
  const token = useUserStore.getState().token;
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${blogId}`, config);
  return response;
};

const addComment = async (blogId, comment) => {
  const commentResponse = await axios.post(
    `${baseUrl}/${blogId}/comments`,
    comment
  );
  return commentResponse;
};

export default { getAll, create, update, deleteBlog, addComment };
