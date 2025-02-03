import Select, {
	GroupBase,
	OptionProps,
	SingleValueProps,
	StylesConfig,
} from 'react-select';
import { SelectOptionDescription } from '../../api/types';

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

const customStyles: StylesConfig<SelectOptionDescription, false> = {
	valueContainer: (provided) => ({
		...provided,
		display: 'flex',
		padding: '0.5312rem', // Adjusts padding inside the selected value container
	}),
};

interface AtSelectWithDescriptionProps {
	onChange: (value: SelectOptionDescription | null) => void;
	options: SelectOptionDescription[];
	placeholder?: string;
	value?: SelectOptionDescription | null;
	isLoading?: boolean;
	disabled?: boolean;
}
export const AtSelectWithDescription = ({
	value,
	onChange,
	options,
	isLoading = false,
	disabled = false,
}: AtSelectWithDescriptionProps) => {
	return (
		<Select
			value={value}
			components={{
				Option: CustomOption,
				SingleValue: CustomSingleValue,
			}}
			isLoading={isLoading}
			isDisabled={isLoading || disabled}
			options={options}
			styles={customStyles}
			placeholder='Move to'
			className='w-full h-full bg-white !placeholder:text-[#807f7f] !font-normal rounded-md'
			onChange={onChange}
		/>
	);
};
