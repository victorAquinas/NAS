import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { AppLayout } from '../../layouts/AppLayout';
import { MlGroupDetailModal } from '../../components/MlModal/MlGroupDetail';
import { truncateText } from '../../utils/truncateText';
import { useCalendarPage } from './useCalendarPage';
import { UserStatus } from '../../api/types';
import { AtBadge } from '../../components/AtBadge';
import { canShowStatus } from '../../utils/canShowForStatus';
import { FiAlertCircle } from 'react-icons/fi';
import { AtLoadingWrapper } from '../../components/AtLoadingWrapper';
import { MlActionModal } from '../../components/MlModal/MlActionModal';
import { toast } from 'react-toastify';
import { MlInfoModal } from '../../components/MlModal/MlInfoModal';
import { MODAL_TEXT } from '../../constants/text';
const localizer = momentLocalizer(moment);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomEvent: React.FC<any> = ({ event }) => {
	return (
		<div className='text-[0.65rem] p-1 transition duration-200 ease-in-out hover:scale-[1.05]'>
			<p className='font-medium'>{event.title}</p>
			<p>
				{event.shift} -{' '}
				<span className='font-semibold'>{event.group_name}</span>
			</p>
		</div>
	);
};

const CalendarPage = () => {
	const {
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
		isLoading,
		programSemesterId,
		navigate,
		hasGroups,
		handleRequestGroup,
		showGroupConfirmationModal,
		setShowGroupConfirmationModal,
	} = useCalendarPage();
	return (
		<>
			<MlGroupDetailModal
				isOpen={showEventDetailModal}
				onAction={() => {
					if (eventDetail?.group_id) {
						toast.promise(
							handleRequestGroup(
								import.meta.env.VITE_TEST_EMAIL_USER,
								eventDetail?.group_id,
								programSemesterId as string
							),
							{
								pending: 'Requesting group...',
								error: 'Error requesting group',
							}
						);
					}
				}}
				onClose={() => handleCloseEventDetailModal()}
				closeButtonLabel='Close'
				actionButtonLabel='Request'
				event={eventDetail || null}
				variant={userStatus as UserStatus}
			/>

			<MlInfoModal
				isOpen={showGroupConfirmationModal}
				title={MODAL_TEXT.MODAL__INFO_PENDING_TITLE}
				description={MODAL_TEXT.MODAL_INFO_PENDING_DESCRIPTION}
				closeButtonLabel='Close'
				onClose={() => setShowGroupConfirmationModal(false)}
			/>

			<MlActionModal
				isOpen={!isLoading && !hasGroups}
				onAction={() => navigate('/semesters')}
				onClose={() => {}}
				title='Could not find groups '
				description="Please go to semesters to find the groups you're looking for"
				actionButtonLabel='Go to semesters'
				closeButtonLabel=''
			/>

			<AppLayout
				course='Nursing'
				userName='Victor Escalona'
				programSemesterId={programSemesterId as string}
			>
				<AtLoadingWrapper isLoading={isLoading} />
				<h2 className='text-xl font-medium'>Monthly Calendar</h2>
				<p className='text-sm max-w-[50rem]'>
					Easily explore and select available shifts for your clinical
					practices. View days and times at assigned hospitals and manage your
					bookings quickly and effortlessly.
				</p>

				<div className='grid-container min-[1440px]:flex min-[1440px]:justify-between '>
					<div
						className={`opportunities bg-white rounded-md mt-10 h-max pb-6 ${
							canShowStatus(userStatus as UserStatus, [UserStatus.PENDING])
								? 'h-max'
								: ''
						}`}
					>
						<h3 className='font-medium py-4 px-2'>
							{canShowStatus(userStatus as UserStatus, [UserStatus.ACCEPTED])
								? ''
								: 'Opportunities'}

							{canShowStatus(userStatus as UserStatus, [
								UserStatus.ACCEPTED,
							]) && (
								<>
									<AtBadge
										label={`You are in group ${opportunities[0]?.group_name}`}
										variant='info'
									/>
								</>
							)}
						</h3>

						<div
							className={`w-full min-[1440px]:w-[400px] h-[500px] ${
								canShowStatus(userStatus as UserStatus, [
									UserStatus.ACCEPTED,
									UserStatus.PENDING,
								])
									? 'h-max'
									: 'min-[1440px]:h-[600px]'
							}   ${
								canShowStatus(userStatus as UserStatus, [
									UserStatus.ACCEPTED,
									UserStatus.PENDING,
								])
									? 'overflow-y-hidden overflow-x-hidden'
									: 'overflow-y-auto'
							}`}
						>
							<table className='border-collapse border border-slate-500 w-full'>
								<thead>
									<tr>
										<th className='border border-gray-200 bg-gray-100 font-normal text-sm min-[1440px]:text-xs px-3 py-2 sticky top-[-0.1rem]'>
											Group
										</th>
										<th className='border border-gray-200 bg-gray-100 font-normal text-sm min-[1440px]:text-xs px-3 py-2 sticky top-[-0.1rem]'>
											Hospital
										</th>
										<th className='border border-gray-200 bg-gray-100 font-normal text-sm min-[1440px]:text-xs px-3 py-2 sticky top-[-0.1rem]'>
											Shift
										</th>
										<th className='border border-gray-200 bg-gray-100 font-normal text-sm min-[1440px]:text-xs px-3 py-2 sticky top-[-0.1rem]'>
											Tutor
										</th>
									</tr>
								</thead>
								<tbody>
									{opportunities.map((event, index) => (
										<tr
											className={`text-center relative cursor-pointer transition duration-200 ease-in-out hover:scale-[1.05]`}
											style={{ backgroundColor: getBackgroundColor(index + 1) }}
											key={index}
											onClick={() => handleShowEventDetailModal(event)}
										>
											<td className='border border-gray-200 text-sm min-[1440px]:text-xs'>
												{event.group_name}
											</td>
											<td className='border border-gray-200 px-3 text-sm min-[1440px]:text-xxs p-3 min-[1440px]:px-1'>
												<p className='min-[1440px]:text-[0.65rem]'>
													{event.title} ({event.max_students - event.available}/
													{event.max_students})
												</p>
												<p>{truncateText(event.offsiteAddress, 40)}</p>
											</td>
											<td className='border border-gray-200 px-3 text-sm min-[1440px]:text-xxs p-3'>
												{event.shift}
											</td>
											<td className='border border-gray-200 px-3 text-sm min-[1440px]:text-xxs p-3'>
												{event.tutor}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						{canShowStatus(userStatus as UserStatus, [UserStatus.PENDING]) && (
							<div className='p-2'>
								<div className='flex justify-center pt-4'>
									<span className='text-3xl text-cyan-700'>
										<FiAlertCircle />
									</span>
								</div>
								<div className='text-center pt-4 text-cyan-700'>
									Your request to join group {opportunities[0]?.group_name} is
									pending confirmation from the administrator.
								</div>

								<p className='text-center pt-4 text-cyan-700 text-[0.8rem]'>
									You cannot switch groups until your request is either accepted
									or rejected
								</p>
							</div>
						)}
					</div>

					<div className='calendar mt-12 bg-white p-6 min-[1440px]:mt-10 min-[1440px]:ml-8 min-[1440px]:min-w-[calc(100%-400px)] rounded-md'>
						<div className='filter-by-group flex items-center justify-end'>
							<p>Filter by group</p>
							<select
								name='#'
								id='#'
								className='bg-gray-100 p-2 rounded-md ml-4'
								onChange={(e) => filterCalendarByGroup(e.target.value)}
							>
								<option value='all'>Show all groups</option>
								{opportunities?.map((group) => (
									<option key={group.group_name} value={group.group_id}>
										Group {group.group_name}
									</option>
								))}
							</select>
						</div>
						<div className='pt-4'>
							<Calendar
								localizer={localizer}
								events={eventsCopy}
								views={['month', 'agenda']}
								endAccessor='end'
								style={{ height: 800 }}
								defaultDate={new Date(2024, 1, 1)}
								components={{
									event: CustomEvent,
								}}
								eventPropGetter={eventPropGetter}
								showAllEvents
								popup={true}
								onSelectEvent={(event) => handleShowEventDetailModal(event)}
								showMultiDayTimes={false}
							/>
						</div>
					</div>
				</div>
			</AppLayout>
		</>
	);
};

export default CalendarPage;
