import { IconType } from 'react-icons';

interface AtSidebarItemProps {
	icon: IconType;
	label: string;
	isActive?: boolean;
}

export const AtSidebarItem = ({
	icon: Icon,
	label,
	isActive = false,
}: AtSidebarItemProps) => {
	return (
		<div
			className={`nav-item flex items-center flex-col ${
				isActive ? 'text-primary' : 'text-white'
			} mb-8`}
		>
			<div className='icon text-2xl font-light'>
				<Icon />
			</div>
			<span className='font-light pt-2'>{label}</span>
		</div>
	);
};
