import { useState, useEffect } from 'react';
import { Instructor } from '../../../../../api/types';

interface AtSelectCoordinatorProps {
	coordinators: Instructor[];
	defaultValue: string;
	onChangeSelect?: (value: string) => void;
}
export const AtSelectCoordinator = ({
	coordinators,
	defaultValue,
	onChangeSelect,
}: AtSelectCoordinatorProps) => {
	const [selectedValue, setSelectedValue] = useState<string>('');

	const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedValue(e.target.value);
		console.log('SelectedValue', e.target.value);
		if (onChangeSelect) onChangeSelect(e.target.value);
	};
	useEffect(() => {
		if (coordinators?.length) {
			setSelectedValue(defaultValue);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [coordinators]);

	return (
		<select
			className='w-full h-full bg-white p-1 placeholder:text-gray-400 font-normal rounded-md border border-gray-400 lg:text-lg'
			value={selectedValue || ''}
			onChange={handleOnChange}
		>
			<option disabled value=''>
				Select coordinator
			</option>
			{coordinators?.map((coordinator) => (
				<option value={coordinator.id} key={coordinator.id}>
					{coordinator.name}
				</option>
			))}
		</select>
	);
};
