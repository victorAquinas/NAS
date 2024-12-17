import { transformToUrlParams } from '../utils/stringToUrlParam';
import api from './fetch';
import { AdminHeadquarter, ResponseCreateLocation } from './types';

export const getLocations = async (): Promise<AdminHeadquarter[]> => {
	const response = await api.get(`${import.meta.env.VITE_API_URL}admin/info`);
	console.log('Response', response);
	return response.data;
};

export const createLocation = async (
	email: string,
	password: string
): Promise<ResponseCreateLocation> => {
	const emailUrlParams = `name=${email}&institution_id=${password}`;

	const response = await api.post(
		`${
			import.meta.env.VITE_API_URL
		}${`create-headquarter?${transformToUrlParams(emailUrlParams)}`}`
	);
	return response.data;
};
