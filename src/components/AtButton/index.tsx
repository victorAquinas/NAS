import { ReactNode } from 'react';

type AtButtonVariants = 'white' | 'primary' | 'info';
interface AtButtonProps {
	className?: string;
	children: ReactNode;
	variant?: AtButtonVariants;
}
const AtButton = ({
	className,
	children,
	variant = 'white',
}: AtButtonProps) => {
	const getVariant = (variant: AtButtonVariants) => {
		switch (variant) {
			case 'white':
				return 'bg-white text-primary hover:bg-primary hover:text-white hover:duration-150';
			case 'primary':
				return 'bg-primary_light text-primary hover:bg-primary hover:text-white hover:duration-150';
			case 'info':
				return 'bg-white text-gray-700 hover:bg-primary hover:text-white hover:duration-150';
		}
	};
	return (
		<button
			className={` ${getVariant(
				variant
			)} p-4 px-6 font-medium rounded-md shadow-md ${className}`}
		>
			{children}
		</button>
	);
};

export default AtButton;
