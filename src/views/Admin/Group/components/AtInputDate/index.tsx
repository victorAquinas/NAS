import { useState, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Tooltip } from 'react-tooltip';

interface AtInputDateProps {
	selectedDate?: string;
	tooltipContent?: string;
	tooltipId?: string;
	onChangeSelect?: (value: string) => void;
	className?: string;
	wrapperClassName?: string;
	placeholder?: string;
}

export const AtInputDate = forwardRef<HTMLDivElement, AtInputDateProps>(
	(
		{
			selectedDate,
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

		useEffect(() => {
			if (selectedDate) {
				setSelectedValue(moment(selectedDate).toDate());
			}
		}, [selectedDate]);

		const handleOnChange = (date: Date | null) => {
			if (!date) return;
			setSelectedValue(date);

			if (onChangeSelect) {
				onChangeSelect(date.toISOString());
			}
		};

		return (
			<div data-tooltip-id={tooltipId} ref={ref}>
				<Tooltip id={tooltipId} place='top' content={tooltipContent} />
				<DatePicker
					selected={selectedValue}
					placeholderText={placeholder || 'Select Date'}
					wrapperClassName={wrapperClassName || 'w-full'}
					className={`w-full cursor-pointer h-full bg-white p-1 placeholder:text-[#807f7f] font-normal rounded-md border border-gray-400 lg:text-base ${className}`}
					onChange={handleOnChange}
					calendarIconClassName='top-1'
					dateFormat='yyyy-MM-dd'
					showIcon
				/>
			</div>
		);
	}
);
