import axios from 'axios';
let api_key = process.env.REACT_APP_API_KEY;

const baseURL =
  'https://api.cloudinary.com/v1_1/photo-sharing-app/image/upload';
let cloudinaryApi = axios.create({
  baseURL: baseURL
});

async function uploadPhoto(filepath) {
  console.log('triggered');
  let resp = await axios.post(
    'https://api.cloudinary.com/v1_1/photo-sharing-app/image/upload',
    {
      file: filepath,
      upload_preset: 'v3ntb0un'
    }
  );
  return resp;
}
// Register
const createUser = async (data) => {
  const resp = await axios.post('/user', data);
  return resp.data;
};
// Login
 const loginUser = async ({ email, password }) => {
  const resp = await api.post('/login', {
    email,
    password
  });
 return resp.data;
 }
 // Edit profile
const editUser = async (id, data) => {
  const resp = await axios.put(`/user/${id}`, data);
  return resp.data;
}
// Create post
const createPost = async (id, data) => {
  const resp = await axios.post(`/user/${id}/posts`, data);
  return resp.data;
};
// Edit/Change post
const editPost = async (id, data) => {
  const resp = await axios.put(`/user/${id}/posts`, data);
  return resp.data
}
// Delete post
export const deletePost = async (id) => {
  const resp = await api.delete(`/user/${id}/posts`);
  return resp.data;
}
// Get all public posts once logged in
const getAllPosts = async () => {
  const resp = await axios.get('/login/publicposts');
  return resp.data;
};
// Get users own post on profile page
const getUserPosts = async id => {
  const resp = await axios.get(`/user/${id}/posts`);
  return resp.data;
};

export { 
  uploadPhoto, 
  createUser, 
  loginUser,
  editUser, 
  createPost, 
  editPost,
  deletePost,
  getAllPosts,
  getUserPosts

 }
