import { PracticaPlaceTypeName } from '../../api/types';

export interface CalendarEvent {
	title: string;
	group_name: string;
	available: number;
	max_students: number;
	group_id: string;
	group: string;
	start: Date;
	end: Date;
	offsiteAddress: string;
	campusAddress: string;
	shift: string;
	tutor: string;
	type: PracticaPlaceTypeName;
	dates?: {
		in_site: DateTypeEvent[];
		off_site: DateTypeEvent[];
	};
	rawDate: string;
}

export interface DateTypeEvent {
	date: string;
	shift: string;
	tutor: string;
}
