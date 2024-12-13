import { AppLayout } from '../../../layouts/AppLayout';
import { SlLocationPin } from 'react-icons/sl';
import { AtIconButton } from '../../../components/AtIconButton';
import AtButton from '../../../components/AtButton';
import { MlActionModal } from '../../../components/MlModal/MlActionModal';
import { useLocations } from './useLocations';

const AdminLocations = () => {
	const {
		isAddLocationModalOpen,
		handleOpenAddLocationModal,
		handleCloseAddLocationModal,
	} = useLocations();
	return (
		<AppLayout course={'Administrator'} programSemesterId={'4' as string}>
			<MlActionModal
				isOpen={isAddLocationModalOpen}
				closeButtonLabel='Cancel'
				onClose={handleCloseAddLocationModal}
				actionButtonLabel='Add Location'
				title='Add a location'
			>
				<form className='flex flex-col gap-4 mt-4'>
					<input
						type='text'
						id='email'
						placeholder='Location Name'
						// {...register('email')}
						className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>
				</form>
			</MlActionModal>
			<div className='header flex justify-between'>
				<div className='left'>
					<h2 className='text-xl font-medium'>
						Administration Panel - Locations
					</h2>
					<p className='text-sm max-w-[50rem]'>
						Manage and view all institutional locations.
					</p>
				</div>
				<div className='right'>
					<AtButton variant='secondary' onClick={handleOpenAddLocationModal}>
						Add Location
					</AtButton>
				</div>
			</div>

			<div className='location-list pt-6 flex flex-wrap gap-8 w-full justify-center lg:justify-start'>
				<AtIconButton
					href='/admin/semester/1'
					label='CMVC Miami'
					Icon={SlLocationPin}
				/>
				<AtIconButton
					href='/admin/semester/1'
					label='CMVC Miami'
					Icon={SlLocationPin}
				/>
				<AtIconButton
					href='/admin/semester/1'
					label='CMVC Miami'
					Icon={SlLocationPin}
				/>
				<AtIconButton
					href='/admin/semester/1'
					label='CMVC Miami'
					Icon={SlLocationPin}
				/>
			</div>
		</AppLayout>
	);
};

export default AdminLocations;
