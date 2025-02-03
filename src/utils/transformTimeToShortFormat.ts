import moment from 'moment';

export const transformTimeToShortFormat = (timeString: string): string => {
	return moment(timeString, 'HH:mm:ss').format('HH:mm');
};
