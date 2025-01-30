import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import { MdOutlineDelete } from 'react-icons/md';
import { AtSelectCoordinator } from '../AtSelectCoordinator';
import { Instructor, updateGroupType } from '../../../../../api/types';
import { transformDateString } from '../../../../../utils/transformDateString';
import AtButton from '../../../../../components/AtButton';
import moment from 'moment';

interface DayRowProps {
	dayId: number;

	dateValue: string;

	instructorId: number;

	coordinators: Instructor[];

	isPublished: boolean;

	handleUpdateGroup: (
		id: number,
		field: string,
		value: unknown,
		level: updateGroupType
	) => Promise<void>;

	onDeleteDay: () => Promise<void>;
}

const DayRow = React.memo<DayRowProps>(
	({
		dayId,
		dateValue,
		instructorId,
		coordinators,
		isPublished,
		handleUpdateGroup,
		onDeleteDay,
	}) => {
		const [selectedDate, setSelectedDate] = useState<Date | null>(null);

		useEffect(() => {
			if (dateValue) {
				const date = new Date(
					moment(dateValue, 'YYYY-MM-DD').format('YYYY-MM-DDTHH:mm:ss')
				);

				setSelectedDate(date);
			}
		}, [dateValue]);

		const handleDateChange = useCallback(
			(date: Date | null) => {
				if (!date) return;
				setSelectedDate(date);

				handleUpdateGroup(
					dayId,
					'date',
					transformDateString(date.toISOString(), 'YYYY-MM-DD'),
					'day'
				);
			},
			[dayId, handleUpdateGroup]
		);

		// Handle the instructor change
		const handleInstructorChange = (newInstructorId: string) => {
			handleUpdateGroup(dayId, 'instructor_id', newInstructorId, 'day');
		};

		return (
			<div className='week-row flex items-center px-2 gap-x-4'>
				{/* DatePicker */}
				<div className='w-1/2'>
					<DatePicker
						placeholderText='Select date'
						selected={selectedDate}
						onChange={handleDateChange}
						wrapperClassName='w-full'
						className='w-full bg-white p-1 rounded-md border border-gray-400 lg:text-lg'
						onKeyDown={(e) => e.preventDefault()}
						showMonthDropdown
						showYearDropdown
						dropdownMode='select'
					/>
				</div>

				{/* Coordinator dropdown + delete button */}
				<div className='w-1/2 flex items-center'>
					<AtSelectCoordinator
						coordinators={coordinators}
						defaultValue={String(instructorId)}
						onChangeSelect={handleInstructorChange}
					/>

					{!isPublished && (
						<AtButton
							variant='no-style'
							className='text-3xl !pl-4'
							onClick={() => onDeleteDay()}
							tooltipContent='Delete day'
						>
							<MdOutlineDelete className='text-red_primary' />
						</AtButton>
					)}
				</div>
			</div>
		);
	}
);

DayRow.displayName = 'DayRow';

export default DayRow;
