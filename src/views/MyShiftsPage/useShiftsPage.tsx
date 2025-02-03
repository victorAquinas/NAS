import { useEffect, useState } from 'react';
import { CalendarEvent } from '../CalendarPage/types';
import { UserStatus } from '../../api/types';
import { transformAndFillAddresses } from '../../utils/transformAndFillEvents';
import {
	// getCalendarGroupById,
	getCalendarWeeksByStudentId,
	getUserStatus,
} from '../../api/services';
import { toast } from 'react-toastify';
import { ErrorMessages } from '../../constants/text';
import { useNavigate, useParams } from 'react-router-dom';
import { getCookieItem, getTokenFromCookies } from '../../utils/cookies';
import { decodeToken } from '../../utils/decodeToken';

export const useShiftsPage = () => {
	const token = getTokenFromCookies();
	const decodedToken = decodeToken(token ?? '');
	const userEmail = getCookieItem('user_email');
	const [activeEvents, setActiveEvents] = useState<CalendarEvent[]>([]);
	const [userStatus, setUserStatus] = useState<UserStatus>();
	const [activeGroup, setActiveGroup] = useState<string>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [selectedCourse, setSelectedCourse] = useState<string>('');
	const [isSemesterOpen, setIsSemesterOpen] = useState<boolean>(false);
	const { programSemesterId } = useParams();
	const navigate = useNavigate();

	const handleCloseLoading = () => {
		setTimeout(() => {
			setIsLoading(false);
		}, 500);
	};

	const parseDate = (dateString: string): Date => {
		const [month, day, year] = dateString.split('/').map(Number);
		return new Date(year, month - 1, day);
	};

	const getCalendarWeeks = async (student_id: number) => {
		setIsLoading(true);
		try {
			if (programSemesterId) {
				const group = await getCalendarWeeksByStudentId(
					student_id,
					programSemesterId
				);
				const transformedCalendarEvents = transformAndFillAddresses([
					group.data,
				]);

				const sortedEventsByDate = transformedCalendarEvents.sort((a, b) => {
					return (
						parseDate(a.rawDate).getTime() - parseDate(b.rawDate).getTime()
					);
				});

				setActiveEvents(sortedEventsByDate);

				return sortedEventsByDate;
			}
		} catch (error) {
			console.error(error);
			toast.error(ErrorMessages.GENERAL_ERROR);
		} finally {
			handleCloseLoading();
		}
	};

	const handleUserStatus = async (
		email: string,
		user_program_semester_id: string
	) => {
		setIsLoading(true);
		try {
			const statusResponse = await getUserStatus(
				email,
				user_program_semester_id
			);
			const { requested_group_status: status, requested_group } =
				statusResponse.data;

			setUserStatus(status as UserStatus);
			setIsSemesterOpen(statusResponse.data.semester_status);
			setSelectedCourse(statusResponse.data.program.name);
			if (requested_group) {
				setActiveGroup(requested_group.toString());
			}
		} catch (error) {
			console.error(error);
			toast.error(ErrorMessages.GENERAL_ERROR);
		} finally {
			handleCloseLoading();
		}
	};

	useEffect(() => {
		if (programSemesterId && userEmail) {
			handleUserStatus(userEmail, programSemesterId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [programSemesterId, userEmail]);

	useEffect(() => {
		// if (userStatus && userStatus === UserStatus.ACCEPTED) {
		// 	getCalendarGroupByIdEvents(activeGroup as string);
		// }
		if (userStatus && userStatus === UserStatus.ACCEPTED) {
			if (decodedToken) {
				getCalendarWeeks(decodedToken.user_id);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userStatus, activeGroup]);

	return {
		userStatus,
		activeEvents,
		activeGroup,
		isLoading,
		programSemesterId,
		navigate,
		selectedCourse,
		isSemesterOpen,
	};
};
