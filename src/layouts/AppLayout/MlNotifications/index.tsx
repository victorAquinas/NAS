import NotificationOn from '../../../assets/notification-on.svg';
import { useAtUserNotifications } from '../../../components/AtUserNotifications/useAtUserNotifications';
import AtNotificationItem from './AtNotificationItem';

const MlNotifications = () => {
	const {
		isOpen,
		handleOpenNotifications,
		containerRef,
		notifications,
		programSemesterId,
		getNotificationType,
		isLoading,
	} = useAtUserNotifications();

	return (
		<div ref={containerRef} className='right relative z-10'>
			<div
				className={`notification-list max-h-[300px] overflow-y-auto bg-white rounded-md shadow-md absolute right-0 top-6 w-[350px] border border-gray-200 ${
					isOpen ? 'block' : 'hidden'
				}`}
			>
				{isLoading && (
					<div className='text-sm border-b border-gray-200 p-4 hover:bg-gray-100 bg-white z-50 relative pr-6'>
						Loading...
					</div>
				)}
				{!isLoading &&
					notifications
						?.slice(0, 10)
						?.map((notification) => (
							<AtNotificationItem
								key={`notification-${notification.id}`}
								type={getNotificationType(notification.description)}
								description={notification.description}
								isNew={notification.status}
								date={notification.created_at}
								programSemesterId={programSemesterId ?? 0}
							/>
						))}

				{!isLoading && notifications?.length === 0 && (
					<div className='text-sm border-b border-gray-200 p-4 hover:bg-gray-100 bg-white z-50 relative pr-6'>
						No notifications
					</div>
				)}
			</div>

			<button onClick={handleOpenNotifications}>
				<img src={NotificationOn} alt='notification' className='w-[22px]' />
			</button>
		</div>
	);
};

export default MlNotifications;
