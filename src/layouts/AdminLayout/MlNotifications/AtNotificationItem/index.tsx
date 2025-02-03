import { Link } from 'react-router-dom';

interface AtNotificationItemProps {
	type: 'approved' | 'rejected';
	group: string;
}
const AtNotificationItem = ({ type, group }: AtNotificationItemProps) => {
	return (
		<div className='notification-item text-xs border-b border-gray-200 p-4 hover:bg-gray-100 bg-white z-50'>
			{type === 'approved' && (
				<>
					<p>
						<span className='text-primary'>Aprroved Shift</span>: Your shift has
						been approved for the{' '}
						<span className='font-medium text-primary'>Group {group}</span>
					</p>
					<Link to={'/my-shifts'}>
						<div className='flex justify-end'>
							<button className='font-medium text-xxs pt-2'>See details</button>
						</div>
					</Link>
				</>
			)}
			{type === 'rejected' && (
				<>
					<p>
						<span className='text-red_primary'>Rejected Shift</span>: Your shift
						has been approved for the{' '}
						<span className='font-medium text-red_primary'>Group {group}</span>
					</p>
					<Link to={'/calendar'}>
						<div className='flex justify-end'>
							<button className='font-medium text-xxs pt-2'>
								Request a new group
							</button>
						</div>
					</Link>
				</>
			)}
		</div>
	);
};

export default AtNotificationItem;
