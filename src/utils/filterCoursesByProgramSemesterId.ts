import { AdminHeadquarter, AdminProgramIn, AdminSemester } from '../api/types';

export const filterCoursesByProgramSemesterId = (
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

export const filterCoursesBySemesterId = (
	data: AdminHeadquarter[],
	semesterId: number
): AdminSemester => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: any[] = [];

	data.forEach((headquarter) => {
		headquarter.semesters_in.forEach((semester) => {
			if (semester.semester_id === semesterId) {
				result.push(semester);
			}
		});
		// headquarter.semesters_in.forEach((semester) => {
		// 	// const filteredPrograms = semester.programs_in.filter(
		// 	// 	(programIn) => programIn.program_semester_id === targetId
		// 	// );

		// 	result.push(...filteredPrograms);
		// });
	});

	return result[0];
};
