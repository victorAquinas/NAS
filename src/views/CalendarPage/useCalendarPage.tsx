/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { CalendarEvent, TutorialState } from './types';
import { getOneEventPerGroup } from '../../utils/getOneEventPerGroup';
import {
	getCalendarGroupById,
	getCalendarGroups,
	getUserStatus,
	requestGroup,
} from '../../api/services';
import { transformAndFillAddresses } from '../../utils/transformAndFillEvents';
import { UserStatus } from '../../api/types';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ErrorMessages } from '../../constants/text';
import useSetState from '../../hooks/useSetState';
import { CallBackProps, STATUS } from 'react-joyride';
import { TUTORIAL_STEPS } from './steps';

export const useCalendarPage = () => {
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [eventsCopy, setEventsCopy] = useState<CalendarEvent[]>([]);
	const [opportunities, setOpportunities] = useState<CalendarEvent[]>([]);
	const [showEventDetailModal, setShowEventDetailModal] = useState(false);
	const [eventDetail, setEventDetail] = useState<CalendarEvent | null>(null);
	const [userStatus, setUserStatus] = useState<UserStatus>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [hasGroups, setHasGroups] = useState<boolean>(true);
	const [groupId, setGroupId] = useState<string | null>(null);
	const [{ run, steps }, setState] = useSetState<TutorialState>({
		run: false,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		steps: TUTORIAL_STEPS as any,
	});
	const [showGroupConfirmationModal, setShowGroupConfirmationModal] =
		useState<boolean>(false);
	const [hasSeenTutorial, setHasSeenTutorial] = useState<boolean>(() => {
		const storedValue = localStorage.getItem('hasSeenTutorial');
		return storedValue === 'true'; // Convert to a boolean (assumes the value is stored as 'true' or 'false')
	});
	const { programSemesterId } = useParams();
	const navigate = useNavigate();

	// JoyRide tutorial
	const handleClickStart = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();

		setState({
			run: true,
		});
	};

	const handleJoyrideCallback = (data: CallBackProps) => {
		const { status } = data;
		const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

		if (finishedStatuses.includes(status)) {
			localStorage.setItem('hasSeenTutorial', 'true');
			setState({ run: false });
		}
	};

	const handleCloseLoading = () => {
		setTimeout(() => {
			setIsLoading(false);
		}, 500);
	};

	const handleShowEventDetailModal = (event: CalendarEvent) => {
		setShowEventDetailModal(true);
		setEventDetail(event);
		console.log('Event', event);
	};

	const handleCloseEventDetailModal = () => {
		setShowEventDetailModal(false);
		setEventDetail(null);
	};
	const getBackgroundColor = (group: number) => {
		switch (group) {
			case 1:
				return '#DFF3EF';
			case 2:
				return '#90CAF9';
			case 3:
				return '#E9D8A6';
			case 4:
				return '#94D2BD';
			case 5:
				return '#FF99C8';
			case 6:
				return '#E0AAFF';
			case 7:
				return '#FFFF3F';
			case 8:
				return '#F19C79';
			case 9:
				return '#D4E09B';
			case 10:
				return '#FDE2E4';
			case 11:
				return '#98F5E1';
			case 12:
				return '#B9FBC0';
			case 13:
				return '#CFBAF0';
			case 14:
				return '#FF70A6';

			default:
				return '#8AC926';
		}
	};

	const eventPropGetter = (event: CalendarEvent) => {
		return {
			style: {
				backgroundColor: getBackgroundColor(parseInt(event?.group)),
			},
		};
	};

	const filterCalendarByGroup = (groupNumber: string) => {
		if (groupNumber === 'all') {
			return setEventsCopy(events);
		}

		const filteredEvents = events.filter(
			(event) => event.group_id === groupNumber
		);
		setEventsCopy(filteredEvents);
	};

	const getCalendarGroupsEvents = async (user_program_semester_id: string) => {
		try {
			const groups = await getCalendarGroups(user_program_semester_id);
			if (groups.data.length === 0) {
				toast.error(ErrorMessages.NO_GROUPS_FOUND);
				setHasGroups(false);
			}
			const transformedCalendarEvents = transformAndFillAddresses(groups.data);
			setEvents(transformedCalendarEvents);
			setEventsCopy(transformedCalendarEvents);
			return transformedCalendarEvents;
		} catch (error) {
			console.error(error);
			toast.error(ErrorMessages.GENERAL_ERROR);
		} finally {
			handleCloseLoading();
		}
	};

	const getCalendarGroupByIdEvents = async (group_id: string) => {
		try {
			const group = await getCalendarGroupById(group_id);
			const transformedCalendarEvents = transformAndFillAddresses([group.data]);
			console.log('Specific Group', transformedCalendarEvents);
			setEvents(transformedCalendarEvents);
			setEventsCopy(transformedCalendarEvents);
			return transformedCalendarEvents;
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
		try {
			const statusResponse = await getUserStatus(
				email,
				user_program_semester_id
			);
			const { requested_group_status: status, requested_group } =
				statusResponse.data;
			setUserStatus(status as UserStatus);

			if (status === UserStatus.PENDING || status === UserStatus.ACCEPTED) {
				setGroupId(requested_group.toString());
			}
		} catch (error) {
			console.error(error);
			toast.error(ErrorMessages.GENERAL_ERROR);
		} finally {
			handleCloseLoading();
		}
	};

	const handleRequestGroup = async (
		email: string,
		groupId: string,
		programSemesterId: string
	) => {
		try {
			const requestedGroup = await requestGroup(email, groupId);
			if (!requestedGroup.success) {
				return toast.error(ErrorMessages.GROUP_ALREADY_SELECTED);
			}

			await handleUserStatus(email, programSemesterId);

			setShowEventDetailModal(false);
			setShowGroupConfirmationModal(true);
			console.log('Requested Group', requestedGroup);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!hasSeenTutorial && !isLoading) {
			setState({
				run: true,
			});
		}
	}, [hasSeenTutorial, isLoading]);

	useEffect(() => {
		if (programSemesterId) {
			handleUserStatus(import.meta.env.VITE_TEST_EMAIL_USER, programSemesterId);
			console.log(
				'LocalStorage',
				localStorage.getItem('hasSeenTutorial') ?? false
			);
			setHasSeenTutorial(localStorage.getItem('hasSeenTutorial') === 'true');
		}
	}, [programSemesterId]);

	useEffect(() => {
		if (userStatus && programSemesterId) {
			if (
				userStatus === UserStatus.ACCEPTED ||
				userStatus === UserStatus.PENDING
			) {
				if (groupId) {
					getCalendarGroupByIdEvents(groupId);
				}
			}

			if (
				userStatus === UserStatus.OPEN ||
				userStatus === UserStatus.REJECTED
			) {
				getCalendarGroupsEvents(programSemesterId);
			}
		}
	}, [userStatus, programSemesterId]);

	useEffect(() => {
		if (events.length > 0) {
			setOpportunities(getOneEventPerGroup(events));
		}
	}, [events]);
	console.log('Events', events);
	return {
		events,
		eventsCopy,
		getBackgroundColor,
		eventPropGetter,
		filterCalendarByGroup,
		opportunities,
		handleShowEventDetailModal,
		eventDetail,
		showEventDetailModal,
		handleCloseEventDetailModal,
		userStatus,
		isLoading,
		programSemesterId,
		navigate,
		hasGroups,
		handleRequestGroup,
		showGroupConfirmationModal,
		setShowGroupConfirmationModal,
		run,
		steps,
		handleClickStart,
		handleJoyrideCallback,
		hasSeenTutorial,
	};
};
