import { transformToUrlParams } from '../utils/stringToUrlParam';
import api from './fetch';
import { SemesterResponse } from './types';

export const getSemesters = async (
	email: string
): Promise<SemesterResponse> => {
	const emailUrlParams = `user_email=${email}`;

	const response = await api.get(
		`${import.meta.env.VITE_API_URL}${`user/programs/all?${transformToUrlParams(
			emailUrlParams
		)}`}`
	);
	return response.data;
};
