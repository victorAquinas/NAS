import NasLogoNoText from '../../assets/nas-logo-no-text.svg';
import { ReactNode } from 'react';
import { AtSidebarItem } from '../../components/AtSidebarItem';
import { Link } from 'react-router-dom';

import { RiComputerLine } from 'react-icons/ri';
import { useAdminLayout } from './useAppLayout';
import { BsHouses } from 'react-icons/bs';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { AtUserNotifications } from '../../components/AtUserNotifications';

interface AdminLayoutProps {
	children: ReactNode;
	className?: string;
}
export const AdminLayout = ({ children, className }: AdminLayoutProps) => {
	const { isSidebarItemActive, handleLogOut } = useAdminLayout();

	return (
		<>
			<div className='md:hidden bg-primary h-full min-h-screen overflow-hidden flex items-center justify-center flex-col'>
				<div className='text-center mt-4 text-[5rem] text-white'>
					<RiComputerLine />
				</div>
				<div className='p-4 text-lg md:text-4xl text-white text-center'>
					This content can only be accessed from a tablet device or higher.
				</div>
				<div className=' text-lg md:text-4xl text-white text-center'>
					If you're using a tablet, please rotate your device to landscape mode
					for optimal viewing.
				</div>
			</div>

			<div className='full hidden md:flex'>
				<div className='sidebar w-[115px] bg-secondary h-screen p-4 relative'>
					<div className='logo'>
						<img src={NasLogoNoText} alt='logo' />
					</div>

					<div className='nav-list flex-col  mt-12'>
						<Link to={`/admin/locations`}>
							<AtSidebarItem
								label='Locations'
								isActive={isSidebarItemActive('locations')}
								icon={BsHouses}
							/>
						</Link>
					</div>

					<button
						className='logout absolute bottom-0 p-4 left-0 text-white font-light text-sm'
						onClick={handleLogOut}
					>
						Log out
					</button>
				</div>

				<div className='content w-full'>
					<div className='content-navbar bg-white w-full flex justify-center px-4 py-2 h-[52px]'>
						<div className='container flex items-center justify-between'>
							<div className='left flex items-center'>
								<div className='icon pr-2 text-primary text-2xl'>
									<MdOutlineAdminPanelSettings />
								</div>
								<div className='content text-xs font-medium'>Administrator</div>
							</div>
							<AtUserNotifications />
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
