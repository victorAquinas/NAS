import { CalendarEvent } from '../views/CalendarPage/types';

export const getOneEventPerGroup = (events: CalendarEvent[]) => {
	const groupMap = new Map<string, (typeof events)[0]>();

	events.forEach((event) => {
		if (!groupMap.has(event.group)) {
			groupMap.set(event.group, event);
		}
	});

	// Convert the Map values to an array
	return Array.from(groupMap.values());
};
