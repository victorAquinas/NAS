import { transformToUrlParams } from '../utils/stringToUrlParam';
import api from './fetch';
import {
	AdminHeadquarter,
	GroupDetails,
	ResponseCreateDay,
	ResponseCreateLocation,
	ResponseCreateWeek,
	ResponseDeleteDay,
	SourcesResponse,
	updateGroupType,
} from './types';
import { isBooleanString } from '../utils/isBooleanString';
import { toBoolean } from '../utils/toBoolean';

export const getLocations = async (): Promise<AdminHeadquarter[]> => {
	const response = await api.get(`${import.meta.env.VITE_API_URL}admin/info`);

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

export const getSources = async (): Promise<SourcesResponse> => {
	const response = await api.get(
		`${import.meta.env.VITE_API_URL}admin/sources`
	);

	return response.data;
};

export const updateGroup = async (
	id: number,
	field: string,
	value: unknown,
	level: updateGroupType
): Promise<ResponseCreateLocation> => {
	const body = {
		id,
		field,
		value: isBooleanString(value as string)
			? toBoolean(value as string)
			: value,
		level,
	};

	const response = await api.patch(
		`${import.meta.env.VITE_API_URL}${`group`}`,
		body
	);
	return response.data;
};

export const createDayInWeek = async (
	week_schedule_id: number
): Promise<ResponseCreateDay> => {
	const response = await api.post(
		`${
			import.meta.env.VITE_API_URL
		}group/week/day?week_schedule_id=${week_schedule_id}`
	);
	return response.data;
};

export const deleteDayInWeek = async (
	week_schedule_id: number,
	day_id: number
): Promise<ResponseDeleteDay> => {
	const response = await api.delete(
		`${
			import.meta.env.VITE_API_URL
		}group/week/day?week_schedule_id=${week_schedule_id}&day_id=${day_id}`
	);
	return response.data;
};

export const createWeek = async (
	group_id: number,
	is_insite: boolean
): Promise<ResponseCreateWeek> => {
	const response = await api.post(
		`${
			import.meta.env.VITE_API_URL
		}group/week?group_id=${group_id}&is_insite=${is_insite}`
	);
	return response.data;
};

export const deleteWeek = async (
	group_id: number,
	week_id: number
): Promise<ResponseCreateWeek> => {
	const response = await api.delete(
		`${
			import.meta.env.VITE_API_URL
		}group/week?group_id=${group_id}&week_id=${week_id}`
	);
	return response.data;
};

export const createGroup = async (
	data: GroupDetails
): Promise<ResponseCreateLocation> => {
	const response = await api.put(
		`${import.meta.env.VITE_API_URL}${`group`}`,
		data
	);
	return response.data;
};
