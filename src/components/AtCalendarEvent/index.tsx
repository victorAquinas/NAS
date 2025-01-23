import { CalendarEvent } from '../../views/CalendarPage/types';
import { PracticaPlaceTypeName } from '../../api/types';

interface AtCalendarEventProps {
	event: CalendarEvent;
}
export const AtCalendarEvent = ({ event }: AtCalendarEventProps) => {
	return (
		<div
			className={`text-[0.65rem] p-1 transition duration-200 ease-in-out hover:scale-[1.02] cursor-pointer calendar-event-container`}
		>
			<p
				className={`font-medium text-xxs  w-max px-1 rounded-sm ${
					event.type === PracticaPlaceTypeName.IN_SITE
						? 'bg-yellow-500 text-secondary'
						: 'bg-secondary text-white'
				} `}
			>
				{event.type}
			</p>
			<p className='font-semibold'>{event.group_name}</p>
			<p>{event.shift}</p>
		</div>
	);
};
