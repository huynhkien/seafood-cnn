import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/', 
});

// Hàm gửi thông điệp
export const sendMessage = async (message) => {
  try {
    const response = await instance.post('chat', { message: message });
    return response.data; 
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    throw error; 
  }
};
export const identify = async (image) => {
  try {
    const formData = new FormData();
    formData.append('file', image);

    const response = await instance.post('image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Error sending image:', error.response?.data || error.message);
    throw error; 
  }
};
