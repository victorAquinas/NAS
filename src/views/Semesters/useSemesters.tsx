import { useEffect, useState } from 'react';
import { Semester } from '../../api/types';
import { getSemesters } from '../../api/services';

export const useSemesters = (email: string) => {
	const [semesters, setSemesters] = useState<Semester[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleGetSemesters = async () => {
		setIsLoading(true);
		try {
			const semesters = await getSemesters(email);
			setSemesters(semesters.data);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		handleGetSemesters();
	}, [email]);

	return { semesters, isLoading };
};
