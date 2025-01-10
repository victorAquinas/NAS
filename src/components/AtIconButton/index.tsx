import { IconType } from 'react-icons';
import { MdOutlineDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

interface AtIconButtonProps {
	Icon: IconType;
	label: string;
	href: string;
	tooltipId?: string;
	tooltipContent?: string;
	deleteLocationClick?: () => void;
}
export const AtIconButton = ({
	Icon,
	label,
	href,
	tooltipId,
	tooltipContent,
	deleteLocationClick,
}: AtIconButtonProps) => {
	return (
		<>
			<div className='relative transition duration-200 ease-in-out hover:scale-[1.05] cursor-pointer'>
				<Tooltip
					id={tooltipId}
					place='top-end'
					content={tooltipContent}
					className='!text-sm'
				/>
				<button
					className='absolute top-[-1rem] right-[-0.5rem] text-2xl bg-secondary rounded-full p-1'
					data-tooltip-id={tooltipId}
					onClick={deleteLocationClick}
				>
					<MdOutlineDelete className='text-white' stroke='1' />
				</button>
				<Link
					to={href}
					className='location  flex items-center bg-white  max-w-[16rem] rounded-md pr-4 shadow-md '
				>
					<div className='icon bg-secondary p-4 text-white rounded-l-md h-full text-4xl flex items-center justify-center'>
						<Icon />
					</div>
					<div className='name bg-white pl-2 font-medium py-3'>{label}</div>
				</Link>
			</div>
		</>
	);
};
