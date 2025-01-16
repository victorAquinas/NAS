import { useEffect, useState } from 'react';
import { AdminHeadquarter } from '../../../api/types';
import { useParams } from 'react-router-dom';
import {
	createSemester,
	desactivateSemester,
	getLocations,
} from '../../../api/adminServices';
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
	const [showDeleteSemesterModal, setShowDeleteSemesterModal] =
		useState<boolean>(false);
	const [semesterIdToDelete, setSemesterIdToDelete] = useState<number>(-99);
	const [location, setLocation] = useState<{
		headquarter_id: number;
		headquarter_name: string;
	}>({
		headquarter_id: 0,
		headquarter_name: '',
	});

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
			const currentActiveSemesters = {
				...semesters[0],
				semesters_in: semesters[0].semesters_in.filter(
					(semester) => semester.semester_is_active
				),
			};
			setLocation({
				headquarter_id: currentActiveSemesters.headquarter_id,
				headquarter_name: currentActiveSemesters.headquarter_name,
			});
			console.log('Current Active Semester', currentActiveSemesters);
			setSemesters(currentActiveSemesters);
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

	const handleDesactivateSemester = async (semesterId: number) => {
		const idLoading = toast.loading('Deleting Semester');
		try {
			await desactivateSemester(semesterId);
			if (locationId) {
				getSemesters(locationId);
			}
			toast.update(idLoading, {
				render: 'Semester deleted',
				type: 'success',
				isLoading: false,
				autoClose: 1000,
			});
			handleCloseDeleteSemesterModal();
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

	const handleShowDeleteSemesterModal = (semesterId: number) => {
		setShowDeleteSemesterModal(true);
		setSemesterIdToDelete(semesterId);
	};

	const handleCloseDeleteSemesterModal = () => {
		setShowDeleteSemesterModal(false);
		setSemesterIdToDelete(-99);
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
		handleDesactivateSemester,
		handleShowDeleteSemesterModal,
		handleCloseDeleteSemesterModal,
		semesterIdToDelete,
		showDeleteSemesterModal,
		location,
	};
};
