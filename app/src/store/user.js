import axios from 'axios';

// Assuming your Express server is running on localhost port 3000
const API_URL = 'http://192.168.0.18:3001';

export const createUser = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/api/users`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating user: ", error);
        throw error;
    }
};


export const searchUsers = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/api/users/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error searching users: ", error);
        throw error;
    }
};

export const validateLogin = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/users/validate`, { email, password });
        return response.data;
    } catch (error) {
        console.error('Error validating login:', error);
        return { success: false, data: '', message: 'Something wrong with the app, Please contact the admin.' };
    }
};
