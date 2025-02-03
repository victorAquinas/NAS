import moment from 'moment';

export const transformDateStringToTime = (dateString: string): string => {
	return moment(dateString).format('HH:mm:ss');
};
