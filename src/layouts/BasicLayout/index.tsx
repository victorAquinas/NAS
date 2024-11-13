import NasLogo from '../../assets/nas-logo.svg';
import PoweredByAquinas from '../../assets/powered_aquinas.svg';
import { ReactNode } from 'react';

interface BasicLayoutProps {
	children: ReactNode;
	className?: string;
}
export const BasicLayout = ({ children, className }: BasicLayoutProps) => {
	return (
		<>
			<div className=' bg-background flex flex-col items-center justify-center h-[70px]'>
				<div className='container px-4'>
					<img src={NasLogo} alt='logo' className='object-contain' />
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
