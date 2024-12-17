import { useEffect, useState } from 'react';
import { AdminHeadquarter } from '../../../api/types';
import { useParams } from 'react-router-dom';
import { getLocations } from '../../../api/adminServices';

export const useAdminSemesters = () => {
	const { locationId } = useParams();
	const [isAddSemesterModalOpen, setIsAddSemesterModalOpen] =
		useState<boolean>(false);
	const [semesters, setSemesters] = useState<AdminHeadquarter>();
	const handleOpenAddLocationModal = () => {
		setIsAddSemesterModalOpen(true);
	};

	const handleCloseAddLocationModal = () => {
		setIsAddSemesterModalOpen(false);
	};

	const getSemesters = async (locationId: string) => {
		try {
			const req = await getLocations();
			const semesters = req.filter(
				(location) => location.headquarter_id === parseInt(locationId)
			);

			console.log('Req', req);
			setSemesters(semesters[0]);
			return req;
		} catch (error) {
			console.error(error);
			setSemesters(undefined);
		}
	};

	useEffect(() => {
		if (locationId) {
			getSemesters(locationId);
		}
	}, [locationId]);
	return {
		isAddSemesterModalOpen,
		handleOpenAddLocationModal,
		handleCloseAddLocationModal,
		semesters,
	};
};
