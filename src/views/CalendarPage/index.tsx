import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import moment from 'moment';
import events from './events';
import { AppLayout } from '../../layouts/AppLayout';

const localizer = momentLocalizer(moment);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomEvent: React.FC<any> = ({ event }) => {
	return (
		<div className='text-sm p-1 '>
			<p className='font-medium'>{event.title}</p>
			<p>
				{event.shift} - <span className='font-medium'>Group</span>:{' '}
				{event.group}
			</p>
		</div>
	);
};

const CalendarPage = () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const eventPropGetter = (event: any) => {
		let backgroundColor;

		switch (event.group) {
			case '1':
				backgroundColor = '#DFF3EF';
				break;
			case '2':
				backgroundColor = '#E6E6E6';
				break;
			case '3':
				backgroundColor = '#DDF2FF';
				break;
			default:
				backgroundColor = '#9747FF'; // Default color
		}

		return { style: { backgroundColor } };
	};

	return (
		<>
			<AppLayout course='Nursing' userName='Victor Escalona'>
				<h2 className='text-xl font-medium'>Monthly Calendar</h2>
				<p className='text-sm max-w-[50rem]'>
					Easily explore and select available shifts for your clinical
					practices. View days and times at assigned hospitals and manage your
					bookings quickly and effortlessly.
				</p>

				<div className='opportunities bg-white rounded-md mt-10 '>
					<h3 className='font-medium py-4 px-2'>Opportunities</h3>

					<div className='table w-full'>
						<table className='border-collapse border border-slate-500 w-full'>
							<thead>
								<tr>
									<th className='border border-gray-200 bg-gray-100 font-normal text-sm px-3 py-2'>
										Available
									</th>
									<th className='border border-gray-200 bg-gray-100 font-normal text-sm px-3 py-2'>
										Group
									</th>
									<th className='border border-gray-200 bg-gray-100 font-normal text-sm px-3 py-2'>
										Hospital
									</th>
									<th className='border border-gray-200 bg-gray-100 font-normal text-sm px-3 py-2'>
										Time
									</th>
									<th className='border border-gray-200 bg-gray-100 font-normal text-sm px-3 py-2'>
										Instructor
									</th>
								</tr>
							</thead>
							<tbody>
								{Array.from({ length: 5 }).map((_, index) => (
									<tr className='text-center bg-[#FAF8F0]'>
										<td className='border border-gray-200 px-3 text-sm p-3'>
											5
										</td>
										<td className='border border-gray-200 px-3 text-sm p-3'>
											1
										</td>
										<td className='border border-gray-200 px-3 text-sm p-3'>
											<p>Victoria Rehab</p>
											<p>955 NW 3rd St, Miami, FL 33128...</p>
										</td>
										<td className='border border-gray-200 px-3 text-sm p-3'>
											7AM - 7PM
										</td>
										<td className='border border-gray-200 px-3 text-sm p-3'>
											F. Garcia
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div className='calendar mt-12 bg-white p-6'>
					<Calendar
						localizer={localizer}
						events={events}
						startAccessor='start'
						endAccessor='end'
						style={{ height: 800 }}
						defaultDate={new Date(2024, 3, 1)}
						components={{
							event: CustomEvent,
						}}
						eventPropGetter={eventPropGetter}
						showAllEvents
						onShowMore={() => console.log('Ver mas')}
						popup={true}
						onSelectEvent={(event) => console.log('OnSelect', event)}
					/>
				</div>
			</AppLayout>
		</>
	);
};

export default CalendarPage;
