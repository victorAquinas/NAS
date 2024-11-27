import { ReactNode, useState } from 'react';
import NotificationOn from '../../../assets/notification-on.svg';

interface MlNotificationsProps {
	children: ReactNode;
}

const MlNotifications = ({ children }: MlNotificationsProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleOpenNotifications = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<div className='right relative z-10'>
				<div
					className={`notification-list bg-white rounded-md shadow-md absolute right-0 top-6  w-[250px] border border-gray-200 ${
						isOpen ? 'block' : 'hidden'
					}`}
				>
					{children}
				</div>

				<button onClick={handleOpenNotifications}>
					<img src={NotificationOn} alt='notification' className='w-[22px]' />
				</button>
			</div>
		</>
	);
};

export default MlNotifications;
