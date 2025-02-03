import {
	OptionType,
	SelectOptionDescription,
	UserStatus,
} from '../../../api/types';

export interface TableFilters {
	name: string;
	email: string;
	phone: string;
	request_status: UserStatus | null;
	group: string;
}

export interface TableFilterOptions {
	groups: OptionType[];
	status: OptionType[];
}

export interface MoveWeek {
	selected_semester: SelectOptionDescription | null;
	selected_course: SelectOptionDescription | null;
	selected_origin_week: SelectOptionDescription | null;
	selected_destination_week: SelectOptionDescription | null;
}

export interface MoveWeekOptions {
	semesters: SelectOptionDescription[];
	courses: SelectOptionDescription[];
	originWeeks: SelectOptionDescription[];
	destinationWeeks: SelectOptionDescription[];
}

export type ExternalTransferChoice =
	| 'to-another-institution'
	| 'to-another-week'
	| null;
export enum ExternalTransferChoiceEnum {
	TO_ANOTHER_INSTITUTION = 'to-another-institution',
	TO_ANOTHER_WEEK = 'to-another-week',
}
