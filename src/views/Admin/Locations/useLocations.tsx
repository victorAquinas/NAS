import { useEffect, useState } from 'react';
import { createLocation, getLocations } from '../../../api/adminServices';
import { AdminHeadquarter } from '../../../api/types';
import { toast } from 'react-toastify';
import { ErrorMessages } from '../../../constants/text';

export const useLocations = () => {
	const [isAddLocationModalOpen, setIsAddLocationModalOpen] =
		useState<boolean>(false);
	const [locationName, setLocationName] = useState<string>('');
	const [locations, setLocations] = useState<AdminHeadquarter[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

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
			setLocations(req);
			return req;
		} catch (error) {
			console.error(error);
			setLocations([]);
			toast.error(ErrorMessages.GENERAL_ERROR);
		} finally {
			setIsLoading(false);
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
			toast.success('Location created successfully');
			getInstitutionLocations();
			handleCloseAddLocationModal();
		} catch (error) {
			console.error(error);
			toast.error(ErrorMessages.GENERAL_ERROR);
		}
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
	};
};
