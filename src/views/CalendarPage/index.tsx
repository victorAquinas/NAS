import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import moment from 'moment';
import events from './events';
import { AppLayout } from '../../layouts/AppLayout';

const localizer = momentLocalizer(moment);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomEvent: React.FC<any> = ({ event }) => {
	return (
		<div className='text-[0.65rem] p-1 '>
			<p className='font-medium'>{event.title}</p>
			<p>
				{event.shift} - <span className='font-medium'>Group</span>:{' '}
				{event.group}
			</p>
		</div>
	);
};

const CalendarPage = () => {
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const eventPropGetter = (event: any) => {
		let backgroundColor;

		switch (event.group) {
			case '1':
				backgroundColor = '#DFF3EF';
				break;
			case '2':
				backgroundColor = '#90CAF9';
				break;
			case '3':
				backgroundColor = '#E9D8A6';
				break;
			case '4':
				backgroundColor = '#94D2BD';
				break;
			case '5':
				backgroundColor = '#FF99C8';
				break;
			default:
				backgroundColor = '#8AC926'; // Default color
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

				<div className='grid-container min-[1440px]:flex min-[1440px]:justify-between '>
					<div className='opportunities bg-white rounded-md mt-10 '>
						<h3 className='font-medium py-4 px-2'>Opportunities</h3>

						<div className='table w-full min-[1440px]:w-[400px] '>
							<table className='border-collapse border border-slate-500 w-full'>
								<thead>
									<tr>
										{/* <th className='border border-gray-200 bg-gray-100 font-normal text-sm min-[1440px]:text-xs px-3 py-2'>
											Free
										</th> */}
										<th className='border border-gray-200 bg-gray-100 font-normal text-sm min-[1440px]:text-xs px-3 py-2'>
											Group
										</th>
										<th className='border border-gray-200 bg-gray-100 font-normal text-sm min-[1440px]:text-xs px-3 py-2'>
											Hospital
										</th>
										<th className='border border-gray-200 bg-gray-100 font-normal text-sm min-[1440px]:text-xs px-3 py-2'>
											Shift
										</th>
										<th className='border border-gray-200 bg-gray-100 font-normal text-sm min-[1440px]:text-xs px-3 py-2'>
											Tutor
										</th>
									</tr>
								</thead>
								<tbody>
									{Array.from({ length: 8 }).map((_, index) => (
										<tr
											className={`text-center`}
											style={{ backgroundColor: getBackgroundColor(index + 1) }}
											key={index}
										>
											<td className='border border-gray-200 text-sm min-[1440px]:text-xs '>
												{index + 1}
											</td>
											<td className='border border-gray-200 px-3 text-sm min-[1440px]:text-xxs p-3 min-[1440px]:px-1'>
												<p className='min-[1440px]:text-[0.65rem]'>
													University Of London Charles (0/9)
												</p>
												<p>955 NW 3rd St, Miami, FL 33128...</p>
											</td>
											<td className='border border-gray-200 px-3 text-sm min-[1440px]:text-xxs p-3'>
												7AM - 7PM
											</td>
											<td className='border border-gray-200 px-3 text-sm min-[1440px]:text-xxs p-3'>
												F. Garcia
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					<div className='calendar mt-12 bg-white p-6 min-[1440px]:mt-10 min-[1440px]:ml-8 min-[1440px]:min-w-[calc(100%-400px)] rounded-md'>
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
				</div>
			</AppLayout>
		</>
	);
};

export default CalendarPage;
