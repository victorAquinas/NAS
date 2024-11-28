import BadgeIcon from '../../assets/badge-icon.svg';
import NasLogoNoText from '../../assets/nas-logo-no-text.svg';

import { ReactNode } from 'react';
import { AtSidebarItem } from '../../components/AtSidebarItem';
import { LuCalendarDays } from 'react-icons/lu';
import { IoBriefcaseOutline, IoSchoolOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import MlNotifications from './MlNotifications';
import AtNotificationItem from './MlNotifications/AtNotificationItem';

interface AppLayoutProps {
	children: ReactNode;
	className?: string;
	userName: string;
	course: string;
	programSemesterId: string;
}
export const AppLayout = ({
	children,
	className,
	userName,
	course,
	programSemesterId,
}: AppLayoutProps) => {
	const isActive = (path: string) => location.pathname.includes(path);

	return (
		<>
			<div className='full flex'>
				<div className='sidebar w-[115px] bg-secondary h-screen p-4 relative'>
					<div className='logo'>
						<img src={NasLogoNoText} alt='' />
					</div>

					<div className='nav-list flex-col  mt-12'>
						<Link to={`/calendar/${programSemesterId}`}>
							<AtSidebarItem
								label='Calendar'
								isActive={isActive('calendar')}
								icon={LuCalendarDays}
							/>
						</Link>
						<Link to={`/my-shifts/${programSemesterId}`}>
							<AtSidebarItem
								label='My shifts'
								isActive={isActive('my-shifts')}
								icon={IoBriefcaseOutline}
							/>
						</Link>
						<Link to={`/semesters`}>
							<AtSidebarItem
								label='Semesters'
								isActive={isActive('semesters')}
								icon={IoSchoolOutline}
							/>
						</Link>
					</div>

					<div className='logout absolute bottom-0 p-4 left-0 text-white font-light text-sm'>
						Log out
					</div>
				</div>

				<div className='content w-full'>
					<div className='content-navbar bg-white w-full flex justify-center px-4 py-2 h-[52px]'>
						<div className='container flex items-center justify-between'>
							<div className='left flex items-center'>
								<div className='icon pr-3'>
									<img src={BadgeIcon} alt='badge' />
								</div>
								<div className='content text-xs'>
									<p>{userName}</p>
									<p>
										Course: <span className='font-medium'>{course}</span>
									</p>
								</div>
							</div>
							<MlNotifications>
								<AtNotificationItem type='approved' group='1' />
								<AtNotificationItem type='rejected' group='2' />
							</MlNotifications>
						</div>
					</div>

					{/* Content */}
					<div
						className={`content-content bg-background  h-[calc(100vh-52px)] p-2 flex flex-col items-center overflow-y-auto ${className}`}
					>
						<div className='container mt-4'>{children}</div>
					</div>
				</div>
			</div>
		</>
	);
};
