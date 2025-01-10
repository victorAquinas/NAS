import { useEffect, useState } from 'react';
import {
	createLocation,
	desactivateLocation,
	getLocations,
} from '../../../api/adminServices';
import { AdminHeadquarter } from '../../../api/types';
import { toast } from 'react-toastify';
import { ErrorMessages } from '../../../constants/text';

export const useLocations = () => {
	const [isAddLocationModalOpen, setIsAddLocationModalOpen] =
		useState<boolean>(false);
	const [locationName, setLocationName] = useState<string>('');
	const [locations, setLocations] = useState<AdminHeadquarter[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [showDeleteLocationModal, setShowDeleteLocationModal] =
		useState<boolean>(false);
	const [locationIdToDelete, setLocationIdToDelete] = useState<number>(-99);

	const handleOpenAddLocationModal = () => {
		setIsAddLocationModalOpen(true);
	};

	const handleCloseAddLocationModal = () => {
		setIsAddLocationModalOpen(false);
	};

	const getInstitutionLocations = async () => {
		setIsLoading(true);
		try {
			const req = await getLocations();
			const activeLocations = req?.filter((location) => location.is_active);

			setLocations(activeLocations);
			return req;
		} catch (error) {
			console.error(error);
			setLocations([]);
			toast.error(ErrorMessages.GENERAL_ERROR);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDesactivateLocation = async (locationId: number) => {
		const idLoading = toast.loading('Deleting location');
		try {
			await desactivateLocation(locationId);
			await getInstitutionLocations();
			toast.update(idLoading, {
				render: 'Location deleted',
				type: 'success',
				isLoading: false,
				autoClose: 1000,
			});
			handleCloseDeleteLocationModal();
		} catch (error) {
			toast.update(idLoading, {
				render: 'Error',
				type: 'error',
				isLoading: false,
				autoClose: 1000,
			});
			console.error(error);
		}
	};

	const handleAddLocation = async (
		locationName: string,
		institutionId: string
	) => {
		try {
			if (locationName === '' || institutionId === '') {
				return toast.warning('Location name can not be empty');
			}

			await createLocation(locationName, institutionId);
			getInstitutionLocations();
			handleCloseAddLocationModal();
			setLocationName('');
		} catch (error) {
			console.error(error);
		}
	};

	const handleShowDeleteLocationModal = (locationId: number) => {
		setShowDeleteLocationModal(true);
		setLocationIdToDelete(locationId);
	};

	const handleCloseDeleteLocationModal = () => {
		setShowDeleteLocationModal(false);
		setLocationIdToDelete(-99);
	};

	useEffect(() => {
		getInstitutionLocations();
	}, []);

	return {
		isAddLocationModalOpen,
		handleOpenAddLocationModal,
		handleCloseAddLocationModal,
		locations,
		handleAddLocation,
		locationName,
		setLocationName,
		isLoading,
		handleDesactivateLocation,
		showDeleteLocationModal,
		handleShowDeleteLocationModal,
		handleCloseDeleteLocationModal,
		locationIdToDelete,
	};
};
