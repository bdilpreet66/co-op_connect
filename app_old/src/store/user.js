import axios from 'axios';

// Assuming your Express server is running on localhost port 3000
const API_URL = 'http://192.168.0.76:3000';

export const createUser = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/users`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating user: ", error);
        throw error;
    }
};

export const updateHours = async (user) => {
    try {
        const response = await axios.put(`${API_URL}/users/${user.email}/hours`, { 
            first_name: user.first_name,
            last_name: user.last_name,
            job_title: user.job_title,
            hourly_rate: parseFloat(user.hourly_rate)
        });
        return response.data;
    } catch (error) {
        console.error("Error updating user: ", error);
        throw error;
    }
};

export const updatePassword = async (email, password) => {
    try {
        const response = await axios.put(`${API_URL}/users/${email}/password`, { password });
        return response.data;
    } catch (error) {
        console.error("Error updating user: ", error);
        throw error;
    }
};

export const deleteUser = async (email) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${email}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const listUsers = async (page, query) => {
    try {
        const response = await axios.get(`${API_URL}/users`, {
            params: { page, query }, // Include the query parameter in the request
        });
        return response.data;
    } catch (error) {
        console.error('Error listing users:', error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/list`);
        return response.data;
    } catch (error) {
        console.error('Error listing users:', error);
        throw error;
    }
};


export const searchUsers = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/users/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error searching users: ", error);
        throw error;
    }
};

export const validateLogin = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/users/validate`, { email, password });
        return response.data;
    } catch (error) {
        console.error('Error validating login:', error);
        return { success: false, data: '', message: 'Something wrong with the app, Please contact the admin.' };
    }
};
