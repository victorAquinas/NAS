import { ReactNode } from 'react';

type AtButtonVariants = 'white' | 'primary' | 'info' | 'transparent';
interface AtButtonProps {
	className?: string;
	children: ReactNode;
	variant?: AtButtonVariants;
	onClick?: () => void;
}
const AtButton = ({
	className,
	children,
	variant = 'white',
	onClick,
}: AtButtonProps) => {
	const getVariant = (variant: AtButtonVariants) => {
		switch (variant) {
			case 'white':
				return 'bg-white text-primary hover:bg-primary hover:text-white hover:duration-150';
			case 'primary':
				return 'bg-primary_light text-primary hover:bg-primary hover:text-white hover:duration-150';
			case 'info':
				return 'bg-white text-gray-700 hover:bg-primary hover:text-white hover:duration-150';
			case 'transparent':
				return 'bg-transparent text-primary hover:bg-primary hover:text-white hover:duration-150 !shadow-none';
		}
	};
	return (
		<button
			className={` ${getVariant(
				variant
			)} p-4 px-6 font-medium rounded-md shadow-md ${className}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default AtButton;
