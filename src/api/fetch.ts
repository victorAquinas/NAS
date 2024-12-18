import axios from 'axios';
import { getTokenFromCookies } from '../utils/cookies';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000,
});

api.interceptors.request.use(
	(config) => {
		config.headers = config.headers || {};
		const token = getTokenFromCookies();

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default api;
