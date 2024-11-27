import moment from 'moment';

export const transformTimeToShortFormat = (timeString: string): string => {
	// Parse the input time string and format it as 'HH:mm'
	return moment(timeString, 'HH:mm:ss').format('HH:mm');
};
