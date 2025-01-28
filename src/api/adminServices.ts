import { transformToUrlParams } from '../utils/stringToUrlParam';
import api from './fetch';
import {
	AdminHeadquarter,
	ApiNotificationResponse,
	ApiNotificationSeenResponse,
	DashboardResponse,
	GroupDetails,
	GroupPlacesResponse,
	ImportUsersResponse,
	ResponseCreateDay,
	ResponseCreateGroupPlace,
	ResponseCreateLocation,
	ResponseCreateWeek,
	ResponseDeleteDay,
	ResponseGetGroups,
	ResponseRelocateStudent,
	SourcesResponse,
	StudentsResponse,
	updateGroupType,
	UpdateProgramSemesterResponse,
	User,
	UserResponse,
	UsersFilters,
} from './types';
import { isBooleanString } from '../utils/isBooleanString';
import { toBoolean } from '../utils/toBoolean';
import { TableFilters } from '../views/Admin/Students/types';
import axios from 'axios';

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

export const desactivateLocation = async (
	location_id: number
): Promise<ResponseCreateDay> => {
	const response = await api.patch(
		`${
			import.meta.env.VITE_API_URL
		}deactivate-headquarter?headquarter_id=${location_id}`
	);
	return response.data;
};

export const desactivateSemester = async (
	semester_id: number
): Promise<ResponseCreateDay> => {
	const response = await api.patch(
		`${
			import.meta.env.VITE_API_URL
		}deactivate-semester?semester_id=${semester_id}`
	);
	return response.data;
};

export const desactivateCourse = async (
	program_semester_id: number
): Promise<ResponseCreateDay> => {
	const response = await api.patch(
		`${
			import.meta.env.VITE_API_URL
		}deactivate-program-semester?program_semester_id=${program_semester_id}`
	);
	return response.data;
};

export const getStudentsByProgramSemesterId = async (
	program_semester_id: string,
	filters: TableFilters
): Promise<StudentsResponse[]> => {
	const currentFilters = {
		...(filters.name && { name: filters.name }),
		...(filters.email && { email: filters.email }),
		...(filters.phone && { phone: filters.phone }),
		...(filters.group && { group: filters.group }),
		...(filters.request_status && { request_status: filters.request_status }),
	};

	const response = await api.post(
		`${
			import.meta.env.VITE_API_URL
		}admin/program/students?program_semester_id=${program_semester_id}`,
		currentFilters
	);

	return response.data;
};

export const acceptUserInGroup = async (
	user_email: string,
	group_id: number
): Promise<ResponseDeleteDay> => {
	const params = `user_email=${user_email}&group_id=${group_id}`;
	const response = await api.patch(
		`${import.meta.env.VITE_API_URL}user/group/accept?${transformToUrlParams(
			params
		)}`
	);
	return response.data;
};

export const rejectUserInGroup = async (
	user_email: string,
	group_id: number
): Promise<ResponseDeleteDay> => {
	const params = `user_email=${user_email}&group_id=${group_id}`;
	const response = await api.patch(
		`${import.meta.env.VITE_API_URL}user/group/reject?${transformToUrlParams(
			params
		)}`
	);
	return response.data;
};

export const createGroupPlace = async (
	name: string,
	type_id: number,
	address: string,
	program_semester_id: string
): Promise<ResponseCreateGroupPlace> => {
	const response = await api.put(`${import.meta.env.VITE_API_URL}places`, {
		name,
		type_id,
		address,
		program_semester_id,
	});
	return response.data;
};

export const getGroups = async (
	program_semester_id: string
): Promise<ResponseGetGroups> => {
	const response = await api.get(
		`${
			import.meta.env.VITE_API_URL
		}relocations?program_semester_id=${program_semester_id}`
	);

	return response.data;
};

export const relocateStudent = async (
	student_id: number,
	new_group_id: number
): Promise<ResponseRelocateStudent> => {
	const params = `student_id=${student_id}&new_group_id=${new_group_id}`;
	const response = await api.post(
		`${
			import.meta.env.VITE_API_URL
		}relocations/change_student_group?${transformToUrlParams(params)}`
	);
	return response.data;
};

export const relocateStudentInWeek = async (
	student_id: number,
	week_id_origin: number,
	week_id_destiny: number
): Promise<ResponseRelocateStudent> => {
	const params = `student_id=${student_id}&week_id_origin=${week_id_origin}&week_id_destiny=${week_id_destiny}`;
	const response = await api.post(
		`${import.meta.env.VITE_API_URL}relocations/week?${transformToUrlParams(
			params
		)}`
	);
	return response.data;
};

export const getNotifications = async (
	user_email: string
): Promise<ApiNotificationResponse> => {
	const response = await api.get(
		`${import.meta.env.VITE_API_URL}notifications/${user_email}`
	);
	return response.data;
};

export const setNotificationSeen = async (
	notification_id: number
): Promise<ApiNotificationSeenResponse> => {
	const response = await api.put(
		`${import.meta.env.VITE_API_URL}notification/seen/${notification_id}`
	);
	return response.data;
};

export const createUser = async (
	name: string,
	email: string,
	password: string,
	institution_id: string,
	role_id: number,
	phone: string
): Promise<UserResponse> => {
	const response = await api.put(`${import.meta.env.VITE_API_URL}user`, {
		name,
		email,
		password,
		institution_id,
		role_id,
		phone,
	});
	return response.data;
};

export const updateUser = async (
	user_id: string,
	name: string,
	email: string,
	phone: string,
	is_active?: boolean
): Promise<UserResponse> => {
	const response = await api.patch(
		`${import.meta.env.VITE_API_URL}user/update?user_id=${user_id}`,
		{
			name,
			email,
			phone,
			status: is_active,
		}
	);
	return response.data;
};

export const getUsers = async (filters: UsersFilters): Promise<User[]> => {
	const currentFilters = {
		...(filters.name && { name: filters.name }),
		...(filters.role && { role: filters.role }),
		...(filters.status && { status: filters.status }),
		...(filters.page && { page: filters.page }),
		...(filters.limit && { limit: filters.limit }),
	};

	const response = await api.post(
		`${import.meta.env.VITE_API_URL}admin/people`,
		currentFilters
	);

	return response.data;
};

export const authDatavision = async (): Promise<{
	access_token: string;
	token_type: string;
}> => {
	const response = await axios.post(
		`${import.meta.env.VITE_DATAVISION_API}auth`,
		{
			username: import.meta.env.VITE_DATAVISION_USERNAME,
			password: import.meta.env.VITE_DATAVISION_PASSWORD,
		}
	);
	return response.data;
};
export const getDashboard = async (
	dashboard_id: number
): Promise<DashboardResponse> => {
	const auth = await authDatavision();

	const response = await axios.post(
		`${import.meta.env.VITE_DATAVISION_API}embed_token_by_id/${dashboard_id}`,
		{},
		{
			headers: {
				Authorization: `Bearer ${auth.access_token}`,
			},
		}
	);
	return response.data;
};

export const importUsers = async (
	programSemesterId: number,
	file: File
): Promise<ImportUsersResponse> => {
	const formData = new FormData();
	formData.append('file', file, file.name);

	const response = await api.post(
		`${
			import.meta.env.VITE_API_URL
		}admin/import/users?program_semester_id=${programSemesterId}`,
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
				Accept: 'application/json',
			},
		}
	);

	return response.data;
};

export const getPlaces = async (
	institution_id: string
): Promise<GroupPlacesResponse> => {
	const response = await api.get(
		`${import.meta.env.VITE_API_URL}places?institution_id=${institution_id}`
	);
	return response.data;
};

export const createNewGroupPlace = async (
	name: string,
	address: string,
	typeId: number,
	institutionId: number
): Promise<GroupPlacesResponse> => {
	const response = await api.put(`${import.meta.env.VITE_API_URL}places`, {
		name,
		type_id: typeId,
		address,
		institution_id: institutionId,
	});
	return response.data;
};

export const updateGroupPlace = async (
	practicePlaceId: number,
	name: string,
	typeId: number,
	address: string,
	institutionId: number
): Promise<void> => {
	const response = await api.patch(
		`${
			import.meta.env.VITE_API_URL
		}places/?practice_place_id=${practicePlaceId}`,
		{
			name,
			type_id: typeId,
			address,
			institution_id: institutionId,
		}
	);
	return response.data;
};

export const updateProgramSemester = async (
	programSemesterId: string,
	maxEnrollmentDate?: string,
	letEnrollment?: boolean
): Promise<UpdateProgramSemesterResponse> => {
	// const payload = {
	// 	...(maxEnrollmentDate && { max_enrollment_date: maxEnrollmentDate }),
	// 	...(letEnrollment && { let_enrollment: letEnrollment }),
	// };
	const payload = {
		max_enrollment_date: maxEnrollmentDate,
		let_enrollment: letEnrollment,
	};
	const response = await api.patch(
		`${
			import.meta.env.VITE_API_URL
		}update-program-semester?program_semester_id=${programSemesterId}`,
		payload
	);
	return response.data;
};
