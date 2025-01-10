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
	const { programSemesterId, semesterId } = useParams();
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

	const handleOpenAddCourseModal = () => {
		setIsAddCourseModalOpen(true);
	};

	const handleCloseAddCourseModal = () => {
		setIsAddCourseModalOpen(false);
	};

	const getCourses = async (semesterId: string) => {
		setIsLoading(true);
		try {
			const req = await getLocations();

			const currentSemester = filterCoursesBySemesterId(
				req,
				parseInt(semesterId ?? '')
			);

			const activeCourses = currentSemester.programs_in.filter(
				(program) => program.program_semester_status
			);

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
		maxEnrollmentDate: Date | null
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

			const currentSemester = await getCourses(semesterId);

			if (currentSemester) {
				if (
					currentSemester?.programs_in?.length > 0 &&
					programSemesterId === 'no-courses'
				) {
					navigate(
						`/admin/courses/${currentSemester?.programs_in[0]?.program_semester_id}/semester/${currentSemester.semester_id}`
					);
				}
			}

			clearModal();
			handleCloseAddCourseModal();
		} catch (error) {
			console.error(error);
		}
	};

	const handleDesactivateCourse = async (programSemesterId: number) => {
		const idLoading = toast.loading('Deleting course');
		try {
			await desactivateCourse(programSemesterId);
			if (semesterId) {
				getCourses(semesterId);
			}
			toast.update(idLoading, {
				render: 'Course deleted',
				type: 'success',
				isLoading: false,
				autoClose: 500,
			});
			getCourses(semesterId ?? '');
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
		if (programSemesterId && programSemesterId !== 'no-courses') {
			getCourses(semesterId ?? '');
		} else {
			setIsLoading(false);
		}
	}, [programSemesterId, semesterId]);

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
	};
};
