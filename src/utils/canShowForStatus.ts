import { UserStatus } from '../api/types';

// export function canShowForStatus(statusToCheck: UserStatus[]): boolean {
// 	const allowedStatuses: UserStatus[] = [
// 		UserStatus.NONE,
// 		UserStatus.PENDING,
// 		UserStatus.REJECTED,
// 		UserStatus.ACCEPTED,
// 	];

// 	return allowedStatuses.some((value) => statusToCheck.includes(value));
// }

export const canShowStatus = (
	userStatus: UserStatus,
	matchingStatuses: UserStatus[]
): boolean => {
	return matchingStatuses.includes(userStatus);
};
