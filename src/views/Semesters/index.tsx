import { AiOutlineEye } from 'react-icons/ai';
import AtButton from '../../components/AtButton';
import { BasicLayout } from '../../layouts/BasicLayout';

export const Semesters = () => {
	return (
		<>
			<BasicLayout className='!items-start !pt-12'>
				<div className='flex flex-col justify-center text-center'>
					<h1 className='text-2xl font-medium'>Semesters </h1>
					<div className='text-center max-w-[43rem]'>
						<p>
							Select the <span className='text-primary'>active</span> semester
							to continue. You can also view closed semesters to review
							information from previous periods.
						</p>
					</div>

					<div className='list flex justify-between mt-6 gap-6 max-w-[43rem]'>
						<div className='inactive-list'>
							<h2 className='font-medium pb-4'>Closed</h2>

							<div className='list flex flex-col gap-2 h-full max-h-[calc(73vh-140px)] overflow-y-auto'>
								{Array.from({ length: 24 }).map((_, index) => (
									<AtButton
										variant='info'
										className='flex items-center w-[330px] justify-center'
										key={index}
									>
										January - December 202{index + 1}
										<span className='text-[1.7rem] pl-4'>
											<AiOutlineEye />
										</span>
									</AtButton>
								))}
							</div>
						</div>
						<div className='inactive-list'>
							<h2 className='font-medium pb-4'>Active</h2>

							<div className='list flex flex-col gap-2'>
								<AtButton
									variant='primary'
									className='flex items-center w-[330px] justify-center'
								>
									January - December 2024
									<span className='text-[1.7rem] pl-4'>
										<AiOutlineEye />
									</span>
								</AtButton>
							</div>
						</div>
					</div>
				</div>
			</BasicLayout>
		</>
	);
};
