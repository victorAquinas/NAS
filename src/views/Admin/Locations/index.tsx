import { SlLocationPin } from 'react-icons/sl';
import { AtIconButton } from '../../../components/AtIconButton';
import AtButton from '../../../components/AtButton';
import { MlActionModal } from '../../../components/MlModal/MlActionModal';
import { useLocations } from './useLocations';
import { AtLoadingWrapper } from '../../../components/AtLoadingWrapper';
import { toast } from 'react-toastify';
import { AdminLayout } from '../../../layouts/AdminLayout';

const AdminLocations = () => {
	const {
		isAddLocationModalOpen,
		handleOpenAddLocationModal,
		handleCloseAddLocationModal,
		locationName,
		setLocationName,
		locations,
		handleAddLocation,
		isLoading,
		handleDesactivateLocation,
		showDeleteLocationModal,
		handleShowDeleteLocationModal,
		handleCloseDeleteLocationModal,
		locationIdToDelete,
	} = useLocations();

	return (
		<AdminLayout>
			<MlActionModal
				isOpen={isAddLocationModalOpen}
				closeButtonLabel='Cancel'
				onClose={handleCloseAddLocationModal}
				actionButtonLabel='Add Location'
				title='Add a location'
				onAction={() =>
					toast.promise(
						handleAddLocation(
							locationName,
							import.meta.env.VITE_INSTITUTION_ID
						),
						{
							pending: 'Adding location',
							success: 'Location created successfully',
							error: 'Error adding location',
						}
					)
				}
			>
				<form className='flex flex-col gap-4 mt-4'>
					<input
						type='text'
						id='email'
						onChange={(e) => setLocationName(e.target.value)}
						value={locationName}
						placeholder='Location Name'
						className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>
				</form>
			</MlActionModal>

			<MlActionModal
				isOpen={showDeleteLocationModal}
				onAction={() => {
					handleDesactivateLocation(locationIdToDelete);
				}}
				isLoading={false}
				onClose={handleCloseDeleteLocationModal}
				title='Are you sure you want to delete this location?'
				description='This action cannot be undone.'
				closeButtonLabel='Cancel'
				actionButtonLabel='Delete'
				variant='danger'
			></MlActionModal>

			<AtLoadingWrapper isLoading={isLoading} />
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
				{locations.length === 0 && (
					<div className='font-medium text-lg'>No Locations Found</div>
				)}

				{locations.length > 0 &&
					locations.map((location) => (
						<AtIconButton
							key={location.headquarter_id}
							href={`/admin/semester/${location.headquarter_id}`}
							label={location.headquarter_name}
							Icon={SlLocationPin}
							tooltipId={`tooltip-${location.headquarter_id}`}
							tooltipContent='Delete Location'
							deleteLocationClick={() =>
								handleShowDeleteLocationModal(location.headquarter_id)
							}
						/>
					))}
			</div>
		</AdminLayout>
	);
};

export default AdminLocations;
