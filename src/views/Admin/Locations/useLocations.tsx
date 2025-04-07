import { useEffect, useState } from 'react';
import {
	createLocation,
	desactivateLocation,
	getLocations,
} from '../../../api/adminServices';
import { AdminHeadquarter } from '../../../api/types';
import { toast } from 'react-toastify';
import { ErrorMessages } from '../../../constants/text';
import { AxiosError } from 'axios';

export const useLocations = () => {
	const [isAddLocationModalOpen, setIsAddLocationModalOpen] =
		useState<boolean>(false);
	const [locationName, setLocationName] = useState<string>('');
	const [locations, setLocations] = useState<AdminHeadquarter[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [showDeleteLocationModal, setShowDeleteLocationModal] =
		useState<boolean>(false);
	const [locationIdToDelete, setLocationIdToDelete] = useState<number>(-99);
	const [institutionId, setInstitutionId] = useState<number>();

	const handleOpenAddLocationModal = () => {
		setIsAddLocationModalOpen(true);
		setLocationName('');
	};

	const handleCloseAddLocationModal = () => {
		setIsAddLocationModalOpen(false);
	};

	const getInstitutionLocations = async () => {
		setIsLoading(true);
		try {
			const response = (await getLocations()) as unknown as AdminHeadquarter;

			if (response?.error) {
				setLocations([]);
				setInstitutionId(response?.institution_id);
				return;
			}
			const fullResponse = response as unknown as AdminHeadquarter[];

			const activeLocations = fullResponse?.filter(
				(location) => location.is_active
			);

			setLocations(activeLocations);
			setInstitutionId(fullResponse[0]?.institution_id);
			return fullResponse;
		} catch (error) {
			const axiosError = error as AxiosError;

			if (axiosError.status === 404) {
				return;
			}

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
		institutionId,
	};
};
