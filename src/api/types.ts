export interface Program {
	name: string;
	id: number;
}
export interface StudentProgram {
	program: Program;
	program_semester_id: number;
	is_active: boolean;
	has_register: boolean;
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
	success: boolean;
}
export interface Group {
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
}

export interface AdminSemester {
	semester_name: string;
	semester_id: number;
	semester_start_date: string; // ISO Date string format
	semester_end_date: string; // ISO Date string format
	semester_status: boolean;
	programs_in: AdminProgramIn[];
}

export interface AdminHeadquarter {
	headquarter_name: string;
	headquarter_id: number;
	institution_id: number;
	semesters_in: AdminSemester[];
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
