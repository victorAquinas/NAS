import AtButton from '../../../components/AtButton';
import { MlGroupCard } from '../../../components/MlGroupCard';
import { MlActionModal } from '../../../components/MlModal/MlActionModal';
import { AppLayout } from '../../../layouts/AppLayout';
import { useAdminGroup } from './useAdminGroup';

const AdminGroup = () => {
	const {
		isAddGroupModalOpen,
		handleCloseAddGroupModal,
		handleOpenAddGroupModal,
	} = useAdminGroup();
	return (
		<AppLayout course={'Administrator'} programSemesterId={'4' as string}>
			<MlActionModal
				isOpen={isAddGroupModalOpen}
				closeButtonLabel='Cancel'
				onClose={handleCloseAddGroupModal}
				actionButtonLabel='Add Group'
				title='Add a group'
				styles={{ height: '90vh' }}
			>
				<form className='flex flex-col gap-4 mt-4'>
					<input
						type='text'
						id='email'
						placeholder='Group Name'
						className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>

					<div className='off-site flex flex-col gap-4'>
						<div className='form-subtitle'>
							<h3 className='text-xl font-medium py-2'>Off-site</h3>
						</div>

						<select
							name='#'
							id='#'
							className='w-full h-full bg-white p-3 text-gray-400 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
						>
							<option value='all'>Select off-site place</option>
						</select>
						<input
							type='text'
							id='email'
							placeholder='How many practices per weeks'
							className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
						/>
						<select
							name='#'
							id='#'
							className='w-full h-full bg-white p-3 text-gray-400 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
						>
							<option value='all'>Select off-site coordinator</option>
						</select>

						<div className='two-columns flex items-center gap-x-[1%]'>
							<div className='left w-[49%]'>
								<input
									type='text'
									id='email'
									placeholder='Start date'
									className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
								/>
							</div>
							<div className='right w-[49%]'>
								<input
									type='text'
									id='email'
									placeholder='End date'
									className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
								/>
							</div>
						</div>
					</div>

					<hr />

					<div className='in-site flex flex-col gap-4'>
						<div className='form-subtitle'>
							<h3 className='text-xl font-medium py-2'>In-site</h3>
						</div>

						<select
							name='#'
							id='#'
							className='w-full h-full bg-white p-3 text-gray-400 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
						>
							<option value='all'>Select In-site place</option>
						</select>
						<input
							type='text'
							id='email'
							placeholder='How many practices per weeks'
							className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
						/>
						<select
							name='#'
							id='#'
							className='w-full h-full bg-white p-3 text-gray-400 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
						>
							<option value='all'>Select In-site coordinator</option>
						</select>

						<div className='two-columns flex items-center gap-x-[1%]'>
							<div className='left w-[49%]'>
								<input
									type='text'
									id='email'
									placeholder='Start date'
									className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
								/>
							</div>
							<div className='right w-[49%]'>
								<input
									type='text'
									id='email'
									placeholder='End date'
									className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
								/>
							</div>
						</div>
					</div>
				</form>
			</MlActionModal>
			<h2 className='text-xl font-medium'>Dental Assistant</h2>
			<ul className='sub-menu flex items-center w-full gap-x-4 mt-6 border-b border-gray-300'>
				<li className='border-b border-b-primary text-primary'>Groups</li>
				<li>Applications</li>
			</ul>

			{/* No groups */}
			{/* <div className='no-groups flex justify-center items-center h-[500px] text-lg flex-col'>
				You have not created a group yet, please create one to continue
				<div className='mt-6'>
					<AtButton variant='primary' onClick={handleOpenAddGroupModal}>
						Create Group
					</AtButton>
				</div>
			</div> */}

			{/* Groups */}
			<div className='group-list mt-4'>
				<div className='btn-section flex justify-end'>
					<div className='save-btn'>
						<AtButton variant='secondary' onClick={handleOpenAddGroupModal}>
							Save
						</AtButton>
					</div>
				</div>

				<div className='group-container pt-6'>
					<div className='group-header flex items-center mb-4'>
						<div className='group-name max-w-[300px]'>
							<input
								type='text'
								id='email'
								placeholder='Group Name'
								className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
							/>
						</div>

						<div className='max-students flex items-center w-2/3'>
							<div className='w-[8rem] pl-4'> Max Students</div>
							<div>
								<input
									type='text'
									id='email'
									placeholder='Example: 10'
									className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
								/>
							</div>
						</div>
					</div>
					<div className='group-section flex flex-col gap-y-8 xl:flex-row xl:gap-x-8 pb-8 border-b border-black'>
						{/* In-site */}
						<MlGroupCard
							type='in-site'
							address='Universidad de Victoria, Columbia Británica, Canada. 4300 NW 12th Ave, 3327 - 0.5 km'
							shift='7:00AM - 7:00 PM'
							name='Victoria Rehab'
						/>

						{/* Off-site */}
						<MlGroupCard
							type='off-site'
							address='Universidad de Victoria, Columbia Británica, Canada. 4300 NW 12th Ave, 3327 - 0.5 km'
							shift='7:00AM - 7:00 PM'
							name='Victoria Rehab'
						/>
					</div>
				</div>

				<div className='group-container pt-6'>
					<div className='group-header flex items-center mb-4'>
						<div className='group-name max-w-[300px]'>
							<input
								type='text'
								id='email'
								placeholder='Group Name'
								className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
							/>
						</div>

						<div className='max-students flex items-center w-2/3'>
							<div className='w-[8rem] pl-4'> Max Students</div>
							<div>
								<input
									type='text'
									id='email'
									placeholder='Example: 10'
									className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
								/>
							</div>
						</div>
					</div>
					<div className='group-section flex flex-col gap-y-8 xl:flex-row xl:gap-x-8 pb-8 border-b border-black'>
						{/* In-site */}
						<MlGroupCard
							type='in-site'
							address='Universidad de Victoria, Columbia Británica, Canada. 4300 NW 12th Ave, 3327 - 0.5 km'
							shift='7:00AM - 7:00 PM'
							name='Victoria Rehab'
						/>

						{/* Off-site */}
						<MlGroupCard
							type='off-site'
							address='Universidad de Victoria, Columbia Británica, Canada. 4300 NW 12th Ave, 3327 - 0.5 km'
							shift='7:00AM - 7:00 PM'
							name='Victoria Rehab'
						/>
					</div>
				</div>

				<div className='add-new-section flex justify-center py-4 pb-10'>
					<AtButton variant='primary'>Add New Group</AtButton>
				</div>
			</div>
		</AppLayout>
	);
};

export default AdminGroup;
