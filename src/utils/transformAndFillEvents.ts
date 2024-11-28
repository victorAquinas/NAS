import { Group, PracticaPlaceTypeName } from '../api/types';
import { DEFAULT_DATE_FORMAT } from '../constants/dateSettings';
import { CalendarEvent, DateTypeEvent } from '../views/CalendarPage/types';
import { toExactDate } from './toExactDate';
import { transformDateString } from './transformDateString';
import { transformTimeToShortFormat } from './transformTimeToShortFormat';

export const transformAndFillAddresses = (data: Group[]): CalendarEvent[] => {
	const transformToCalendarEvents = (data: Group[]): CalendarEvent[] => {
		return data.flatMap((group, index) =>
			group.weeks.flatMap((week) =>
				week.week_schedule.dates.map((date) => ({
					title: week.week_schedule.practica_place.name,
					group_name: group.group_name,
					available: group.spaces_available,
					max_students: group.max_students,
					group_id: group.group_id.toString(),
					group: (index + 1).toString(),
					start: toExactDate(date),
					end: toExactDate(date),
					offsiteAddress:
						week.week_schedule.practica_place.type.name ===
						PracticaPlaceTypeName.OFF_SITE
							? week.week_schedule.practica_place.address
							: '',
					campusAddress:
						week.week_schedule.practica_place.type.name ===
						PracticaPlaceTypeName.IN_SITE
							? week.week_schedule.practica_place.address
							: '',
					shift: `${transformTimeToShortFormat(
						week.week_schedule.start_time
					)} - ${transformTimeToShortFormat(week.week_schedule.end_time)}`,
					tutor: week.instructor.name,
					type: week.week_schedule.practica_place.type.name,
					rawDate: transformDateString(date, DEFAULT_DATE_FORMAT),
				}))
			)
		);
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

		// First pass: collect unique addresses for each group
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

		// Second pass: populate missing addresses
		return events.map((event) => {
			const groupAddress = groupAddresses[event.group_id];
			return {
				...event,
				offsiteAddress: groupAddress.offsiteAddress || event.offsiteAddress,
				campusAddress: groupAddress.campusAddress || event.campusAddress,
			};
		});
	};

	// Transform and then fill addresses
	const events = transformToCalendarEvents(data);
	console.log('events', events);
	const eventsWithAddresses = fillAddressesForGroups(events);
	const groupedDates = groupDatesByType(eventsWithAddresses);
	return addDatesField(eventsWithAddresses, groupedDates);
	// return eventsWithAddresses
};
