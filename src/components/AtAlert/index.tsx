interface AtAlertProps {
	description: string;
	title?: string;
	className?: string;
	variant?: 'info' | 'success' | 'warning' | 'danger';
}
export const AtAlert = ({
	title,
	description,
	className,
	variant = 'warning',
}: AtAlertProps) => {
	const getVariant = (variant: 'info' | 'success' | 'warning' | 'danger') => {
		switch (variant) {
			case 'info':
				return 'bg-blue-100 border-l-4 border-blue-500 text-blue-700';
			case 'success':
				return 'bg-green-100 border-l-4 border-green-500 text-green-700';
			case 'warning':
				return 'bg-orange-100 border-l-4 border-yellow-500 text-yellow-700';
			case 'danger':
				return 'bg-red-100 border-l-4 border-red-500 text-red-700';
			default:
				return 'bg-blue-100 border-l-4 border-blue-500 text-blue-700';
		}
	};

	return (
		<div
			className={`${getVariant(
				variant
			)} border-l-4 rounded-md border-orange-500 text-orange-700 p-4 ${className}`}
			role='alert'
		>
			{title && <p className='font-bold'>{title}</p>}
			<p>{description}</p>
		</div>
	);
};
