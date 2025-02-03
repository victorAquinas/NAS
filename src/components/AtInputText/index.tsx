import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

interface AtInputText {
	name: string;
	placeholder?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	register: UseFormRegister<any>;
	error?: FieldError;
}

const AtInputText: React.FC<AtInputText> = ({
	name,
	placeholder,
	register,
	error,
}) => {
	return (
		<div className='w-full h-full'>
			<input
				type='text'
				id={name}
				placeholder={placeholder || ''}
				{...register(name)}
				className='w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md'
			/>
			{error && <p className='text-red-500 text-sm mt-1'>{error.message}</p>}
		</div>
	);
};

export default AtInputText;
