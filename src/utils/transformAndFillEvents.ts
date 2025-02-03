import { Group, PracticaPlaceTypeName } from '../api/types';
import { DEFAULT_DATE_FORMAT } from '../constants/dateSettings';
import { CalendarEvent, DateTypeEvent } from '../views/CalendarPage/types';
import { toExactDate } from './toExactDate';
import { transformDateString } from './transformDateString';
import { transformTimeToShortFormat } from './transformTimeToShortFormat';

export const transformAndFillAddresses = (data: Group[]): CalendarEvent[] => {
	// const transformToCalendarEvents = (data: Group[]): CalendarEvent[] => {
	// 	return data.flatMap((group, index) =>
	// 		group.weeks.flatMap((week) =>
	// 			week.week_schedule.dates.map((date) => ({
	// 				title: week.week_schedule.practice_place.name,
	// 				group_name: group.group_name,
	// 				available: group.spaces_available,
	// 				max_students: group.max_students,
	// 				group_id: group.group_id.toString(),
	// 				group: (index + 1).toString(),
	// 				start: toExactDate(date.date),
	// 				end: toExactDate(date.date),
	// 				offsiteAddress:
	// 					week.week_schedule.practice_place.type.name ===
	// 					PracticaPlaceTypeName.OFF_SITE
	// 						? week.week_schedule.practice_place.address
	// 						: '',
	// 				campusAddress:
	// 					week.week_schedule.practice_place.type.name ===
	// 					PracticaPlaceTypeName.IN_SITE
	// 						? week.week_schedule.practice_place.address
	// 						: '',
	// 				shift: `${transformTimeToShortFormat(
	// 					week.week_schedule.start_time
	// 				)} - ${transformTimeToShortFormat(week.week_schedule.end_time)}`,
	// 				tutor: date.instructor.name,
	// 				type: week.week_schedule.practice_place.type.name,
	// 				rawDate: transformDateString(date.date, DEFAULT_DATE_FORMAT),
	// 				is_active: group.is_active,
	// 			}))
	// 		)
	// 	);
	// };

	const transformToCalendarEvents = (data: Group[]): CalendarEvent[] => {
		return data
			.filter((group) => group.is_active && group.spaces_available > 0) // Filter only active groups
			.flatMap((group, index) =>
				group.weeks.flatMap((week) =>
					week.week_schedule.dates.map((date) => ({
						title: week.week_schedule.practice_place.name,
						group_name: group.group_name,
						available: group.spaces_available,
						max_students: group.max_students,
						group_id: group.group_id.toString(),
						group: (index + 1).toString(),
						start: toExactDate(date.date),
						end: toExactDate(date.date),
						offsiteAddress:
							week.week_schedule.practice_place.type.name ===
							PracticaPlaceTypeName.OFF_SITE
								? week.week_schedule.practice_place.address
								: '',
						campusAddress:
							week.week_schedule.practice_place.type.name ===
							PracticaPlaceTypeName.IN_SITE
								? week.week_schedule.practice_place.address
								: '',
						shift: `${transformTimeToShortFormat(
							week.week_schedule.start_time
						)} - ${transformTimeToShortFormat(week.week_schedule.end_time)}`,
						tutor: date.instructor.name,
						type: week.week_schedule.practice_place.type.name,
						rawDate: transformDateString(date.date, DEFAULT_DATE_FORMAT),
						is_active: group.is_active,
					}))
				)
			);
	};

	const calculateHours = (shift: string): number => {
		const [start, end] = shift.split(' - ').map((time) => {
			const [hours, minutes] = time.split(':').map(Number);
			return hours + minutes / 60;
		});
		return end >= start ? end - start : 24 - start + end;
	};

	const calculateTotalHoursByGroup = (events: CalendarEvent[]) => {
		const groupHours: Record<string, { inSite: number; offSite: number }> = {};

		events.forEach((event) => {
			if (!groupHours[event.group_id]) {
				groupHours[event.group_id] = { inSite: 0, offSite: 0 };
			}
			const hours = calculateHours(event.shift);
			if (event.type === PracticaPlaceTypeName.IN_SITE) {
				groupHours[event.group_id].inSite += hours;
			} else if (event.type === PracticaPlaceTypeName.OFF_SITE) {
				groupHours[event.group_id].offSite += hours;
			}
		});

		return groupHours;
	};

	const addHoursToEvents = (
		events: CalendarEvent[],
		groupHours: Record<string, { inSite: number; offSite: number }>
	): CalendarEvent[] => {
		return events.map((event) => {
			const insite_total_hours = groupHours[event.group_id]?.inSite || 0;
			const offsite_total_hours = groupHours[event.group_id]?.offSite || 0;
			return {
				...event,
				insite_total_hours,
				offsite_total_hours,
			};
		});
	};

	const groupDatesByType = (
		events: CalendarEvent[]
	): Record<
		string,
		{ in_site: DateTypeEvent[]; off_site: DateTypeEvent[] }
	> => {
		const groupedDates: Record<
			string,
			{
				in_site: Array<{ date: string; shift: string; tutor: string }>;
				off_site: Array<{ date: string; shift: string; tutor: string }>;
			}
		> = {};

		events.forEach((event) => {
			const formattedDate = event.rawDate.split('-').reverse().join('-');
			if (!groupedDates[event.group_id]) {
				groupedDates[event.group_id] = { in_site: [], off_site: [] };
			}

			const dateEntry = {
				date: formattedDate,
				shift: event.shift,
				tutor: event.tutor,
			};

			if (event.type === PracticaPlaceTypeName.IN_SITE) {
				groupedDates[event.group_id].in_site.push(dateEntry);
			} else if (event.type === PracticaPlaceTypeName.OFF_SITE) {
				groupedDates[event.group_id].off_site.push(dateEntry);
			}
		});

		return groupedDates;
	};

	const addDatesField = (
		events: CalendarEvent[],
		groupedDates: Record<
			string,
			{ in_site: DateTypeEvent[]; off_site: DateTypeEvent[] }
		>
	): CalendarEvent[] => {
		return events.map((event) => {
			const groupDates = groupedDates[event.group_id];
			return {
				...event,
				dates: {
					in_site: groupDates.in_site,
					off_site: groupDates.off_site,
				},
			};
		});
	};
	const fillAddressesForGroups = (events: CalendarEvent[]): CalendarEvent[] => {
		const groupAddresses: Record<
			string,
			{ offsiteAddress: string | null; campusAddress: string | null }
		> = {};

		events.forEach((event) => {
			const { group_id, offsiteAddress, campusAddress } = event;

			if (!groupAddresses[group_id]) {
				groupAddresses[group_id] = {
					offsiteAddress: null,
					campusAddress: null,
				};
			}

			if (offsiteAddress && !groupAddresses[group_id].offsiteAddress) {
				groupAddresses[group_id].offsiteAddress = offsiteAddress;
			}

			if (campusAddress && !groupAddresses[group_id].campusAddress) {
				groupAddresses[group_id].campusAddress = campusAddress;
			}
		});

		return events.map((event) => {
			const groupAddress = groupAddresses[event.group_id];
			return {
				...event,
				offsiteAddress: groupAddress.offsiteAddress || event.offsiteAddress,
				campusAddress: groupAddress.campusAddress || event.campusAddress,
			};
		});
	};

	const events = transformToCalendarEvents(data);

	const eventsWithAddresses = fillAddressesForGroups(events);
	const groupedDates = groupDatesByType(eventsWithAddresses);
	const groupHours = calculateTotalHoursByGroup(eventsWithAddresses);
	const eventsWithDatesAndHours = addDatesField(
		eventsWithAddresses,
		groupedDates
	);
	return addHoursToEvents(eventsWithDatesAndHours, groupHours);
};
