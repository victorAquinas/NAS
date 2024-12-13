import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';

interface AtIconButtonProps {
	Icon: IconType;
	label: string;
	href: string;
}
export const AtIconButton = ({ Icon, label, href }: AtIconButtonProps) => {
	return (
		<Link
			to={href}
			className='location flex items-center bg-white  max-w-[16rem] rounded-md pr-4 shadow-md transition duration-200 ease-in-out hover:scale-[1.05] cursor-pointer'
		>
			<div className='icon bg-secondary p-4 text-white rounded-l-md h-full text-4xl flex items-center justify-center'>
				<Icon />
			</div>
			<div className='name bg-white pl-2 font-medium py-3'>{label}</div>
		</Link>
	);
};
