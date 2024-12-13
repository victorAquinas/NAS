import AtButton from '../../../components/AtButton';
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

			<div className='no-groups flex justify-center items-center h-[500px] text-lg flex-col'>
				You have not created a group yet, please create one to continue
				<div className='mt-6'>
					<AtButton variant='primary' onClick={handleOpenAddGroupModal}>
						Create Group
					</AtButton>
				</div>
			</div>
		</AppLayout>
	);
};

export default AdminGroup;
