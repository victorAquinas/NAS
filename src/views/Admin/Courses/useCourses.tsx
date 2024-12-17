import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLocations } from '../../../api/adminServices';
import { AdminHeadquarter, AdminProgramIn } from '../../../api/types';

export const useCourses = () => {
	const { programSemesterId } = useParams();
	const [courses, setCourses] = useState<AdminProgramIn[]>([]);
	const [isAddCourseModalOpen, setIsAddCourseModalOpen] =
		useState<boolean>(false);

	const handleOpenAddCourseModal = () => {
		setIsAddCourseModalOpen(true);
	};

	const handleCloseAddCourseModal = () => {
		setIsAddCourseModalOpen(false);
	};

	const filterCoursesByProgramSemesterId = (
		data: AdminHeadquarter[],
		targetId: number
	): AdminProgramIn[] => {
		const result: AdminProgramIn[] = [];

		data.forEach((headquarter) => {
			headquarter.semesters_in.forEach((semester) => {
				const filteredPrograms = semester.programs_in.filter(
					(programIn) => programIn.program_semester_id === targetId
				);

				result.push(...filteredPrograms);
			});
		});

		return result;
	};

	const getCourses = async (programSemesterId: string) => {
		try {
			const req = await getLocations();

			const filteredCourses = filterCoursesByProgramSemesterId(
				req,
				parseInt(programSemesterId)
			);
			setCourses(filteredCourses);
			console.log('Req', req);

			return req;
		} catch (error) {
			console.error(error);
			setCourses([]);
		}
	};

	useEffect(() => {
		if (programSemesterId) {
			getCourses(programSemesterId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [programSemesterId]);

	return {
		isAddCourseModalOpen,
		handleOpenAddCourseModal,
		handleCloseAddCourseModal,
		courses,
	};
};
