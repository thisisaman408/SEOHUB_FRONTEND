import axios from 'axios';
import {
	type LoginCredentials,
	type SignupData,
	type Tool,
	type User,
} from './types';


const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export const login = async (credentials: LoginCredentials) => {
	const { data } = await api.post('/auth/login', credentials);
	if (data.token) {
		localStorage.setItem('token', data.token);
	}
	return data;
};

export const adminLogin = async (credentials: LoginCredentials) => {
	const { data } = await api.post('/auth/admin/login', credentials);
	if (data.token) {
		localStorage.setItem('token', data.token);
	}
	return data;
};

export const signup = async (userData: SignupData) => {
	const { data } = await api.post('/auth/signup', userData);
	if (data.token) {
		localStorage.setItem('token', data.token);
	}
	return data;
};

export const logout = () => {
	localStorage.removeItem('token');
	window.location.reload();
};


export const getAllTools = async (): Promise<Tool[]> => {
	const { data } = await api.get('/tools');
	return data;
};

export const getFeaturedTools = async (): Promise<Tool[]> => {
	const { data } = await api.get('/tools/featured');
	return data;
};

export const submitTool = async (formData: FormData): Promise<Tool> => {
	const { data } = await api.post('/tools', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
	return data;
};


export const getPendingTools = async (): Promise<Tool[]> => {
	const { data } = await api.get('/admin/tools/pending');
	return data;
};

export const updateToolStatus = async (
	id: string,
	status: 'approved' | 'rejected',
	isFeatured: boolean
): Promise<Tool> => {
	const { data } = await api.put(`/admin/tools/${id}`, { status, isFeatured });
	return data;
};

export const deleteTool = async (id: string) => {
	const { data } = await api.delete(`/admin/tools/${id}`);
	return data;
};

export const getMyTools = async (): Promise<Tool[]> => {
	const { data } = await api.get('/tools/my-tools');
	return data;
};

export const getAdminStats = async () => {
    const { data } = await api.get('/admin/stats');
    return data;
};

export const getApprovedTools = async (): Promise<Tool[]> => {
    const { data } = await api.get('/admin/tools/approved');
    return data;
};

export const getRejectedTools = async (): Promise<Tool[]> => {
    const { data } = await api.get('/admin/tools/rejected');
    return data;
};

export const getAllToolsAdmin = async (): Promise<Tool[]> => {
    const { data } = await api.get('/admin/tools/all');
    return data;
};

export const getUserProfile = async (): Promise<User> => {
    const { data } = await api.get('/users/profile');
    return data;
};


export const updateUserProfile = async (formData: FormData): Promise<User> => {
    const { data } = await api.put('/users/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};


export const updateTool = async (id: string, formData: FormData): Promise<Tool> => {
    const { data } = await api.put(`/tools/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

export const rateTool = async (toolId: string, rating: number) => {
    const { data } = await api.post(`/tools/${toolId}/rate`, { rating });
    return data;
};
export default api;
