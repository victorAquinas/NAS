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
	instructor: Instructor;
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
	practica_place: PracticaPlace;
	start_time: string;
	end_time: string;
	dates: string[];
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
