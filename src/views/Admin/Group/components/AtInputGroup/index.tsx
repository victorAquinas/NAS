import React, { forwardRef } from 'react';
import { toast } from 'react-toastify';

type AtInputGroupProps = {
	type?: string;
	placeholder?: string;
	className?: string;
	defaultValue?: string | number;
	onUpdate: (value: string) => Promise<void>;
	toastMessages?: {
		success: string;
		error: string;
		pending: string;
	};
	disabled?: boolean;
};

const AtInputGroup = forwardRef<HTMLInputElement, AtInputGroupProps>(
	(
		{
			type = 'text',
			placeholder = '',
			className = '',
			defaultValue = '',
			onUpdate,
			toastMessages,
			disabled = false,
		},
		ref
	) => {
		const [initialValue, setInitialValue] = React.useState(defaultValue);

		const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
			const newValue = e.target.value;

			if (newValue !== initialValue) {
				setInitialValue(newValue);
				if (toastMessages) {
					toast.promise(onUpdate(newValue), toastMessages, {
						autoClose: 500,
					});
				} else {
					await onUpdate(newValue);
				}
			}
		};

		return (
			<input
				type={type}
				placeholder={placeholder}
				className={className}
				defaultValue={defaultValue}
				ref={ref}
				disabled={disabled}
				onBlur={handleBlur}
			/>
		);
	}
);

export default AtInputGroup;
