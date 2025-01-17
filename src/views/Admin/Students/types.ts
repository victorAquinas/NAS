import { OptionType, UserStatus } from '../../../api/types';

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
