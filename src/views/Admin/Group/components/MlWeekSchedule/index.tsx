import React, { Fragment } from 'react';
import { FaRegCalendarXmark } from 'react-icons/fa6';
import { IoIosAddCircleOutline } from 'react-icons/io';

import DayRow from './DayRow'; // Adjust path
import {
	Group,
	Instructor,
	updateGroupType,
	Week,
} from '../../../../../api/types';
import AtButton from '../../../../../components/AtButton';

interface MlWeekScheduleProps {
	week: Week;
	group: Group;
	coordinators: Instructor[];
	isPublished: boolean;
	handleDeleteWeek: (groupId: number, weekId: number) => Promise<void>;
	handleUpdateGroup: (
		id: number,
		field: string,
		value: unknown,
		level: updateGroupType
	) => Promise<void>;
	handleDeleteDayInWeek: (
		weekScheduleId: number,
		dayId: number
	) => Promise<void>;
	handleCreateDayInWeek: (weekScheduleId: number) => Promise<void>;
	placeData: {
		place_id: number;
		type: 'in-site' | 'off-site';
		name: string;
		address: string;
		shift: string;
		shift_start_time: string;
		shift_end_time: string;
		weeks: Week[];
	};
}

const MlWeekSchedule: React.FC<MlWeekScheduleProps> = ({
	week,
	group,
	coordinators,
	isPublished,
	handleDeleteWeek,
	handleUpdateGroup,
	handleDeleteDayInWeek,
	handleCreateDayInWeek,
	placeData,
}) => {
	// console.log(group);
	return (
		<div
			key={week.week_id}
			className='week-card border border-black rounded-md flex relative'
		>
			{/* Delete entire week button */}

			{!isPublished && placeData.weeks.length > 1 && (
				<AtButton
					tooltipId={`delete_week_${week.week_id}`}
					tooltipContent='Delete week'
					variant='no-style'
					className='delete-week text-3xl absolute top-[-0.8rem] left-[-0.5rem] 
                     text-red_primary bg-white flex items-center justify-center rounded-full'
					onClick={() => handleDeleteWeek(group.group_id, week.week_id)}
				>
					<FaRegCalendarXmark />
				</AtButton>
			)}

			{/* Week number input */}
			<div className='week-number flex-col flex justify-center items-center w-[100px] border-r border-black p-2 lg:text-lg'>
				Week
				<input
					type='number'
					min={0}
					defaultValue={week.week_number}
					placeholder='Week'
					onBlur={(e) =>
						handleUpdateGroup(
							week.week_id,
							'week_number',
							+e.target.value,
							'week'
						)
					}
					className='w-full h-[30px] bg-white px-1 
                     placeholder:text-gray-400 font-normal 
                     rounded-md border border-gray-400'
				/>
			</div>

			{/* Day rows */}
			<div className='week-rows p-2 w-full gap-y-2 flex flex-col lg:p-5'>
				{week.week_schedule.dates.map((dateObj) => (
					<Fragment key={Math.random()}>
						<DayRow
							key={dateObj.day_id}
							dayId={dateObj.day_id}
							dateValue={dateObj.date}
							instructorId={dateObj.instructor.id}
							coordinators={coordinators}
							isPublished={isPublished}
							handleUpdateGroup={handleUpdateGroup}
							onDeleteDay={() =>
								handleDeleteDayInWeek(
									week.week_schedule.week_schedule_id,
									dateObj.day_id
								)
							}
						/>
					</Fragment>
				))}

				{/* Add a new day to this week */}
				{!isPublished && (
					<div className='text-primary flex justify-center pt-2'>
						<AtButton
							variant='no-style'
							onClick={() =>
								handleCreateDayInWeek(week.week_schedule.week_schedule_id)
							}
							tooltipId={`add_day_${week.week_id}`}
							className='flex items-center !text-sm'
							tooltipContent='Add new day to the week'
						>
							Add day
							<span className='text-2xl pl-2'>
								<IoIosAddCircleOutline />
							</span>
						</AtButton>
					</div>
				)}
			</div>
		</div>
	);
};

export default MlWeekSchedule;
