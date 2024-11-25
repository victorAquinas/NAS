import { CgChevronRight } from 'react-icons/cg';
import AtButton from '../../components/AtButton';
import { AppLayout } from '../../layouts/AppLayout';
import { Accordion } from '@szhsin/react-accordion';
import AtAccordionItem from '../../components/AtAccordionItem';
import { AtBadge } from '../../components/AtBadge';
import { MlActionModal } from '../../components/MlModal/MlActionModal';
import { MlInfoModal } from '../../components/MlModal/MlInfoModal';

const MyShiftsPage = () => {
	return (
		<AppLayout course='Nursing' userName='Victor Escalona'>
			<MlActionModal
				isOpen={false}
				title='Your request is pending confirmation'
				description='You will receive a response within the next 24 hours via email. If you have any questions or concerns, feel free to contact our support team, who will be available to assist you.'
				closeButtonLabel='Support'
				actionButtonLabel='Continue'
				onClose={() => console.log('Close')}
				onAction={() => console.log('Action')}
			/>

			<MlInfoModal
				isOpen={false}
				title='Your request is pending confirmation'
				description='You will receive a response within the next 24 hours via email. If you have any questions or concerns, feel free to contact our support team, who will be available to assist you.'
				closeButtonLabel='Continue'
				onClose={() => console.log('Close')}
			/>
			<div className='content flex justify-center flex-col items-center mt-60'>
				<h2 className='text-xl font-medium'>You haven't selected a group</h2>
				<p className='text-sm max-w-[40rem] text-center'>
					In order to access your shifts and navigate the available options, you
					need to select a group from the opportunities displayed on the
					calendar. Once you've selected one, you can manage your shifts and
					continue with the process.
				</p>
				<AtButton variant='transparent' className='flex items-center mt-6'>
					Select a group{' '}
					<span className='pl-2 text-xl font-medium'>
						<CgChevronRight />
					</span>
				</AtButton>
			</div>

			<div className='selected-shift'>
				<h2 className='text-xl font-medium'>Shifts</h2>
				<p className='text-sm max-w-[50rem]'>
					In this section, you can view the status of all your clinical
					practices: approved, rejected, and in progress. Access the details of
					each shift to stay informed and easily manage your upcoming practices.
				</p>

				<div className='active-shift bg-white rounded-md mt-6 shadow-md pb-4'>
					<div className='p-4 font-medium'>Active Shifts</div>
					<div className='table w-full'>
						<table className='border-collapse  w-full'>
							<thead>
								<tr>
									<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
										Group
									</th>
									<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
										Shift
									</th>
									<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
										Date
									</th>
									<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
										Instructor
									</th>
									<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
										Hospital
									</th>
									<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
										Status
									</th>
									<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
										Type of practice
									</th>
								</tr>
							</thead>
							<tbody>
								{Array.from({ length: 5 }).map((_, index) => (
									<tr className='text-center bg-white' key={index + 'aa'}>
										<td className='border-b border-gray-200 px-3 text-sm p-3'>
											1
										</td>
										<td className='border-b border-gray-200 px-3 text-sm p-3'>
											7AM - 7PM
										</td>
										<td className='border-b border-gray-200 px-3 text-sm p-3'>
											11/11/2024
										</td>
										<td className='border-b border-gray-200 px-3 text-sm p-3'>
											Fernando Garcia M.
										</td>
										<td className='border-b border-gray-200 px-3 text-sm p-3'>
											Victoria Rehab
										</td>
										<td className='border-b border-gray-200 px-3 text-sm p-3'>
											Assisted
										</td>
										<td className='border-b border-gray-200 px-3 text-sm p-3'>
											<AtBadge label='In campus' variant='dark' />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div className='active-shift bg-white rounded-md mt-6 pb-4 shadow-md'>
					<div className='p-4 font-medium'>Closed Shifts</div>

					<div className='closed-shifts'>
						<Accordion
							transition
							transitionTimeout={300}
							className='px-2 flex flex-col gap-3'
						>
							<AtAccordionItem header={'January - July 2024'}>
								<div className='table w-full pt-4 font-normal'>
									<table className='border-collapse w-full'>
										<thead>
											<tr>
												<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
													Group
												</th>
												<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
													Shift
												</th>
												<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
													Date
												</th>
												<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
													Instructor
												</th>
												<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
													Hospital
												</th>
												<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
													Status
												</th>
												<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
													Type of practice
												</th>
											</tr>
										</thead>
										<tbody>
											{Array.from({ length: 5 }).map((_, index) => (
												<tr className='text-center bg-white' key={index + 'bb'}>
													<td className='border-b border-gray-200 px-3 text-sm p-3'>
														1
													</td>
													<td className='border-b border-gray-200 px-3 text-sm p-3'>
														7AM - 7PM
													</td>
													<td className='border-b border-gray-200 px-3 text-sm p-3'>
														11/11/2024
													</td>
													<td className='border-b border-gray-200 px-3 text-sm p-3'>
														Fernando Garcia M.
													</td>
													<td className='border-b border-gray-200 px-3 text-sm p-3'>
														Victoria Rehab
													</td>
													<td className='border-b border-gray-200 px-3 text-sm p-3'>
														Assisted
													</td>
													<td className='border-b border-gray-200 px-3 text-sm p-3'>
														<AtBadge label='Off-site' variant='warning' />
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</AtAccordionItem>
							<AtAccordionItem header={'July - December 2024'}>
								<div className='table w-full pt-4 font-normal'>
									<table className='border-collapse w-full'>
										<thead>
											<tr>
												<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
													Group
												</th>
												<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
													Shift
												</th>
												<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
													Date
												</th>
												<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
													Instructor
												</th>
												<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
													Hospital
												</th>
												<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
													Status
												</th>
												<th className='border border-gray-200 bg-primary_light font-normal text-sm px-3 py-2'>
													Type of practice
												</th>
											</tr>
										</thead>
										<tbody>
											{Array.from({ length: 5 }).map((_, index) => (
												<tr className='text-center bg-white' key={index + 'kk'}>
													<td className='border-b border-gray-200 px-3 text-sm p-3'>
														1
													</td>
													<td className='border-b border-gray-200 px-3 text-sm p-3'>
														7AM - 7PM
													</td>
													<td className='border-b border-gray-200 px-3 text-sm p-3'>
														11/11/2024
													</td>
													<td className='border-b border-gray-200 px-3 text-sm p-3'>
														Fernando Garcia M.
													</td>
													<td className='border-b border-gray-200 px-3 text-sm p-3'>
														Victoria Rehab
													</td>
													<td className='border-b border-gray-200 px-3 text-sm p-3'>
														Assisted
													</td>
													<td className='border-b border-gray-200 px-3 text-sm p-3'>
														In Campus
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</AtAccordionItem>
						</Accordion>
					</div>
				</div>
			</div>
		</AppLayout>
	);
};

export default MyShiftsPage;
