import { createRef, RefObject, useRef, useState, useEffect } from 'react';
import AtButton from '../../../components/AtButton';
import { MlActionModal } from '../../../components/MlModal/MlActionModal';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { useAdminGroup } from './useAdminGroup';
import { Group, PracticaPlaceTypeName } from '../../../api/types';
import DatePicker from 'react-datepicker';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { transformDateString } from '../../../utils/transformDateString';
import moment from 'moment';
import { AtInputTime } from './components/AtInputTime';
import { transformDateStringToTime } from '../../../utils/transformDateStringToTime';
import { MdOutlineDelete } from 'react-icons/md';
import { FaRegCalendarXmark } from 'react-icons/fa6';
import { LuCalendarPlus } from 'react-icons/lu';
import { AtSelectCoordinator } from './components/AtSelectCoordinator';
import { Controller } from 'react-hook-form';

import Select from 'react-select';
import { AtInputDate } from './components/AtInputDate';
import { CgChevronRight } from 'react-icons/cg';
import { toast } from 'react-toastify';
import { AtLoadingWrapper } from '../../../components/AtLoadingWrapper';
import AtInputGroup from './components/AtInputGroup';

const AdminGroup = () => {
	const {
		isAddGroupModalOpen,
		handleCloseAddGroupModal,
		handleOpenAddGroupModal,
		groups,
		coordinators,
		places,
		handleUpdateGroup,
		inSitePlaces,
		offSitesPlaces,
		handleCreateDayInWeek,
		handleDeleteDayInWeek,
		handleCreateWeek,
		handleDeleteWeek,
		handleDesactivateGroup,
		onSubmit,
		register,
		handleSubmit,
		setValue,
		control,
		errors,
		handleShowDeleteGroupModal,
		handleCloseDeleteGroupModal,
		groupIdToDelete,
		showDeleteGroupModal,
		isLoading,
		isCreatingGroup,
		isDeletingGroup,
		hasActiveGroup,
	} = useAdminGroup();

	const groupNameRefs = useRef<{
		[groupId: number]: RefObject<HTMLInputElement>;
	}>({});
	const maxStudentsRefs = useRef<{
		[groupId: number]: RefObject<HTMLInputElement>;
	}>({});
	const timeRefs = useRef<{
		[key: string]: RefObject<HTMLInputElement>;
	}>({});

	const dateRefs = useRef<{
		[groupId: number]: {
			[weekId: number]: RefObject<HTMLInputElement>[];
		};
	}>({});

	const instructorRefs = useRef<{
		[groupId: number]: {
			[weekId: number]: RefObject<HTMLSelectElement>[];
		};
	}>({});

	const groupLocationRefs = useRef<{
		[groupId: number]: {
			[weekId: number]: RefObject<HTMLSelectElement>[];
		};
	}>({});

	const [selectedDates, setSelectedDates] = useState<Record<string, Date>>({});

	groups.forEach((group) => {
		if (!groupNameRefs.current[group.group_id]) {
			groupNameRefs.current[group.group_id] = createRef();
		}
		if (!maxStudentsRefs.current[group.group_id]) {
			maxStudentsRefs.current[group.group_id] = createRef();
		}

		const placesMap = group.weeks.reduce((acc, week) => {
			const place = week.week_schedule.practice_place;
			const placeId = place.id;
			if (!acc[placeId]) {
				acc[placeId] = { weeks: [] };
			}
			acc[placeId].weeks.push(week);
			return acc;
		}, {} as Record<number, { weeks: Group['weeks'] }>);

		Object.entries(placesMap).forEach(([placeId, placeData]) => {
			const timeKey = `${group.group_id}-${placeId}`;
			if (!timeRefs.current[timeKey]) {
				timeRefs.current[timeKey] = createRef();
			}

			placeData.weeks.forEach((week) => {
				if (!dateRefs.current[group.group_id]) {
					dateRefs.current[group.group_id] = {};
				}
				if (!dateRefs.current[group.group_id][week.week_id]) {
					dateRefs.current[group.group_id][week.week_id] = [];
				}

				if (!instructorRefs.current[group.group_id]) {
					instructorRefs.current[group.group_id] = {};
				}
				if (!instructorRefs.current[group.group_id][week.week_id]) {
					instructorRefs.current[group.group_id][week.week_id] = [];
				}

				if (!groupLocationRefs.current[group.group_id]) {
					groupLocationRefs.current[group.group_id] = {};
				}
				if (!groupLocationRefs.current[group.group_id][week.week_id]) {
					groupLocationRefs.current[group.group_id][week.week_id] = [];
				}

				week.week_schedule.dates.forEach((_, dateIndex) => {
					if (!dateRefs.current[group.group_id][week.week_id][dateIndex]) {
						dateRefs.current[group.group_id][week.week_id][dateIndex] =
							createRef();
					}
					if (
						!instructorRefs.current[group.group_id][week.week_id][dateIndex]
					) {
						instructorRefs.current[group.group_id][week.week_id][dateIndex] =
							createRef();
					}

					if (
						!groupLocationRefs.current[group.group_id][week.week_id][dateIndex]
					) {
						groupLocationRefs.current[group.group_id][week.week_id][dateIndex] =
							createRef();
					}
				});
			});
		});
	});

	useEffect(() => {
		const initialDates: Record<string, Date> = {};
		groups.forEach((group) => {
			group.weeks.forEach((week) => {
				week.week_schedule.dates.forEach((d, i) => {
					const key = `${group.group_id}-${week.week_id}-${i}`;
					initialDates[key] = moment(
						transformDateString(d.date, 'YYYY/MM/DD')
					).toDate();
				});
			});
		});
		setSelectedDates(initialDates);
	}, [groups]);

	const inputRef = useRef<HTMLInputElement>(null);
	const maxStudentsRef = useRef<HTMLInputElement>(null);

	return (
		<AdminLayout>
			<MlActionModal
				isOpen={isAddGroupModalOpen}
				title='Add a group'
				styles={{ height: '83vh' }}
			>
				<form
					id='form-id'
					className='flex flex-col gap-4 mt-4'
					onSubmit={handleSubmit(onSubmit)}
				>
					<input
						type='text'
						{...register('group_name')}
						placeholder='Group Name'
						className='w-full h-full bg-white p-3 py-2 placeholder:text-[#807f7f] font-normal rounded-md border border-gray-400'
					/>
					{errors.group_name && (
						<p className='text-red-500'>{errors.group_name.message}</p>
					)}
					<div className='two-columns flex items-center gap-x-[1%]'>
						<div className='left w-[49%]'>
							<Controller
								name='start_date'
								control={control}
								rules={{ required: 'Start date is required' }}
								render={({ field }) => (
									<AtInputDate
										{...field}
										placeholder='Start date'
										className='w-full'
										wrapperClassName='w-full'
										onChangeSelect={(value) => {
											field.onChange(transformDateString(value, 'YYYY-MM-DD'));
										}}
									/>
								)}
							/>

							{errors.start_date && (
								<p className='text-red-500'>{errors.start_date.message}</p>
							)}
						</div>
						<div className='right w-[49%]'>
							<Controller
								name='end_date'
								control={control}
								rules={{ required: 'Start date is required' }}
								render={({ field }) => (
									<AtInputDate
										{...field}
										placeholder='End date'
										className='w-full'
										wrapperClassName='w-full'
										onChangeSelect={(value) => {
											field.onChange(transformDateString(value, 'YYYY-MM-DD'));
										}}
									/>
								)}
							/>
							{errors.end_date && (
								<p className='text-red-500'>{errors.end_date.message}</p>
							)}
						</div>
					</div>

					<div className='two-columns flex items-center gap-x-[1%]'>
						<div className='left w-[49%]'>
							<Controller
								name='default_start_time'
								control={control}
								rules={{ required: 'Shift start time is required' }}
								render={({ field }) => (
									<AtInputTime
										{...field}
										placeholder='Shift start time'
										selectedTime={''}
										className='!w-full'
										wrapperClassName='!w-full'
										onChangeSelect={(e) => {
											field.onChange(transformDateStringToTime(e));
										}}
									/>
								)}
							/>

							{errors.default_start_time && (
								<p className='text-red-500'>
									{errors.default_start_time.message}
								</p>
							)}
						</div>
						<div className='right w-[49%]'>
							<Controller
								name='default_end_time'
								control={control}
								rules={{ required: 'Shift start time is required' }}
								render={({ field }) => (
									<AtInputTime
										{...field}
										placeholder='Shift start time'
										selectedTime={''}
										className='!w-full'
										wrapperClassName='!w-full'
										onChangeSelect={(e) => {
											field.onChange(transformDateStringToTime(e));
										}}
									/>
								)}
							/>
							{errors.default_end_time && (
								<p className='text-red-500'>
									{errors.default_end_time.message}
								</p>
							)}
						</div>
					</div>
					<input
						type='text'
						{...register('max_students')}
						placeholder='Maximum students per group'
						className=' w-full h-full bg-white p-3 py-2 placeholder:text-[#807f7f] font-normal rounded-md border border-gray-400'
					/>
					{errors.max_students && (
						<p className='text-red-500'>{errors.max_students.message}</p>
					)}

					<Controller
						name='default_instructor_id'
						control={control}
						rules={{ required: 'Required' }}
						render={({ field }) => (
							<Select
								{...field}
								styles={{
									control: (baseStyles, state) => ({
										...baseStyles,
										borderColor: state.isFocused ? 'grey' : '#b1b6c0',
									}),
								}}
								options={coordinators.map((coordinator) => ({
									label: coordinator.name,
									value: coordinator.id,
								}))}
								placeholder='Select Coordinator'
								className='w-full h-full bg-white !placeholder:text-[#807f7f] !font-normal rounded-md'
								onChange={(selected) => {
									field.onChange(selected ? selected : null);
								}}
							/>
						)}
					/>
					{errors.default_instructor_id && (
						<p className='text-red-500'>
							{errors.default_instructor_id.message}
						</p>
					)}
					<input
						type='text'
						{...register('verity_group_id')}
						placeholder='Verity ID'
						className=' w-full h-full bg-white p-3 py-2 placeholder:text-[#807f7f] font-normal rounded-md border border-gray-400'
					/>
					{errors.verity_group_id && (
						<p className='text-red-500'>{errors.verity_group_id.message}</p>
					)}
					<Controller
						name='in_days'
						control={control}
						rules={{ required: 'Days of the week for practices are required' }}
						render={({ field }) => (
							<Select
								{...field}
								options={[
									{ label: 'Monday', value: 'MONDAY' },
									{ label: 'Tuesday', value: 'TUESDAY' },
									{ label: 'Wednesday', value: 'WEDNESDAY' },
									{ label: 'Thursday', value: 'THURSDAY' },
									{ label: 'Friday', value: 'FRIDAY' },
									{ label: 'Saturday', value: 'SATURDAY' },
									{ label: 'Sunday', value: 'SUNDAY' },
								]}
								isMulti
								placeholder='Days of practices per week'
								className='w-full h-full bg-white !placeholder:text-[#807f7f] !font-normal rounded-md'
								onChange={(selected) => {
									field.onChange(
										selected ? selected.map((option) => option.value) : []
									);
								}}
								value={field.value?.map((day) => ({
									label:
										day.charAt(0).toUpperCase() + day.slice(1).toLowerCase(),
									value: day,
								}))}
							/>
						)}
					/>

					{errors.in_days && (
						<p className='text-red-500'>{errors.in_days.message}</p>
					)}

					<hr />
					<div className='in-site flex flex-col gap-4 pb-4'>
						<div className='form-subtitle'>
							<h3 className='text-xl font-medium py-2'>Off-site</h3>
						</div>

						<Controller
							name='default_offsite_practice_place_id'
							control={control}
							rules={{ required: 'Required' }}
							render={({ field }) => (
								<Select
									{...field}
									options={places[0]?.available_places
										.filter((place) => {
											return place.type.name === 'Off-Site';
										})
										.map((place) => ({
											label: place.name,
											value: place.id,
										}))}
									placeholder='Select Off-site place'
									className='w-full h-full bg-white !placeholder:text-[#807f7f] !font-normal rounded-md'
									onChange={(selected) => {
										field.onChange(selected ? selected : null);
									}}
								/>
							)}
						/>

						{errors.default_offsite_practice_place_id && (
							<p className='text-red-500'>
								{errors.default_offsite_practice_place_id.message}
							</p>
						)}
						<input
							type='text'
							{...register('offsite_num_weeks_for_generate')}
							placeholder='Number of weeks to create'
							className=' w-full h-full bg-white p-3 py-2 placeholder:text-[#807f7f] font-normal rounded-md border border-gray-400'
						/>
						{errors.offsite_num_weeks_for_generate && (
							<p className='text-red-500'>
								{errors.offsite_num_weeks_for_generate.message}
							</p>
						)}
					</div>
					<hr />
					<div className='in-site flex flex-col gap-4'>
						<div className='form-subtitle'>
							<h3 className='text-xl font-medium py-2'>In-site</h3>
						</div>

						<Controller
							name='default_insite_practice_place_id'
							control={control}
							rules={{ required: 'Required' }}
							render={({ field }) => (
								<Select
									{...field}
									options={places[0]?.available_places
										.filter((place) => {
											return place.type.name === 'In-Site';
										})
										.map((place) => ({
											label: place.name,
											value: place.id,
										}))}
									placeholder='Select In-site place'
									className='w-full h-full bg-white !placeholder:text-[#807f7f] !font-normal rounded-md'
									onChange={(selected) => {
										field.onChange(selected ? selected : null);
									}}
								/>
							)}
						/>

						{errors.default_insite_practice_place_id && (
							<p className='text-red-500'>
								{errors.default_insite_practice_place_id.message}
							</p>
						)}
						<input
							type='number'
							{...register('insite_num_weeks_for_generate')}
							placeholder='Number of weeks to create'
							onChange={(e) => {
								const val = parseInt(e.target.value);
								setValue('insite_num_weeks_for_generate', val);
							}}
							className=' w-full h-full bg-white p-3 py-2 placeholder:text-[#807f7f] font-normal rounded-md border border-gray-400'
						/>
						{errors.insite_num_weeks_for_generate && (
							<p className='text-red-500'>
								{errors.insite_num_weeks_for_generate.message}
							</p>
						)}
					</div>
					<div className='flex items-center justify-center gap-6 w-full'>
						<AtButton
							variant='transparent'
							className='flex items-center mt-6'
							onClick={handleCloseAddGroupModal}
							isLoading={isCreatingGroup}
						>
							Close
						</AtButton>

						<AtButton
							variant='primary'
							className='flex items-center mt-6'
							type='submit'
							isLoading={isCreatingGroup}
						>
							Add Group
							<span className='text-2xl'>
								{' '}
								<CgChevronRight />
							</span>
						</AtButton>
					</div>
				</form>
			</MlActionModal>

			<MlActionModal
				isOpen={showDeleteGroupModal}
				onAction={() => {
					toast.promise(
						handleDesactivateGroup(groupIdToDelete),
						{
							success: 'Group deleted',
							error: 'Error',
							pending: 'Deleting group',
						},
						{
							autoClose: 500,
						}
					);
				}}
				isLoading={isDeletingGroup}
				onClose={handleCloseDeleteGroupModal}
				title='Are you sure you want to delete this group?'
				description='This action cannot be undone.'
				closeButtonLabel='Cancel'
				actionButtonLabel='Delete'
				variant='danger'
			></MlActionModal>

			<AtLoadingWrapper isLoading={isLoading} />
			<h2 className='text-xl font-medium'>Dental Assistant</h2>
			<ul className='sub-menu flex items-center w-full gap-x-4 mt-6 border-b border-gray-300'>
				<li className='border-b border-b-primary text-primary'>Groups</li>
				<li>Applications</li>
			</ul>

			{/* If there are groups */}
			<div className='group-list mt-4'>
				<div className='group-container pt-6'>
					{!hasActiveGroup && (
						<div className='content flex justify-center flex-col items-center mt-60'>
							<h2 className='text-xl font-medium'>No Groups Found</h2>
							<p className='text-sm max-w-[40rem] text-center'>
								It seems you haven’t created any groups yet.
							</p>
							<p className='text-sm max-w-[40rem] text-center'>
								Get started by clicking the "Add New Group" button to create
								your first group!
							</p>
						</div>
					)}
					{groups.map((group) => {
						const placesMap: {
							[placeId: number]: {
								type: 'in-site' | 'off-site';
								name: string;
								address: string;
								weeks: Group['weeks'];
								shift: string;
								place_id: number;
								shift_start_time: string;
								shift_end_time: string;
							};
						} = {};

						group.weeks.forEach((week) => {
							const place = week.week_schedule.practice_place;
							const placeId = place.id;
							const placeType: 'in-site' | 'off-site' =
								place.type.name === PracticaPlaceTypeName.IN_SITE
									? 'in-site'
									: 'off-site';

							const startTime = week.week_schedule.start_time;
							const endTime = week.week_schedule.end_time;
							const shift = `${startTime} - ${endTime}`;

							if (!placesMap[placeId]) {
								placesMap[placeId] = {
									type: placeType,
									name: place.name,
									address: place.address,
									weeks: [],
									shift,
									place_id: place.id,
									shift_start_time: week.week_schedule.start_time,
									shift_end_time: week.week_schedule.end_time,
								};
							}

							placesMap[placeId].weeks.push(week);
						});

						const my_group = Object.entries(placesMap)
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							.map(([_, place]) => {
								return {
									place_id: place.place_id,
									type: place.type,
									name: place.name,
									address: place.address,
									shift: place.shift,
									shift_start_time: place.shift_start_time,
									shift_end_time: place.shift_end_time,
									weeks: place.weeks,
								};
							})
							.sort((a, b) => {
								if (a.type === 'off-site' && b.type === 'in-site') {
									return -1;
								}
								if (a.type === 'in-site' && b.type === 'off-site') {
									return 1;
								}
								return 0;
							});

						return (
							<>
								{group.is_active && (
									<div
										key={group.group_id}
										className='mb-16 bg-white shadow-md rounded-md py-4 px-3 border border-gray-300'
									>
										<div className='group-header flex items-center mb-4'>
											<div className='group-name max-w-[300px]'>
												<AtInputGroup
													type='text'
													placeholder='Group Name'
													className='w-full h-full bg-white p-3 py-2 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
													defaultValue={group.group_name}
													ref={inputRef}
													onUpdate={(value) =>
														handleUpdateGroup(
															group.group_id,
															'name',
															value,
															'group'
														)
													}
													toastMessages={{
														success: 'Group name updated',
														error: 'Error',
														pending: 'Updating group name',
													}}
												/>
											</div>

											<div className='max-students flex items-center pl-4'>
												<div className='w-[8rem]'> Max Students</div>
												<div>
													<AtInputGroup
														type='text'
														placeholder='Ex: 10'
														className=' w-full h-full bg-white p-3 py-2 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
														defaultValue={group.max_students}
														ref={maxStudentsRef}
														onUpdate={(value) =>
															handleUpdateGroup(
																group.group_id,
																'max_students',
																value,
																'group'
															)
														}
														toastMessages={{
															success: 'Max students updated',
															error: 'Error',
															pending: 'Updating max students',
														}}
													/>
												</div>
											</div>

											<div className='delete-group pl-12'>
												<AtButton
													variant='danger'
													onClick={() =>
														handleShowDeleteGroupModal(group.group_id)
													}
												>
													Delete group
												</AtButton>
											</div>
										</div>
										<div className='group-section flex flex-col gap-y-8 xl:flex-row xl:gap-x-8 pb-8 '>
											{my_group.map((currentGroup) => {
												const placeData = currentGroup;
												return (
													<>
														<div
															className='group w-full xl:w-1/2'
															key={placeData.place_id}
														>
															<div
																className={`group-card shadow-md border-2 bg-white rounded-md pb-8`}
															>
																<div className='header flex relative flex-col'>
																	<div
																		className={`pr-2 pb-6 text-2xl rounded-tl-md rounded-tr-md font-medium w-full ${
																			placeData.type === 'in-site'
																				? 'bg-blue-600 text-white '
																				: 'bg-primary '
																		} p-4 lg:p-8 mb-6`}
																	>
																		{placeData.type === 'in-site'
																			? 'IN-SITE'
																			: 'OFF-SITE'}
																	</div>
																	<div className='right px-4 lg:px-8'>
																		<div className='flex items-center w-full pb-2'>
																			<AtInputTime
																				selectedTime={
																					placeData?.weeks[0]?.week_schedule
																						?.start_time
																				}
																				tooltipId={`${Math.random()}_start_time`}
																				tooltipContent='Shift start time'
																				onChangeSelect={async (e) => {
																					const weeksScheduleIds =
																						placeData.weeks.map(
																							(week) =>
																								week.week_schedule
																									.week_schedule_id
																						);

																					const shiftStartTimeLoading =
																						toast.loading('Creating group...');
																					toast.update(shiftStartTimeLoading, {
																						render: 'Updating shift start time',
																						type: 'info',
																						isLoading: false,
																					});

																					try {
																						await Promise.all(
																							weeksScheduleIds.map(
																								(weekScheduleId) =>
																									handleUpdateGroup(
																										weekScheduleId,
																										'start_time',
																										transformDateStringToTime(
																											e
																										),
																										'week_schedule'
																									)
																							)
																						);

																						toast.update(
																							shiftStartTimeLoading,
																							{
																								render:
																									'Shift start time updated',
																								type: 'success',
																								isLoading: false,
																								autoClose: 500,
																							}
																						);
																					} catch (error) {
																						console.error(error);
																						toast.update(
																							shiftStartTimeLoading,
																							{
																								render: 'Error',
																								type: 'error',
																								isLoading: false,
																								autoClose: 500,
																							}
																						);
																					}
																				}}
																			/>

																			<div className='px-2'>-</div>

																			<AtInputTime
																				selectedTime={
																					placeData?.weeks[0]?.week_schedule
																						?.end_time
																				}
																				tooltipId={`${Math.random()}_end_time`}
																				tooltipContent='Shift end time'
																				onChangeSelect={async (e) => {
																					const weeksScheduleIds =
																						placeData.weeks.map(
																							(week) =>
																								week.week_schedule
																									.week_schedule_id
																						);
																					const shiftEndTimeLoading =
																						toast.loading('Creating group...');
																					toast.update(shiftEndTimeLoading, {
																						render: 'Updating shift end time',
																						type: 'info',
																						isLoading: false,
																					});
																					try {
																						await Promise.all(
																							weeksScheduleIds.map(
																								(weekScheduleId) =>
																									handleUpdateGroup(
																										weekScheduleId,
																										'end_time',
																										transformDateStringToTime(
																											e
																										),
																										'week_schedule'
																									)
																							)
																						);

																						toast.update(shiftEndTimeLoading, {
																							render: 'Shift end time updated',
																							type: 'success',
																							isLoading: false,
																							autoClose: 500,
																						});
																					} catch (error) {
																						console.error(error);
																						toast.update(shiftEndTimeLoading, {
																							render: 'Error',
																							type: 'error',
																							isLoading: false,
																							autoClose: 500,
																						});
																					}
																				}}
																			/>
																		</div>
																	</div>
																	<div className='left px-4 lg:px-8'>
																		<div className='title text-primary font-medium lg:text-lg '>
																			<div className='py-2'>
																				{placeData.place_id &&
																					places?.[0]?.available_places.length >
																						0 && (
																						<select
																							className='w-full h-full bg-white p-1 placeholder:text-gray-400 font-normal rounded-md border border-gray-400 lg:text-lg'
																							defaultValue={placeData.place_id}
																							onChange={(e) => {
																								const weeksScheduleIds =
																									placeData.weeks.map(
																										(week) =>
																											week.week_schedule
																												.week_schedule_id
																									);
																								weeksScheduleIds.forEach(
																									(weeksScheduleId) => {
																										handleUpdateGroup(
																											weeksScheduleId,
																											'practice_place_id',
																											e.target.value,
																											'week_schedule'
																										);
																									}
																								);
																							}}
																						>
																							<option disabled>
																								Select location
																							</option>
																							{(placeData.type === 'in-site'
																								? inSitePlaces
																								: offSitesPlaces
																							).map((place) => (
																								<option
																									value={place.id}
																									key={place.id}
																								>
																									{place.name}
																								</option>
																							))}
																						</select>
																					)}
																			</div>
																		</div>
																		<div className='text-sm lg:text-base'>
																			{placeData.address}
																		</div>
																	</div>
																</div>

																<div className='group-weeks mt-10 flex flex-col gap-y-6 relative px-4 lg:px-8'>
																	{placeData.weeks.map((week) => {
																		return (
																			<div
																				key={week.week_id}
																				className='week-card border border-black rounded-md flex relative'
																			>
																				{placeData.weeks.length > 1 && (
																					<AtButton
																						tooltipId={`${Math.random()}_delete_week`}
																						tooltipContent='Delete week'
																						variant='no-style'
																						className='delete-week text-3xl absolute top-[-0.8rem] left-[-0.5rem] text-red_primary bg-white flex items-center justify-center rounded-full '
																						onClick={() =>
																							toast.promise(
																								handleDeleteWeek(
																									group.group_id,
																									week.week_id
																								),
																								{
																									success: 'Week deleted',
																									error: 'Error deleting week',
																									pending: 'Deleting week',
																								},
																								{
																									autoClose: 500,
																								}
																							)
																						}
																					>
																						<FaRegCalendarXmark />
																					</AtButton>
																				)}
																				<div className='week-number flex-col flex justify-center items-center w-[100px] border-r border-black p-2 lg:text-lg'>
																					Week
																					<input
																						type='number'
																						min={0}
																						defaultValue={week.week_number}
																						placeholder='Week'
																						onBlur={(e) => {
																							toast.promise(
																								handleUpdateGroup(
																									week.week_id,
																									'week_number',
																									e.target.value,
																									'week'
																								),
																								{
																									success:
																										'Week number updated',
																									error: 'Error ',
																									pending:
																										'Updating week number',
																								},
																								{
																									autoClose: 500,
																								}
																							);
																						}}
																						className=' w-full flex  h-[30px] bg-white px-1 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
																					/>
																				</div>
																				<div className='week-rows p-2 w-full gap-y-2 flex flex-col lg:p-5'>
																					{week.week_schedule.dates.map(
																						(datePlace, dateIndex) => {
																							const dateKey = `${group.group_id}-${week.week_id}-${dateIndex}`;
																							const currentSelectedDate =
																								selectedDates[dateKey];

																							return (
																								<div
																									key={dateIndex}
																									className='week-row flex items-center px-2 gap-x-4'
																								>
																									<div className='w-1/2'>
																										<DatePicker
																											placeholderText='Date'
																											wrapperClassName='w-full'
																											className='w-full h-full bg-white p-1 placeholder:text-gray-950 font-normal rounded-md border border-gray-400 lg:text-lg'
																											selected={
																												currentSelectedDate
																											}
																											onChange={(
																												selectedDate
																											) => {
																												if (!selectedDate)
																													return;

																												toast.promise(
																													handleUpdateGroup(
																														datePlace.day_id,
																														'date',
																														transformDateString(
																															selectedDate.toISOString(),
																															'YYYY-MM-DD'
																														),
																														'day'
																													),
																													{
																														success:
																															'Date updated',
																														error: 'Error',
																														pending:
																															'Updating date',
																													},
																													{
																														autoClose: 500,
																													}
																												);
																												setSelectedDates(
																													(prev) => {
																														return {
																															...prev,
																															[dateKey]:
																																selectedDate,
																														};
																													}
																												);
																											}}
																										/>
																									</div>
																									<div className='w-1/2 flex items-center'>
																										<AtSelectCoordinator
																											coordinators={
																												coordinators
																											}
																											defaultValue={datePlace.instructor.id.toString()}
																											onChangeSelect={(e) => {
																												toast.promise(
																													handleUpdateGroup(
																														datePlace.day_id,
																														'instructor_id',
																														e,
																														'day'
																													),
																													{
																														success:
																															'Coordinator updated',
																														error: 'Error',
																														pending:
																															'Updating coordinator',
																													},
																													{
																														autoClose: 500,
																													}
																												);
																											}}
																										/>
																										<AtButton
																											variant='no-style'
																											className='text-3xl !pl-4'
																											onClick={() =>
																												toast.promise(
																													handleDeleteDayInWeek(
																														week.week_schedule
																															.week_schedule_id,
																														datePlace.day_id
																													),
																													{
																														success:
																															'Day deleted',
																														error:
																															'Error deleting day',
																														pending:
																															'Deleting day',
																													},
																													{
																														autoClose: 500,
																													}
																												)
																											}
																											tooltipId={`${Math.random()}_delete_day`}
																											tooltipContent={`Delete day`}
																										>
																											<MdOutlineDelete className='text-red_primary' />
																										</AtButton>
																									</div>
																								</div>
																							);
																						}
																					)}
																					<div className=' text-primary flex justify-center pt-2'>
																						<AtButton
																							variant='no-style'
																							onClick={() =>
																								toast.promise(
																									handleCreateDayInWeek(
																										week.week_schedule
																											.week_schedule_id
																									),
																									{
																										success: 'Day created',
																										error: 'Error creating day',
																										pending: 'Creating day',
																									},
																									{
																										autoClose: 500,
																									}
																								)
																							}
																							tooltipId={`${Math.random()}_add_day`}
																							className='flex items-center !text-sm'
																							tooltipContent='Add new day to the week'
																						>
																							Add day
																							<span className='text-2xl pl-2'>
																								<IoIosAddCircleOutline />
																							</span>
																						</AtButton>
																					</div>
																				</div>
																			</div>
																		);
																	})}
																</div>
																<div className='add-week-btn text-primary flex justify-center pt-6'>
																	<AtButton
																		variant='primary'
																		className='text-sm flex items-center'
																		onClick={() =>
																			toast.promise(
																				handleCreateWeek(
																					group.group_id,
																					placeData.type === 'in-site'
																						? true
																						: false
																				),
																				{
																					success: 'Week created',
																					error: 'Error creating week',
																					pending: 'Creating week',
																				},
																				{
																					autoClose: 500,
																				}
																			)
																		}
																	>
																		<span className='pr-2'>Add new week</span>{' '}
																		<LuCalendarPlus className='text-xl ' />
																	</AtButton>
																</div>
															</div>
														</div>
													</>
												);
											})}
										</div>
									</div>
								)}
							</>
						);
					})}
				</div>

				<div className='add-new-section flex justify-center py-4 pb-16 '>
					<AtButton variant='primary' onClick={handleOpenAddGroupModal}>
						Add New Group
					</AtButton>
				</div>
			</div>
		</AdminLayout>
	);
};

export default AdminGroup;
