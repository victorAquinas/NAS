import { transformToUrlParams } from '../utils/stringToUrlParam';
import api from './fetch';
import { AdminHeadquarter, ResponseCreateLocation } from './types';

export const getLocations = async (): Promise<AdminHeadquarter[]> => {
	const response = await api.get(`${import.meta.env.VITE_API_URL}admin/info`);
	console.log('Response', response);
	return response.data;
};

export const createLocation = async (
	name: string,
	institutionId: string
): Promise<ResponseCreateLocation> => {
	const params = `name=${name}&institution_id=${institutionId}`;

	const response = await api.post(
		`${
			import.meta.env.VITE_API_URL
		}${`create-headquarter?${transformToUrlParams(params)}`}`
	);
	return response.data;
};

export const createSemester = async (
	name: string,
	startDate: string,
	endtDate: string,
	headquarterId: string
): Promise<ResponseCreateLocation> => {
	const params = `name=${name}&start_date=${startDate}&end_date=${endtDate}&headquarter_id=${headquarterId}`;

	const response = await api.post(
		`${import.meta.env.VITE_API_URL}${`create-semester?${transformToUrlParams(
			params
		)}`}`
	);
	return response.data;
};

export const createCourse = async (
	name: string,
	semesterId: string,
	maxEnrollmentDate: string
): Promise<ResponseCreateLocation> => {
	const params = `name=${name}&semester_id=${semesterId}&max_enrollment_date=${maxEnrollmentDate}`;

	const response = await api.post(
		`${
			import.meta.env.VITE_API_URL
		}${`create-program-semester?${transformToUrlParams(params)}`}`
	);
	return response.data;
};
