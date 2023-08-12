//import { param } from '../../../server/routes/tasks';
import { getUserData } from './creds';

import axios from 'axios';

const api = axios.create({ baseURL: 'http://192.168.0.76:3000' });

export const listProjects = async (page, searchText, sortOrder, status) => {
    try {        
        const response = await api.get('/projects', { params: { page, searchText, sortOrder, status } });
        return response.data;
    } catch (error) {
        console.error('Error listing projects:', error);        
        return [];
    }
};

export const addProject = async (name, description) => {
    try {
        const response = await api.post('/projects', { name, description });
        return response.data;
    } catch (error) {
        console.error('Error adding project:', error);
        throw error;
    }
};

export const updateProjectByID = async (id, data ) => {
    try {        
        const response = await api.put(`/projects/update/${id}`, data);
        return response.data;
    } catch (error) {        
        throw error;
    }
};


export const createTask = async (task) => {
    try {
        const response = await api.post('/tasks', task);
        return response.data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

export const getAvailableTasks = async (projectId, currentTaskId) => {
    try {
        const response = await api.get(`/tasks/available/${projectId}/${currentTaskId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting available tasks:', error);
        throw error;
    }
};

export const updateTask = async (task) => {
    try {
        const response = await api.put(`/tasks/${task._id}`, task);
        return response.data;
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};

export const updateTaskStatus = async (id, status, project) => {
    try {
        const response = await api.put(`/tasks/${id}/status`, { status, project });
        return response.data;
    } catch (error) {
        console.error('Error updating task status:', error);
        throw error;
    }
};

export const getTasksByProject = async (projectId) => {
    try {
        const response = await api.get(`/tasks/project/${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting tasks by project:', error);
        throw error;
    }
};

// Function to get work history by project id
export async function getWorkHistoryByProjectId(page = 0, projectId) {
    try {
        const response = await api.get(`/tasks/work-history/${projectId}?page=${page}`);
        return response.data;
    } catch (error) {
        console.error('Error getting work history by project:', error);
    }
}

// Function to create a prerequisite
export async function createPrerequisite(data) {
    try {
        const response = await api.post('/prerequisites', data);
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            throw new Error(error.response.data.message);
        }

        // Throw a new Error with a 500 status code
        throw new Error('Internal server error');
    }
}

// Function to list prerequisites for a task
export async function listPrerequisites(taskId) {
    try {
        const response = await api.get(`/tasks/${taskId}/prerequisites`);
        return response.data;
    } catch (error) {
        console.error('Error listing prerequisites:', error);
    }
}

// Function to list incomplete prerequisites for a task
export async function listIncompletePrerequisites(taskId) {
    try {
        const response = await api.get(`/tasks/${taskId}/prerequisites/incomplete`);
        return response.data;
    } catch (error) {
        console.error('Error listing incomplete prerequisites:', error);
    }
}

export const deletePrerequisite = async (taskId, prerequisiteTaskId) => {
    try {
        const response = await api.delete(`/prerequisites/${taskId}/${prerequisiteTaskId}`);
    } catch (error) {
        console.error('Error deleting prerequisite:', error);
    }
};


export const getTaskComments = async (taskId) => {
    try {
        const response = await api.get(`/taskComments/${taskId}`);
        return response.data;        
    } catch (error) {
        console.error('Error fetching task comments:', error);
    }
};

export const addTaskComment = async (comment, taskId) => {
    const user = await getUserData();
    try {
        const response = await api.post(`/taskComments`, { task_id: taskId, comment, commented_by: user._id });
    } catch (error) {
        console.error('Error inserting task comment:', error);
    }
};



export const listWorkHours = async (page, taskId) => {
    try {
        const response = await api.get(`/workHours/${taskId}`, { params: { page: page }});
        return response.data;
    } catch (error) {
        console.error('Error fetching work hours:', error);
    }
};



export const getTasksByMember = async (page, searchText) => {
    try {
        const user = await getUserData();
        const response = await api.get(`/tasks/byMember/${user._id}`,  { params: { page, searchText } });
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks by member:', error);
    }
};

export const createWorkedHour = async (workedHour) => {
    try {
        await api.post(`/workHours`, workedHour);
    } catch (error) {
        throw Error('Error creating worked hour');
    }
};


export const calculateWorkedHour = async (taskId) => {
    try {
        const response = await api.get(`/workHours/totalCost/${taskId}`);
        return response.data.totalCost;
    } catch (error) {
        console.error('Error calculating total worked hours cost:', error);
        return 0.00;
    }
};

export const approveWorkHour = async (workHourId) => {
    try {
        const response = await api.patch(`/workHours/approve/${workHourId}`);
    } catch (error) {
        console.error('Error approving work hour:', error);
    }
};

export const disapproveWorkHour = async (workHourId) => {
    try {
        const response = await api.patch(`/workHours/disapprove/${workHourId}`);
    } catch (error) {
        console.error('Error disapproving work hour:', error);
    }
};



export const getProjectProgress = async () => {
    try {
        const response = await api.get('/projects/getProjectProgress');
        return response.data;
    } catch (error) {
        console.error('Error getting project progress:', error);
        return [];
    }
};


export const getInprogressOverdueTasks = async () => {
    try {
        const user = await getUserData();
        const response = await api.get(`/projects/getInprogressOverdueTasks/${user._id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting in-progress and overdue tasks:', error);
        return [];
    }
};


export const getProjectSummary = async () => {
    try {
        const response = await api.get('/projects/getProjectSummary');
        return response.data;
    } catch (error) {
        console.error('Error getting project summary:', error);
        return {};
    }
};


export const getProjectSummaryByMember = async () => {
    try {
        const user = await getUserData();
        const response = await api.get(`/projects/getProjectSummaryByMember/${user._id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting member summary:', error);
        return {};
    }
};


export const getProjectDetails = async (projectId) => {
    try {   
        const response = await api.get(`/projects/getbyid/${projectId}`);
        return response.data;
    } catch (error) {
        console.error(`Error getting project details for ID ${projectId}:`, error);
        return {};
    }
};


export const getTaskById = async (taskId) => {
    try {      
        const response = await api.get(`/tasks/${taskId}`);
        return response.data;
    } catch (error) {
        console.error(`Error getting task details for ID ${taskId}:`, error);
        return {};
    }
};
