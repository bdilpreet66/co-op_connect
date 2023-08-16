import axios from 'axios';
import { getUserData } from "./creds"

// Assuming your Express server is running on localhost port 3000
const API_URL = 'http://192.168.0.70:3001';


export const listJobs = async (cur_page = 1, searchText = '' , user) => {
    try {
        // Set up the query parameters for pagination and searching
        const user = await getUserData();

        const params = {
            page: cur_page,
            user: user._id
        };
        if (searchText) {
            params.search = searchText;
        }

        // Fetch the events
        const response = await axios.get(`${API_URL}/api/jobs`, { params });

        // Return the fetched data
        return response.data;

    } catch (error) {
        console.error("Error fetching events: ", error);
        throw error;
    }
};

export const applyForJob = async (jobId) => {
    try {
        const user = await getUserData();

        const response = await axios.post(`${API_URL}/api/apply`, {
            jobId: jobId,
            userId: user._id
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error applying for job:");
    }
};

export const getApplicationStatus = async (jobId) => {
    try {
        const user = await getUserData();

        const response = await axios.get(`${API_URL}/api/status/${jobId}/${user._id}`);
        return response.data; // Assuming the backend returns an object with a "status" key.
    } catch (error) {
        console.error("Error fetching application status:");
    }
};
