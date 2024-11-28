import { useEffect, useState } from 'react';
import { CalendarEvent } from './types';
import { getOneEventPerGroup } from '../../utils/getOneEventPerGroup';
import {
	getCalendarGroupById,
	getCalendarGroups,
	getUserStatus,
} from '../../api/services';
import { transformAndFillAddresses } from '../../utils/transformAndFillEvents';
import { UserStatus } from '../../api/types';

export const useCalendarPage = () => {
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [eventsCopy, setEventsCopy] = useState<CalendarEvent[]>([]);
	const [opportunities, setOpportunities] = useState<CalendarEvent[]>([]);
	const [showEventDetailModal, setShowEventDetailModal] = useState(false);
	const [eventDetail, setEventDetail] = useState<CalendarEvent | null>(null);
	const [userStatus, setUserStatus] = useState<UserStatus>();

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
			const transformedCalendarEvents = transformAndFillAddresses(groups.data);
			console.log('transformedCalendarEvents', transformedCalendarEvents);
			setEvents(transformedCalendarEvents);
			setEventsCopy(transformedCalendarEvents);
			return transformedCalendarEvents;
		} catch (error) {
			console.error(error);
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
		}
	};

	const handleUserStatus = async (
		email: string,
		user_program_semester_id: string
	) => {
		try {
			console.log('El email', email);
			const statusResponse = await getUserStatus(
				email,
				user_program_semester_id
			);
			const { requested_group_status: status } = statusResponse.data;
			// setUserStatus(status as UserStatus);
			// setUserStatus(UserStatus.ACCEPTED);
			// setUserStatus(UserStatus.REJECTED);
			// setUserStatus(UserStatus.PENDING);
			setUserStatus(UserStatus.NONE);
			console.log('Status', status);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		handleUserStatus('daniel+student', '4');
	}, []);
	useEffect(() => {
		// handleUserStatus('daniel+student', '4');
		// // getCalendarGroupById('14').then((res) => console.log(res));
		// getCalendarGroupByIdEvents('14');
		// // getCalendarGroupsEvents('4');

		if (userStatus) {
			if (
				userStatus === UserStatus.ACCEPTED ||
				userStatus === UserStatus.PENDING
			) {
				getCalendarGroupByIdEvents('14');
			}

			if (userStatus === UserStatus.NONE) {
				getCalendarGroupsEvents('4');
			}
		}
	}, [userStatus]);

	useEffect(() => {
		if (events.length > 0) {
			setOpportunities(getOneEventPerGroup(events));
		}
	}, [events]);

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
	};
};
