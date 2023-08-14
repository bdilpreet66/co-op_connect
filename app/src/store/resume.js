import axios from 'axios';

// Assuming your Express server is running on localhost port 3000
const API_URL = 'http://192.168.0.18:3001';

export const saveResume = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/api/resume`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating user: ", error);
        throw error;
    }
};


export const getResume = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/api/resume/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error searching users: ", error);
        throw error;
    }
};