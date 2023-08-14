import axios from 'axios';

// Assuming your Express server is running on localhost port 3000
const API_URL = 'http://192.168.0.76:3001';


export const listCompanies = async (cur_page = 1, searchText = '') => {
    try {
        // Set up the query parameters for pagination and searching
        const params = {
            page: cur_page,
        };
        if (searchText) {
            params.search = searchText;
        }

        // Fetch the companies
        const response = await axios.get(`${API_URL}/api/companies`, { params });

        // Return the fetched data
        return response.data;

    } catch (error) {
        console.error("Error fetching companies: ", error);
        throw error;
    }
};

export const getCompany = async (id) => {
    try {
        // Set up the query parameters for pagination and searching
        const params = {
            id: id,
        };

        // Fetch the companies
        const response = await axios.get(`${API_URL}/api/company`, { params });

        // Return the fetched data
        return response.data;

    } catch (error) {
        console.error("Error fetching companies: ", error);
        throw error;
    }
}

export const addComment = async (companyId, comment, comment_by) => {
    try {
        const response = await axios.post(`${API_URL}/api/company/comment`, {
            companyId,
            comment,
            comment_by
        });
        return response.data;
    } catch (error) {
        console.error("Error adding comment: ", error);
        throw error;
    }
};

export const getAllComments = async (companyId) => {
    try {
        const response = await axios.get(`${API_URL}/api/company/${companyId}/comments`);        
        return response.data;
    } catch (error) {
        console.error("Error fetching company comments: ", error);
        throw error;
    }
}

export const getAllMessages = async (company, user) => {
    try {
        const response = await axios.get(`${API_URL}/api/chat/${company}/${user}`);        
        return response.data;
    } catch (error) {
        console.error("Error fetching company comments: ", error);
        throw error;
    }
}
