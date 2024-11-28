import { CalendarEvent } from '../../views/CalendarPage/types';

interface AtCalendarEventProps {
	event: CalendarEvent;
}
export const AtCalendarEvent = ({ event }: AtCalendarEventProps) => {
	return (
		<div className='text-[0.65rem] p-1 transition duration-200 ease-in-out hover:scale-[1.02] cursor-pointer calendar-event-container'>
			<p className='font-medium'>{event.title}</p>
			<p>
				{event.shift} -{' '}
				<span className='font-semibold'>{event.group_name}</span>
			</p>
		</div>
	);
};
