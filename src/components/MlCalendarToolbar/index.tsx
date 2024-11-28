import { ToolbarProps, View } from 'react-big-calendar';
import { CalendarEvent } from '../../views/CalendarPage/types';
import { LuCalendarDays } from 'react-icons/lu';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const MlCalendarToolbar: React.FC<
	ToolbarProps<CalendarEvent, object>
> = (props) => {
	const goToBack = () => props.onNavigate('PREV');
	const goToNext = () => props.onNavigate('NEXT');
	const goToToday = () => props.onNavigate('TODAY');

	const setView = (view: View) => props.onView(view);

	return (
		<div className='custom-toolbar flex flex-wrap items-center justify-between gap-4 pb-4'>
			<div className='navigation-buttons flex items-center gap-2'>
				<button
					onClick={goToToday}
					className='toolbar-button rounded-md flex items-center p-3 bg-gray-100'
				>
					<span className='text-2xl'>
						<LuCalendarDays />
					</span>{' '}
					Today
				</button>

				<button
					onClick={goToBack}
					className='toolbar-button text-lg p-3 bg-gray-100 rounded-md'
				>
					<FaChevronLeft />
				</button>

				<button
					onClick={goToNext}
					className='toolbar-button text-lg p-3 bg-gray-100 rounded-md'
				>
					<FaChevronRight />
				</button>

				<div className='current-month text-lg px-2 text-center'>
					{props.label}
				</div>
			</div>

			<div className='view-switcher flex items-center gap-2'>
				<button
					className={`toolbar-button rounded-md flex items-center p-3 bg-gray-100 ${
						props.view === 'month' ? 'bg-secondary text-white' : 'bg-gray-100'
					}`}
					onClick={() => setView('month')}
				>
					Month
				</button>
				<button
					className={`toolbar-button rounded-md flex items-center p-3  ${
						props.view === 'agenda' ? 'bg-secondary text-white' : 'bg-gray-100'
					}`}
					onClick={() => setView('agenda')}
				>
					Agenda
				</button>
			</div>
		</div>
	);
};
