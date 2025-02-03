import { ReactNode } from 'react';
import Loading from 'react-loading';
import { Tooltip } from 'react-tooltip';

type AtButtonVariants =
	| 'white'
	| 'primary'
	| 'info'
	| 'transparent'
	| 'secondary'
	| 'danger'
	| 'no-style';
interface AtButtonProps {
	className?: string;
	children: ReactNode;
	variant?: AtButtonVariants;
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset' | undefined;
	tooltipId?: string;
	tooltipContent?: string;
	isLoading?: boolean;
}
const AtButton = ({
	className,
	children,
	variant = 'white',
	onClick,
	type = 'button',
	tooltipId,
	tooltipContent,
	isLoading,
}: AtButtonProps) => {
	const getVariant = (variant: AtButtonVariants) => {
		switch (variant) {
			case 'white':
				return 'bg-white text-primary hover:bg-primary hover:text-white hover:duration-150';
			case 'primary':
				return 'bg-primary_light text-primary hover:bg-primary hover:text-white hover:duration-150';
			case 'secondary':
				return 'bg-secondary text-white hover:bg-primary hover:text-white hover:duration-150';
			case 'danger':
				return 'bg-red_primary text-white hover:bg-red_primary/50 hover:text-white hover:duration-150';
			case 'info':
				return 'bg-white text-gray-700 hover:bg-primary hover:text-white hover:duration-150';
			case 'transparent':
				return 'bg-transparent text-primary hover:bg-primary hover:text-white hover:duration-150 !shadow-none';
			case 'no-style':
				return '!p-0 font-base shadow-none';
		}
	};

	return (
		<>
			<Tooltip
				id={tooltipId}
				place='top-end'
				content={tooltipContent}
				className='!text-sm'
			/>
			<button
				data-tooltip-id={tooltipId}
				className={` ${getVariant(
					variant
				)} p-4 px-6 font-medium rounded-md shadow-md ${className}`}
				onClick={onClick}
				type={type}
				disabled={isLoading}
			>
				{isLoading && (
					<span className='pr-3 text-xs'>
						<Loading type='spin' width={30} height={30} color='white' />
					</span>
				)}
				{children}
			</button>
		</>
	);
};

export default AtButton;
