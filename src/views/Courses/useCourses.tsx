import { useParams } from 'react-router-dom';
import { StudentProgram } from '../../api/types';
import { useEffect, useState } from 'react';
import { getSemesters } from '../../api/services';
import { toast } from 'react-toastify';
import { getCookieItem } from '../../utils/cookies';

export const useCourses = () => {
	const [courses, setCourses] = useState<StudentProgram[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const userEmail = getCookieItem('user_email');

	const { semesterID } = useParams();
	console.log('SEMESTRE', semesterID);

	const handleGetSemesterCourses = async (
		email: string,
		semesterID: string
	) => {
		setIsLoading(true);
		try {
			const getSemesterById = (semesterId: string) => {
				return semesters.data.filter(
					(semester) => semester?.semester_id === parseInt(semesterId)
				);
			};

			const semesters = await getSemesters(email);
			const semester = getSemesterById(semesterID);
			const courses = semester[0]?.student_programs;

			setCourses(courses);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (semesterID && userEmail) {
			handleGetSemesterCourses(userEmail, semesterID);
		}

		if (!semesterID || !userEmail) {
			toast.error('Error while finding email or semester id');
		}
	}, [userEmail, semesterID]);

	return { isLoading, courses };
};
