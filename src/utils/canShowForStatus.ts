import { UserStatus } from '../api/types';

export const canShowStatus = (
	userStatus: UserStatus,
	matchingStatuses: UserStatus[]
): boolean => {
	return matchingStatuses.includes(userStatus);
};
