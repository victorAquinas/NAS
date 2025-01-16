import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	createCourse,
	desactivateCourse,
	getLocations,
} from '../../../api/adminServices';
import { AdminProgramIn } from '../../../api/types';
import { toast } from 'react-toastify';
import { transformDateString } from '../../../utils/transformDateString';
import { filterCoursesBySemesterId } from '../../../utils/filterCoursesByProgramSemesterId';

export const useCourses = () => {
	const navigate = useNavigate();
	const { programSemesterId, semesterId, locationId } = useParams();
	const [courses, setCourses] = useState<AdminProgramIn[]>([]);
	const [maxEnrollmentDate, setMaxEnrollmentDate] = useState<Date | null>(null);
	const [courseName, setCourseName] = useState<string>('');
	const [isAddCourseModalOpen, setIsAddCourseModalOpen] =
		useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [showDeleteCourseModal, setShowDeleteCourseModal] =
		useState<boolean>(false);
	const [programSemesterIdToDelete, setProgramSemesterIdToDelete] =
		useState<number>(-99);
	const [location, setLocation] = useState<{
		headquarter_id: number;
		headquarter_name: string;
	}>({
		headquarter_id: 0,
		headquarter_name: '',
	});

	const handleOpenAddCourseModal = () => {
		setIsAddCourseModalOpen(true);
	};

	const handleCloseAddCourseModal = () => {
		setIsAddCourseModalOpen(false);
	};

	const getCourses = async (semesterId: string, locationId: string) => {
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
			const currentSemester = filterCoursesBySemesterId(
				req,
				parseInt(semesterId ?? '')
			);

			const activeCourses = currentSemester.programs_in.filter(
				(program) => program.program_semester_status
			);

			console.log('Acive', activeCourses);

			if (currentSemester) {
				setCourses(activeCourses);
			}

			return currentSemester;
		} catch (error) {
			console.error(error);
			setCourses([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddCourse = async (
		name: string,
		semesterId: string,
		maxEnrollmentDate: Date | null,
		locationId: string
	) => {
		const clearModal = () => {
			setCourseName('');
			setMaxEnrollmentDate(null);
		};
		try {
			if (name === '' || maxEnrollmentDate === null) {
				return toast.warning('All fields should be filled');
			}
			await createCourse(
				name,
				semesterId,
				transformDateString(maxEnrollmentDate.toISOString(), 'YYYY-MM-DD')
			);

			const currentSemester = await getCourses(semesterId, locationId);

			if (currentSemester) {
				if (
					currentSemester?.programs_in?.length > 0 &&
					programSemesterId === 'no-courses'
				) {
					navigate(
						`/admin/courses/${currentSemester?.programs_in[0]?.program_semester_id}/semester/${currentSemester.semester_id}/location/${locationId}`
					);
				}
			}

			clearModal();
			handleCloseAddCourseModal();
		} catch (error) {
			console.error(error);
		}
	};

	const handleDesactivateCourse = async (
		programSemesterId: number,
		locationId: string
	) => {
		const idLoading = toast.loading('Deleting course');
		try {
			await desactivateCourse(programSemesterId);
			if (semesterId) {
				getCourses(semesterId, locationId);
			}
			toast.update(idLoading, {
				render: 'Course deleted',
				type: 'success',
				isLoading: false,
				autoClose: 500,
			});
			getCourses(semesterId ?? '', locationId);
			handleCloseDeleteCourseModal();
		} catch (error) {
			console.error(error);
			toast.update(idLoading, {
				render: 'Error',
				type: 'error',
				isLoading: false,
				autoClose: 1000,
			});
		}
	};

	const handleShowDeleteCourseModal = (programSemesterId: number) => {
		setShowDeleteCourseModal(true);
		setProgramSemesterIdToDelete(programSemesterId);
	};

	const handleCloseDeleteCourseModal = () => {
		setShowDeleteCourseModal(false);
		setProgramSemesterIdToDelete(-99);
	};

	useEffect(() => {
		if (programSemesterId && programSemesterId !== 'no-courses' && locationId) {
			getCourses(semesterId ?? '', locationId);
		} else {
			setIsLoading(false);
		}
	}, [programSemesterId, semesterId, locationId]);

	return {
		isAddCourseModalOpen,
		handleOpenAddCourseModal,
		handleCloseAddCourseModal,
		courses,
		programSemesterId,
		setMaxEnrollmentDate,
		maxEnrollmentDate,
		courseName,
		setCourseName,
		handleAddCourse,
		semesterId,
		isLoading,
		handleDesactivateCourse,
		handleCloseDeleteCourseModal,
		handleShowDeleteCourseModal,
		programSemesterIdToDelete,
		showDeleteCourseModal,
		locationId,
		location,
	};
};
