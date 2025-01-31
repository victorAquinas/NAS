import NasLogo from '../../assets/nas-logo.svg';
import PoweredByAquinas from '../../assets/powered_aquinas.svg';
import { ReactNode } from 'react';
import AtButton from '../../components/AtButton';
import { Link } from 'react-router-dom';
import { useAdminLayout } from '../AdminLayout/useAppLayout';

interface BasicLayoutProps {
	children: ReactNode;
	className?: string;
}
export const BasicLayout = ({ children, className }: BasicLayoutProps) => {
	const { handleLogOut } = useAdminLayout();
	return (
		<>
			<div className=' bg-background flex items-center justify-center h-[70px] pt-4'>
				<div className='container px-4'>
					<Link to={'/semesters'}>
						<img src={NasLogo} alt='logo' className='object-contain' />
					</Link>
				</div>
				<div className='buttons'>
					<AtButton variant='secondary' onClick={handleLogOut}>
						Log out
					</AtButton>
				</div>
			</div>
			<div
				className={`min-h-[calc(100vh-140px)] h-full flex items-center justify-center bg-background px-4 pb-12 ${className}`}
			>
				{children}
			</div>

			<div className='bg-white flex flex-col items-center justify-center h-full py-4 md:py-0 md:h-[70px]'>
				<div className='px-4 container flex items-center justify-between flex-wrap gap-6'>
					<div className='left'>
						<p className='text-sm text-gray-600'>
							Copyright: © {new Date().getFullYear()} Nursing Appointment
							System. All Rights Reserved.
						</p>
					</div>
					<div className='right flex items-center'>
						<img src={PoweredByAquinas} alt='logo' />
					</div>
				</div>
			</div>
		</>
	);
};
