import { createRef, RefObject, useRef, useEffect } from 'react';
import AtButton from '../../../components/AtButton';
import { MlActionModal } from '../../../components/MlModal/MlActionModal';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { useAdminGroup } from './useAdminGroup';
import {
	Group,
	PracticaPlaceTypeName,
	SelectOptionDescription,
} from '../../../api/types';
import DatePicker from 'react-datepicker';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { transformDateString } from '../../../utils/transformDateString';
import moment from 'moment';
import { AtInputTime } from './components/AtInputTime';
import { transformDateStringToTime } from '../../../utils/transformDateStringToTime';
import { LuCalendarPlus } from 'react-icons/lu';
import { Controller } from 'react-hook-form';

import Select, {
	GroupBase,
	OptionProps,
	SingleValueProps,
	StylesConfig,
} from 'react-select';
import { AtInputDate } from './components/AtInputDate';
import { CgChevronRight } from 'react-icons/cg';
import { AtLoadingWrapper } from '../../../components/AtLoadingWrapper';
import AtInputGroup from './components/AtInputGroup';
import { Link } from 'react-router-dom';
import AtBreadcrumb from '../../../components/AtBreadCrumb';
import { Tooltip } from 'react-tooltip';
import { AtAlert } from '../../../components/AtAlert';
import MlWeekSchedule from './components/MlWeekSchedule';

const CustomOption = ({
	data,
	innerRef,
	innerProps,
}: OptionProps<
	SelectOptionDescription,
	false,
	GroupBase<SelectOptionDescription>
>) => {
	return (
		<div
			ref={innerRef}
			{...innerProps}
			className='cursor-pointer option p-2 hover:bg-gray-100 border-b border-gray-300'
		>
			<div className='font-semibold text-gray-800'>{data.label}</div>
			<div className='text-sm text-gray-500'>{data.description}</div>
		</div>
	);
};

const CustomSingleValue = ({
	data,
}: SingleValueProps<
	SelectOptionDescription,
	false,
	GroupBase<SelectOptionDescription>
>) => {
	return (
		<div className='flex flex-col single-value'>
			<span className='font-semibold text-gray-800'>{data.label}</span>
			<span className='text-sm text-gray-500'>{data.description}</span>
		</div>
	);
};

// Custom Styles to fix white space issue
const customStyles: StylesConfig<SelectOptionDescription, false> = {
	valueContainer: (provided) => ({
		...provided,
		display: 'flex',
		padding: '0.5312rem', // Adjusts padding inside the selected value container
	}),
};

const AdminGroup = () => {
	const {
		isAddGroupModalOpen,
		handleCloseAddGroupModal,
		handleOpenAddGroupModal,
		groups,
		coordinators,
		handleUpdateGroup,
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
		programSemesterId,
		locationId,
		semesterId,
		location,
		inSiteOptions,
		offsiteOptions,
		handlePublishCourse,
		maxEnrollmentDate,
		isPublished,
		handleUpdateMaxEnrollmentDate,
		setShowReleaseModal,
		showReleaseModal,
		handleCreateGroup,
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
	}, [groups]);

	const inputRef = useRef<HTMLInputElement>(null);
	const maxStudentsRef = useRef<HTMLInputElement>(null);

	const breadcrumbItems = [
		{ label: 'Locations', link: '/admin/locations' },
		{ label: 'Semesters', link: `/admin/semester/${locationId}` },
		{
			label: 'Courses',
			link: `/admin/courses/${programSemesterId}/semester/${semesterId}/location/${locationId}`,
		},
		{ label: 'Groups' },
	];

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
								rules={{ required: 'Shift end time is required' }}
								render={({ field }) => (
									<AtInputTime
										{...field}
										placeholder='Shift end time'
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
									// options={places[0]?.available_places
									// 	.filter((place) => {
									// 		return place.type.name === 'Off-Site';
									// 	})
									// 	.map((place) => ({
									// 		label: place.name,
									// 		value: place.id,
									// 	}))}
									components={{
										Option: CustomOption,
										SingleValue: CustomSingleValue,
									}}
									styles={customStyles}
									options={offsiteOptions}
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
									components={{
										Option: CustomOption,
										SingleValue: CustomSingleValue,
									}}
									styles={customStyles}
									options={inSiteOptions}
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
					handleDesactivateGroup(groupIdToDelete);
				}}
				isLoading={isDeletingGroup}
				onClose={handleCloseDeleteGroupModal}
				title='Are you sure you want to delete this group?'
				description='This action cannot be undone.'
				closeButtonLabel='Cancel'
				actionButtonLabel='Delete'
				variant='danger'
			></MlActionModal>

			<MlActionModal
				isOpen={showReleaseModal}
				onAction={() => {
					if (programSemesterId) {
						handlePublishCourse(programSemesterId, isPublished);
					}
				}}
				onClose={() => setShowReleaseModal(false)}
				title='Are you sure you want to release this course?'
				description='Once you release this course, you will not be able to unpublish or edit it. This action is irreversible.'
				closeButtonLabel='Cancel'
				actionButtonLabel='Release'
				variant='transparent'
			></MlActionModal>

			<div className='flex justify-between items-start'>
				<div>
					<AtLoadingWrapper isLoading={isLoading} />
					<h2 className='text-xl font-semibold'>{location.headquarter_name}</h2>
					<AtBreadcrumb items={breadcrumbItems} separator='/' />
				</div>

				{!isPublished && (
					<>
						{groups.length > 0 && (
							<AtButton
								variant={isPublished ? 'primary' : 'secondary'}
								onClick={() => {
									setShowReleaseModal(true);
								}}
							>
								{isPublished ? 'Unpublish course' : 'Release course'}
							</AtButton>
						)}
					</>
				)}
			</div>

			<h2 className='text-xl font-medium pt-4'>{location.course_name}</h2>

			<ul className='sub-menu flex items-center w-full gap-x-4 mt-6 border-b border-gray-300'>
				<li className='border-b border-b-primary text-primary'>Groups</li>

				<Link
					to={`/admin/group/students/${programSemesterId}/semester/${semesterId}/location/${locationId}`}
				>
					<li>Students</li>
				</Link>
			</ul>

			{/* If there are groups */}
			<div className='group-list mt-4 relative'>
				<div className='group-container pt-6'>
					{isPublished && (
						<div className='fixed top-16 right-14 z-10'>
							<AtAlert
								variant='warning'
								description='This course is published. You can view it, but editing is not allowed.'
							/>
						</div>
					)}
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
					{groups.length > 0 && (
						<div className='bg-white shadow-md rounded-md py-4 px-3 border border-gray-300 mb-8'>
							<p className='text-xl font-medium'> General Settings</p>

							<div className='pt-2 '>
								<div className='flex items-center'>
									{/* </Tooltip> */}
									<div className='pr-4'>Max Enrollment Date: </div>{' '}
									<div>
										<DatePicker
											placeholderText='Max Enrollment date'
											wrapperClassName='w-full'
											disabled={isPublished}
											value={maxEnrollmentDate ? maxEnrollmentDate : undefined}
											onChange={(date) => {
												if (date && programSemesterId) {
													const dateString = date?.toISOString();

													handleUpdateMaxEnrollmentDate(
														programSemesterId,
														transformDateString(dateString, 'YYYY-MM-DD'),
														isPublished
													);
												}
											}}
											className={`w-full h-full ${
												isPublished ? 'bg-black/10' : 'bg-white'
											} p-1 placeholder:text-gray-950 font-normal rounded-md border border-gray-400 lg:text-lg`}
											onKeyDown={(e) => e.preventDefault()}
											showMonthDropdown
											showYearDropdown
										/>
									</div>
									<Tooltip
										id={`maxEnrollmentDateInfo`}
										place='top'
										content={
											'This is the deadline for students to request a group. After this date, they will no longer be able to join'
										}
										className='!text-sm'
									/>
									<div
										data-tooltip-id='maxEnrollmentDateInfo'
										className='ml-4 text-2xl'
									>
										<IoIosInformationCircleOutline />
									</div>
								</div>
							</div>
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
										className='relative mb-16 bg-white shadow-md rounded-md py-4 px-3 border border-gray-300'
									>
										{isPublished && (
											<div className='absolute z-10  top-0 right-0 left-0 bottom-0 bg-transparent'></div>
										)}

										<div className='flex items-center justify-between pb-4'>
											<div className='left'>
												{' '}
												<p className='text-xl font-medium pb-1'>
													{' '}
													Group Settings
												</p>
											</div>
											<div className='buttons flex items-center flex-wrap'>
												{!isPublished && (
													<>
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

														<AtButton
															data-tooltip-id={`tooltip-make-variant-${group.group_id}`}
															variant='primary'
															className='ml-4'
															onClick={() => {
																const insitePlaces = group.weeks.filter(
																	(week) =>
																		week.week_schedule.practice_place.type
																			.name === PracticaPlaceTypeName.IN_SITE
																);
																const offsitePlaces = group.weeks.filter(
																	(week) =>
																		week.week_schedule.practice_place.type
																			.name === PracticaPlaceTypeName.OFF_SITE
																);

																const payload = {
																	group_name: group.group_name + '-Variant',
																	start_date: group.start_date,
																	end_date: group.end_date,
																	default_end_time:
																		group.weeks[0].week_schedule.start_time,
																	default_start_time:
																		group.weeks[0].week_schedule.start_time,
																	max_students: group.max_students,
																	default_instructor_id:
																		group.weeks[0].week_schedule.dates[0]
																			.instructor.id,
																	verity_group_id: group.verity_group_id,
																	in_days: group.in_days,
																	offsite_num_weeks_for_generate:
																		offsitePlaces?.length ?? 1,
																	default_insite_practice_place_id:
																		insitePlaces[0].week_schedule.practice_place
																			.id,
																	default_offsite_practice_place_id:
																		offsitePlaces[0].week_schedule
																			.practice_place.id,
																	insite_num_weeks_for_generate:
																		insitePlaces?.length ?? 1,
																	program_semester_id: parseInt(
																		programSemesterId ?? '0'
																	),
																};

																if (programSemesterId) {
																	handleCreateGroup(payload);
																}
															}}
															tooltipId='tooltip-make-variant'
															tooltipContent='Create a similar group, but with potential differences.'
														>
															Make a variant
														</AtButton>
													</>
												)}
											</div>
										</div>

										<hr />

										<div className='group-header flex items-center mb-4 mt-4 gap-x-4'>
											<div className='group-name max-w-[400px]'>
												<div className='font-medium'>Group name: </div>{' '}
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
															'group',
															false
														)
													}
												/>
											</div>

											<div className='max-students flex items-center pl-4'>
												<div>
													<div className='w-[8rem] font-medium'>
														Max Students
													</div>
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
																'group',
																false
															)
														}
													/>
												</div>
											</div>

											<div className='group-name max-w-[300px]'>
												<div className='font-medium'>Verity ID: </div>{' '}
												<AtInputGroup
													type='text'
													placeholder='Verity ID'
													className='w-full h-full bg-white p-3 py-2 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
													defaultValue={group.verity_group_id}
													ref={inputRef}
													onUpdate={(value) =>
														handleUpdateGroup(
															group.group_id,
															'verity_group_id',
															value,
															'group',
															false
														)
													}
												/>
											</div>

											<div className='flex items-center'>
												<div>
													<div className='font-medium'>Group start date: </div>{' '}
													<DatePicker
														dateFormat={'MM-dd-yyyy'}
														placeholderText='Group Start date'
														wrapperClassName='w-full'
														value={
															group?.start_date
																? transformDateString(
																		group.start_date,
																		'MM/DD/YYYY'
																  )
																: undefined
														}
														onChange={(date) => {
															if (date && programSemesterId) {
																const dateString = date?.toISOString();

																handleUpdateGroup(
																	group.group_id,
																	'start_date',
																	transformDateString(dateString, 'YYYY-MM-DD'),
																	'group',
																	true
																);
															}
														}}
														className={`w-full h-full  p-1 placeholder:text-gray-950 font-normal rounded-md border border-gray-400 lg:text-lg`}
														onKeyDown={(e) => e.preventDefault()}
														showMonthDropdown
														showYearDropdown
													/>
												</div>
											</div>

											<div className='flex items-center'>
												<div>
													<div className='font-medium'>Group end date: </div>{' '}
													<DatePicker
														dateFormat={'MM-dd-yyyy'}
														placeholderText='Group End date'
														wrapperClassName='w-full'
														value={
															group?.end_date
																? transformDateString(
																		group.end_date,
																		'MM/DD/YYYY'
																  )
																: undefined
														}
														onChange={(date) => {
															if (date && programSemesterId) {
																const dateString = date?.toISOString();

																handleUpdateGroup(
																	group.group_id,
																	'end_date',
																	transformDateString(dateString, 'YYYY-MM-DD'),
																	'group',
																	true
																);
															}
														}}
														showMonthDropdown
														showYearDropdown
														className={`w-full h-full  p-1 placeholder:text-gray-950 font-normal rounded-md border border-gray-400 lg:text-lg`}
														onKeyDown={(e) => e.preventDefault()}
													/>
												</div>
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
																				? 'bg-yellow-500 text-white '
																				: 'bg-secondary text-white '
																		} p-4 lg:p-8 mb-6`}
																	>
																		{placeData.type === 'in-site'
																			? 'IN-SITE'
																			: 'OFF-SITE'}
																	</div>
																	<div className='right px-4 lg:px-8 flex items-center'>
																		<p className='text-lg font-medium pr-4'>
																			Shift:
																		</p>
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

																					// const shiftStartTimeLoading =
																					// 	toast.loading('Creating group...');
																					// toast.update(shiftStartTimeLoading, {
																					// 	render: 'Updating shift start time',
																					// 	type: 'info',
																					// 	isLoading: false,
																					// });

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
																										'week_schedule',
																										false
																									)
																							)
																						);
																					} catch (error) {
																						console.error(error);
																						// toast.update(
																						// 	shiftStartTimeLoading,
																						// 	{
																						// 		render: 'Error',
																						// 		type: 'error',
																						// 		isLoading: false,
																						// 		autoClose: 500,
																						// 	}
																						// );
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

																					console.log(
																						'Esot que es',
																						weeksScheduleIds
																					);
																					// const shiftEndTimeLoading =
																					// 	toast.loading('Creating group...');
																					// toast.update(shiftEndTimeLoading, {
																					// 	render: 'Updating shift end time',
																					// 	type: 'info',
																					// 	isLoading: false,
																					// });
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

																						// toast.update(shiftEndTimeLoading, {
																						// 	render: 'Shift end time updated',
																						// 	type: 'success',
																						// 	isLoading: false,
																						// 	autoClose: 500,
																						// });
																					} catch (error) {
																						console.error(error);
																						// toast.update(shiftEndTimeLoading, {
																						// 	render: 'Error',
																						// 	type: 'error',
																						// 	isLoading: false,
																						// 	autoClose: 500,
																						// });
																					}
																				}}
																			/>
																		</div>
																	</div>
																	<div className='left px-4 lg:px-8'>
																		<div className='title text-primary font-medium lg:text-lg '>
																			<div className='py-2'>
																				<Select
																					styles={{
																						control: (baseStyles, state) => ({
																							...baseStyles,
																							borderColor: state.isFocused
																								? 'grey'
																								: '#b1b6c0',
																						}),
																					}}
																					options={
																						placeData.type === 'in-site'
																							? inSiteOptions
																							: offsiteOptions
																					}
																					value={
																						placeData.type === 'in-site'
																							? inSiteOptions.filter(
																									(option) =>
																										option.value ===
																										placeData.place_id
																							  )
																							: offsiteOptions.filter(
																									(option) =>
																										option.value ===
																										placeData.place_id
																							  )
																					}
																					components={{
																						Option: CustomOption,
																						SingleValue: CustomSingleValue,
																					}}
																					placeholder='Select Coordinator'
																					className='w-full h-full bg-white !placeholder:text-[#807f7f] !font-normal rounded-md'
																					onChange={(selected) => {
																						if (selected) {
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
																										selected.value,
																										'week_schedule'
																									);
																								}
																							);
																						}
																					}}
																				/>
																			</div>
																		</div>
																	</div>
																</div>

																<div className='group-weeks mt-10 flex flex-col gap-y-6 relative px-4 lg:px-8'>
																	{placeData.weeks.map((week) => {
																		return (
																			<MlWeekSchedule
																				placeData={placeData}
																				key={week.week_id}
																				week={week}
																				group={group}
																				coordinators={coordinators}
																				isPublished={isPublished}
																				handleDeleteWeek={handleDeleteWeek}
																				handleUpdateGroup={handleUpdateGroup}
																				handleDeleteDayInWeek={
																					handleDeleteDayInWeek
																				}
																				handleCreateDayInWeek={
																					handleCreateDayInWeek
																				}
																			/>
																		);
																	})}
																</div>
																<div className='add-week-btn text-primary flex justify-center pt-6'>
																	{!isPublished && (
																		<AtButton
																			variant='primary'
																			className='text-sm flex items-center'
																			onClick={() =>
																				handleCreateWeek(
																					group.group_id,
																					placeData.type === 'in-site'
																						? true
																						: false
																				)
																			}
																		>
																			<span className='pr-2'>Add new week</span>{' '}
																			<LuCalendarPlus className='text-xl ' />
																		</AtButton>
																	)}
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

				{!isPublished && (
					<div className='add-new-section flex justify-center py-4 pb-16 '>
						<AtButton variant='primary' onClick={handleOpenAddGroupModal}>
							Add New Group
						</AtButton>
					</div>
				)}
			</div>
		</AdminLayout>
	);
};

export default AdminGroup;
