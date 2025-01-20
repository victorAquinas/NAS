import { Link } from 'react-router-dom';
import { transformDateString } from '../../../../utils/transformDateString';
import { GoDotFill } from 'react-icons/go';

interface AtNotificationItemProps {
	type: 'accepted' | 'reject' | 'info' | 'unknown';
	description?: string;
	isNew?: boolean;
	programSemesterId?: number;
	date: string;
}
const AtNotificationItem = ({
	type,
	isNew,
	description,
	programSemesterId,
	date,
}: AtNotificationItemProps) => {
	return (
		<div className='notification-item text-sm border-b border-gray-200 p-4 hover:bg-gray-100 bg-white z-50 relative pr-6'>
			{type === 'accepted' && (
				<>
					<p className='text-primary font-medium'>{description}</p>
					<div className='flex justify-between items-center'>
						<p className='text-cyan-600 font-medium'>
							{transformDateString(date)}
						</p>
						<Link to={`/my-shifts/${programSemesterId}`}>
							<div className='flex justify-end'>
								<button className='font-medium text-xs pt-2'>
									See details
								</button>
							</div>
						</Link>
					</div>
				</>
			)}
			{type === 'reject' && (
				<>
					<p className='text-red_primary font-medium'>
						{description}, Please request a new group.
					</p>

					<div className='flex justify-between items-center'>
						<p className='text-cyan-600 font-medium'>
							{transformDateString(date)}
						</p>
						<Link to={`/calendar/${programSemesterId}`}>
							<div className='flex justify-end'>
								<button className='font-medium text-xs pt-2'>
									Request a new group
								</button>
							</div>
						</Link>
					</div>
				</>
			)}

			{type === 'info' && description && (
				<div>
					<p>{description}</p>
					<p className='text-cyan-600 font-medium'>
						{transformDateString(date)}
					</p>
				</div>
			)}

			{isNew && (
				<div className='is_new absolute right-4 top-[1.7rem] transform -translate-y-1/2 text-xl text-primary'>
					<GoDotFill />
				</div>
			)}
		</div>
	);
};

export default AtNotificationItem;
