import { useState, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Tooltip } from 'react-tooltip';

interface AtSelectProps {
	selectedTime: string;
	tooltipContent?: string;
	tooltipId?: string;
	onChangeSelect?: (value: string) => void;
	className?: string;
	wrapperClassName?: string;
	placeholder?: string;
}
export const AtInputTime = forwardRef<HTMLDivElement, AtSelectProps>(
	(
		{
			selectedTime,
			tooltipContent,
			tooltipId,
			onChangeSelect,
			className,
			wrapperClassName,
			placeholder,
		},
		ref
	) => {
		const [selectedValue, setSelectedValue] = useState<Date | null>(null);

		const timeToTodayDate = (time: string): Date => {
			const todayDate = moment().format('YYYY-MM-DD');
			const dateTimeString = `${todayDate}T${time}`;

			return moment(dateTimeString).toDate();
		};

		const handleOnChange = (e: Date) => {
			setSelectedValue(e);

			if (onChangeSelect) onChangeSelect(e.toISOString());
		};
		useEffect(() => {
			if (selectedTime) {
				const timeInDate = timeToTodayDate(selectedTime);

				setSelectedValue(timeInDate);
			}
		}, [selectedTime]);

		return (
			<div data-tooltip-id={tooltipId} ref={ref}>
				<Tooltip id={tooltipId} place='top' content={tooltipContent} />
				<DatePicker
					selected={selectedValue}
					placeholderText={placeholder ? placeholder : 'Select Time'}
					showTimeSelect
					wrapperClassName={wrapperClassName}
					onChange={(time) => handleOnChange(time ? time : new Date())}
					showTimeSelectOnly
					timeIntervals={15}
					timeFormat='HH:mm'
					// dateFormat='h:mm aa'
					dateFormat={'HH:mm'}
					showIcon
					calendarIconClassName='top-1'
					showTimeCaption={false}
					className={`w-[150px] cursor-pointer h-full bg-white px-2 p-1 placeholder:text-[#807f7f] font-normal rounded-md border border-gray-400 lg:text-base ${className}`}
				/>
			</div>
		);
	}
);
