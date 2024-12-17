import { useEffect, useState } from 'react';
import { AdminHeadquarter } from '../../../api/types';
import { useParams } from 'react-router-dom';
import { createSemester, getLocations } from '../../../api/adminServices';
import { toast } from 'react-toastify';
import { transformDateString } from '../../../utils/transformDateString';

export const useAdminSemesters = () => {
	const { locationId } = useParams();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isAddSemesterModalOpen, setIsAddSemesterModalOpen] =
		useState<boolean>(false);
	const [semesters, setSemesters] = useState<AdminHeadquarter>();

	// Modal
	const [semesterName, setSemesterName] = useState<string>('');
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);

	const handleOpenAddLocationModal = () => {
		setIsAddSemesterModalOpen(true);
	};

	const handleCloseAddLocationModal = () => {
		setIsAddSemesterModalOpen(false);
	};

	const getSemesters = async (locationId: string) => {
		setIsLoading(true);
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
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddSemester = async (
		semesterName: string,
		startDate: Date | null,
		endDate: Date | null,
		locationId: string
	) => {
		try {
			if (semesterName === '' || endDate === null || startDate === null) {
				return toast.warning('All fields should be filled');
			}

			await createSemester(
				semesterName,
				transformDateString(startDate.toISOString(), 'YYYY-MM-DD'),
				transformDateString(endDate.toISOString(), 'YYYY-MM-DD'),
				locationId
			);

			getSemesters(locationId);

			setSemesterName('');
			setStartDate(null);
			setEndDate(null);
			handleCloseAddLocationModal();
		} catch (error) {
			console.error(error);
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
		isLoading,
		handleAddSemester,
		semesterName,
		setSemesterName,
		startDate,
		setStartDate,
		setEndDate,
		endDate,
		locationId,
	};
};
