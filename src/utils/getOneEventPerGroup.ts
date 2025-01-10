import { CalendarEvent } from '../views/CalendarPage/types';

export const getOneEventPerGroup = (events: CalendarEvent[]) => {
	const groupMap = new Map<string, (typeof events)[0]>();

	events.forEach((event) => {
		// if (event.is_active) {

		// }
		if (!groupMap.has(event.group)) {
			groupMap.set(event.group, event);
		}
	});

	// console.log('Events', events);

	return Array.from(groupMap.values());
};
