import { transformToUrlParams } from '../utils/stringToUrlParam';
import api from './fetch';
import {
	GroupByIdResponse,
	GroupResponse,
	LoginUserResponse,
	RequestGroupResponse,
	SemesterResponse,
	UserStatusResponse,
} from './types';

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

export const getUserStatus = async (
	email: string,
	program_semester_id: string
): Promise<UserStatusResponse> => {
	const emailUrlParams = `user_email=${email}&program_semester_id=${program_semester_id}`;

	const response = await api.get(
		`${import.meta.env.VITE_API_URL}${`user/status?${transformToUrlParams(
			emailUrlParams
		)}`}`
	);
	return response.data;
};

export const getCalendarGroupById = async (
	group_id: string
): Promise<GroupByIdResponse> => {
	const response = await api.get(
		`${import.meta.env.VITE_API_URL}${`group/id?group_id=${group_id}`}`
	);

	return response.data;
};

export const getCalendarWeeksByStudentId = async (
	student_id: number,
	program_semester_id: string
): Promise<GroupByIdResponse> => {
	const response = await api.get(
		`${
			import.meta.env.VITE_API_URL
		}${`user/current/group?student_id=${student_id}&program_semester_id=${program_semester_id}`}`
	);

	return response.data;
};

export const requestGroup = async (
	email: string,
	group_id: string
): Promise<RequestGroupResponse> => {
	const emailUrlParams = `user_email=${email}&group_id=${group_id}`;

	const response = await api.put(
		`${
			import.meta.env.VITE_API_URL
		}${`user/group/request?${transformToUrlParams(emailUrlParams)}`}`
	);
	return response.data;
};

export const loginUser = async (
	email: string,
	password: string
): Promise<LoginUserResponse> => {
	const emailUrlParams = `email=${email}&password=${password}`;

	const response = await api.post(
		`${import.meta.env.VITE_API_URL}${`login?${transformToUrlParams(
			emailUrlParams
		)}`}`
	);
	return response.data;
};
