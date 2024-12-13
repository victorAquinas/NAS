import { AppLayout } from '../../../layouts/AppLayout';
import AtButton from '../../../components/AtButton';
import { MlActionModal } from '../../../components/MlModal/MlActionModal';
import { useAdminSemesters } from './useAdminSemesters';
import { AtBadge } from '../../../components/AtBadge';
import { LuEye } from 'react-icons/lu';

const AdminSemesters = () => {
	const {
		isAddSemesterModalOpen,
		handleOpenAddLocationModal,
		handleCloseAddLocationModal,
	} = useAdminSemesters();
	return (
		<AppLayout course={'Administrator'} programSemesterId={'4' as string}>
			<MlActionModal
				isOpen={isAddSemesterModalOpen}
				closeButtonLabel='Cancel'
				onClose={handleCloseAddLocationModal}
				actionButtonLabel='Add Semester'
				title='Add a Semester'
			>
				<form className='flex flex-col gap-4 mt-4'>
					<input
						type='text'
						id='email'
						placeholder='Name'
						// {...register('email')}
						className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>
					<input
						type='text'
						id='start-date'
						placeholder='Start date'
						// {...register('email')}
						className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>
					<input
						type='text'
						id='email'
						placeholder='End date'
						// {...register('email')}
						className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>
				</form>
			</MlActionModal>

			<div className='header flex justify-between'>
				<div className='left'>
					<h2 className='text-xl font-medium'>
						Administration Panel - Semesters
					</h2>
					<p className='text-sm max-w-[50rem]'>
						Manage and view all semesters.
					</p>
				</div>
				<div className='right'>
					<AtButton variant='secondary' onClick={handleOpenAddLocationModal}>
						Add semester
					</AtButton>
				</div>
			</div>

			<div className='table w-full mt-12'>
				<table className='border-collapse  w-full'>
					<thead>
						<tr>
							<th className='border border-gray-200 bg-primary_light font-normal px-3 py-2 text-start'>
								Name
							</th>
							<th className='border border-gray-200 bg-primary_light font-normal px-3 py-2 text-start'>
								Dates
							</th>
							<th className='border border-gray-200 bg-primary_light font-normal px-3 py-2 text-start'>
								State
							</th>
							<th className='border border-gray-200 bg-primary_light font-normal px-3 py-2 text-start'>
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						<tr className='text-center bg-white'>
							<td className='border-b border-gray-200 px-3 p-3  text-start'>
								Primavera 2024
							</td>
							<td className='border-b border-gray-200 px-3 p-3  text-start'>
								01/01/2024 - 06/30/2024
							</td>
							<td className='border-b border-gray-200 px-3 p-3  text-start'>
								<AtBadge label='Active' variant='primary' />
							</td>
							<td className='border-b border-gray-200 px-3 p-3  text-start'>
								<span className='text-2xl'>
									<LuEye />
								</span>
							</td>
						</tr>
						<tr className='text-center bg-white'>
							<td className='border-b border-gray-200 px-3 p-3  text-start'>
								Otoño 2023
							</td>
							<td className='border-b border-gray-200 px-3 p-3  text-start'>
								01/01/2024 - 06/30/2024
							</td>
							<td className='border-b border-gray-200 px-3 p-3  text-start'>
								<AtBadge label='Inactive' variant='danger' />
							</td>
							<td className='border-b border-gray-200 px-3 p-3  text-start'>
								<span className='text-2xl'>
									<LuEye />
								</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</AppLayout>
	);
};

export default AdminSemesters;
