import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from '../constants/dateSettings';

export type DateFormat =
	| 'MM/DD/YYYY'
	| 'DD-MM-YYYY'
	| 'YYYY/MM/DD'
	| 'YYYY-MM-DD';

export const transformDateString = (
	dateString: string,
	format: DateFormat = DEFAULT_DATE_FORMAT
): string => {
	if (!moment(dateString, true).isValid()) {
		throw new Error('Invalid date string');
	}

	return moment(dateString).format(format);
};
