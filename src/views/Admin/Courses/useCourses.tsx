import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCourse, getLocations } from '../../../api/adminServices';
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

			if (currentSemester) {
				setCourses(currentSemester.programs_in);
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
	};
};
