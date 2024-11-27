import { transformToUrlParams } from '../utils/stringToUrlParam';
import api from './fetch';
import { GroupResponse, SemesterResponse } from './types';

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

export const getStudentCourses = async (
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

export const getCalendarGroups = async (
	program_semester_id: string
): Promise<GroupResponse> => {
	const response = await api.get(
		`${
			import.meta.env.VITE_API_URL
		}${`group?program_semester_id=${program_semester_id}`}`
	);

	return response.data;
};
