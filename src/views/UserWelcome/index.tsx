import { CgChevronRight } from 'react-icons/cg';
import AtButton from '../../components/AtButton';
import { BasicLayout } from '../../layouts/BasicLayout';

export const UserWelcome = () => {
	return (
		<>
			<BasicLayout>
				<div className='content text-center max-w-[50rem]'>
					<h1 className='font-medium text-3xl mb-4 '>Hello, Victor</h1>
					<p>
						Welcome to the Nursing Appointment System. <br />
						Here you can easily manage your clinical practices. Select the shift
						that best suits your schedule at the available hospitals through the
						calendar. You can also view past and upcoming shifts in detail, as
						well as the history of selected shifts.
					</p>
					<p className='font-medium pt-2'>
						Start planning your practical experience today!
					</p>

					<div className='flex justify-center mt-6'>
						<AtButton className='flex items-center' variant='white'>
							Start now
							<span className='text-xl pl-1'>
								<CgChevronRight />
							</span>
						</AtButton>
					</div>
				</div>
			</BasicLayout>
		</>
	);
};
