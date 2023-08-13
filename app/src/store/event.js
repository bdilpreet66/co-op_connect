import axios from 'axios';

// Assuming your Express server is running on localhost port 3000
const API_URL = 'http://192.168.0.18:3001';


export const listEvents = async (cur_page = 1, searchText = '') => {
    try {
        // Set up the query parameters for pagination and searching
        const params = {
            page: cur_page,
        };
        if (searchText) {
            params.search = searchText;
        }

        // Fetch the events
        const response = await axios.get(`${API_URL}/api/events`, { params });

        // Return the fetched data
        return response.data;

    } catch (error) {
        console.error("Error fetching events: ", error);
        throw error;
    }
};