export interface Program {
	name: string;
	id: number;
}
export interface StudentProgram {
	program: Program;
	program_semester_id: number;
	is_active: boolean;
	has_register: boolean;
	program_semester_let_enrollment: boolean;
	program_semester_max_enrollment_date: string;
	program_semester_status: boolean;
}

export interface SemesterResponse {
	data: Semester[];
	success: boolean;
}

export interface Semester {
	semester_id: number;
	semester_name: string;
	start_date: string;
	end_date: string;
	semester_status: boolean;
	student_programs: StudentProgram[];
}
export interface GroupResponse {
	data: Group[];
	max_enrollment_date: string;
	semester_status: boolean;
	let_enrollment: boolean;
	success: boolean;
}
export interface Group {
	headquarter: string;
	program_name: string;
	group_id: number;
	group_name: string;
	max_students: number;
	spaces_available: number;
	is_active: boolean;
	start_date: string;
	end_date: string;
	program_semester_id: number;
	verity_group_id: string;
	in_days: string[];
	weeks: Week[];
}

export interface Week {
	week_id: number;
	week_number: number;
	week_schedule: WeekSchedule;
}

export interface Instructor {
	role_id: number;
	institution_id: number;
	email: string;
	name: string;
	id: number;
	phone: string | null;
	is_active: boolean;
}

export interface WeekSchedule {
	week_schedule_id: number;
	practice_place: PracticaPlace;
	start_time: string;
	end_time: string;
	dates: DateSchedule[];
}

export interface DateSchedule {
	day_id: number;
	date: string;
	instructor: Instructor;
}

export enum PracticaPlaceTypeName {
	IN_SITE = 'In-Site',
	OFF_SITE = 'Off-Site',
}

export enum PracticaPlaceTypeId {
	OFF_SITE = 1,
	IN_SITE = 2,
}

export interface PracticaPlace {
	program_semester_id: number;
	name: string;
	id: number;
	address: string;
	status: boolean;
	type: {
		name: PracticaPlaceTypeName;
		type: number;
	};
	semester_status: boolean;
}

export interface UserStatusResponse {
	success: boolean;
	data: {
		can_enroll: boolean;
		max_enrollment_date: string;
		student_id: number;
		student_name: string;
		student_email: string;
		requested_group: number;
		requested_group_status: 'PENDING' | 'REJECTED' | 'ACCEPTED' | 'OPEN';
		program: {
			name: string;
			id: number;
		};
		semester_status: boolean;
	};
}

export enum UserStatus {
	OPEN = 'OPEN',
	PENDING = 'PENDING',
	REJECTED = 'REJECTED',
	REJECT = 'REJECT',
	ACCEPTED = 'ACCEPTED',
}

export interface GroupByIdResponse {
	data: Group;
	success: boolean;
}

export interface RequestGroupResponse {
	success: boolean;
	data: number[];
}

export interface LoginUserResponse {
	success: boolean;
	data: {
		token: string;
		expiration_time: number;
	};
}

// Admin Types

export interface AdminProgramIn {
	program_semester_id: number;
	program: Program;
	program_semester_status: boolean;
}

export interface AdminSemester {
	semester_name: string;
	semester_id: number;
	semester_start_date: string; // ISO Date string format
	semester_end_date: string; // ISO Date string format
	semester_status: boolean;
	programs_in: AdminProgramIn[];
	semester_is_active: boolean;
}

export interface AdminHeadquarter {
	headquarter_name: string;
	headquarter_id: number;
	institution_id: number;
	semesters_in: AdminSemester[];
	is_active: boolean;
}

export type HeadquartersData = AdminHeadquarter[];

export interface ResponseCreateLocation {
	institution_id: string;
	name: string;
	id: number;
}

export interface AvailablePlace {
	id: number;
	name: string;
	address: string;
	type: {
		id: number;
		name: string;
	};
}

export interface Place {
	program_semester_id: number;
	max_enrollment_date: string;
	status: boolean;
	available_places: AvailablePlace[];
}
export interface SourcesResponse {
	places: Place[];
	instructors: Instructor[];
	only_places_without_repeat: [
		{
			name: string;
			address: string;
			id: number;
			headquarter: string;
			status: boolean;
			type: {
				id: number;
				name: string;
			};
		}
	];
}

export type updateGroupType = 'group' | 'week' | 'week_schedule' | 'day';

export interface ResponseCreateDay {
	success: boolean;
	data: {
		date: string;
		id: number;
		instructor_id: number;
	};
}

export interface ResponseDeleteDay {
	success: boolean;
	data: {
		message: string;
	};
}

export interface ResponseCreateWeek {
	sucess: boolean;
	data: {
		week_number: number;
		in_site_off_site_id: number;
		id: number;
	};
}

export interface CreateGroupBody {
	groupName: string;
	verityGroupId: string;
	maxStudents: number;
	inDays: string[];
	startDate: string;
	endDate: string;
	defaultStartTime: string;
	defaultEndTime: string;
	defaultInstructorId: number;
	defaultInsidePracticePlaceId: number;
	defaultOffsidePracticePlaceId: number;
	offsideNumWeeksForGenerate: number;
	insideNumWeeksForGenerate: number;
	programSemesterId: number;
}

export interface GroupDetails {
	group_name: string;
	start_date: string;
	end_date: string;
	default_end_time: string;
	default_start_time: string;
	max_students: number;
	default_instructor_id: number;
	verity_group_id: string;
	in_days: string[];
	offsite_num_weeks_for_generate: number;
	default_insite_practice_place_id: number;
	default_offsite_practice_place_id: number;
	insite_num_weeks_for_generate: number;
	program_semester_id?: number;
}

export type OptionType = {
	value: string;
	label: string;
};

export interface StudentsResponse {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	request: {
		requested_group_id: number;
		requested_group_status: string;
		requested_group_name: string;
	};
}

export interface SelectOptionDescription {
	label: string;
	value: number;
	description?: string;
}

export interface ResponseCreateGroupPlace {
	success: boolean;
	data: {
		address: string;
		program_semester_id: number;
		status: boolean;
		type_id: number;
		id: number;
		name: string;
	};
}

export interface ResponseGroups {
	id: number;
	name: string;
	program_semester_id: number;
	headquarter: string;
}

export interface ResponseGetGroups {
	foreign_places: ResponseGroups[];
	local_places: ResponseGroups[];
}

export interface ResponseRelocateStudent {
	success: boolean;
	data: {
		message: string;
	};
}
export interface Notification {
	id: number;
	title: string;
	created_at: string; // ISO 8601 date string
	user_id: number;
	description: string;
	status: boolean;
}

export interface ApiNotificationResponse {
	success: boolean;
	current_semester_id: number;
	data: Notification[];
}

export interface ApiNotificationSeenResponse {
	success: boolean;
	data: Notification;
}

export interface UserResponse {
	success: boolean;
	data: {
		institution_id: number;
		id: number;
		name: string;
		role_id: number;
		email: string;
		is_active: boolean;
		updated_at: string; // ISO date string
		phone: string;
		created_at: string; // ISO date string
		password: string;
	};
}

export enum Role {
	ADMIN = 1,
	COORDINATOR = 2,
	STUDENT = 3,
}

export interface UsersFilters {
	role: string;
	name: string;
	status: boolean | null;
	page: number | null;
	limit: number | null;
}

export interface User {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	role: string;
	status: boolean;
}

export interface Dashboard {
	id: number;
	report_id: string;
	name: string;
	url: string;
}
export interface DashboardResponse {
	embedToken: string;
	embedTokenId: string;
	report: Dashboard;
	tokenExpiry: string;
}
export interface ImportUsersResponse {
	data: {
		first_time_registers: string[];
		only_register_in_program_semester: string[];
	};
}

export interface GroupPlacesResponse {
	success: boolean;
	data: GroupPlace[];
}

export interface GroupPlace {
	status: boolean;
	address: string;
	name: string;
	institution_id: number;
	id: number;
	type_id: number;
}

export interface ProgramSemester {
	semester_id: number;
	program_id: number;
	max_enrollment_date: string;
	id: number;
	created_at: string;
	updated_at: string;
	let_enrollment: boolean;
	status: boolean;
	program: {
		created_at: string;
		id: number;
		name: string;
		updated_at: string;
	};
}
export interface UpdateProgramSemesterResponse {
	success: true;
	data: ProgramSemester;
}

export interface Headquarter {
	id: number;
	name: string;
	institution: Institution;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface PracticePlace {
	id: number;
	name: string;
	address: string;
	status: boolean;
}

export interface Institution {
	id: number;
	name: string;
	domain: string;
	practice_places: PracticePlace[];
	users: User[];
}

export interface ResponseGetSemesters {
	id: number;
	name: string;
	start_date: string;
	end_date: string;
	headquarter: Headquarter;
	status: boolean;
	is_active: boolean;
	created_at: string;
	updated_at: string;
	program_semesters: ProgramSemester[];
}

export interface ResponseSemesterDetails {
	id: number;
	name: string;
	status: boolean;
	start_date: string;
	end_date: string;
	headquarter_id: number;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}
