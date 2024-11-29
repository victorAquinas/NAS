import { useEffect, useState } from 'react';
import { Semester } from '../../api/types';
import { getSemesters } from '../../api/services';
import AtButton from '../../components/AtButton';
import { AiOutlineEye } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { getCookieItem } from '../../utils/cookies';

export const useSemesters = () => {
	const [semesters, setSemesters] = useState<Semester[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const userEmail = getCookieItem('user_email');

	const renderSemesterList = (filterActive: boolean, title: string) => {
		const filteredSemesters = semesters.filter(
			(semester) => semester.semester_status === filterActive
		);

		return (
			<div className='inactive-list w-full'>
				<h2 className='font-medium pb-4'>{title}</h2>
				<div className='list flex flex-col gap-2 h-full max-h-[calc(73vh-140px)] overflow-y-auto'>
					{isLoading && (
						<AtButton
							variant={filterActive ? 'primary' : 'white'}
							className='flex items-center w-[330px] justify-center'
						>
							Loading...
							<span className='text-[1.7rem] pl-4'>
								<AiOutlineEye />
							</span>
						</AtButton>
					)}
					{!isLoading && filteredSemesters.length === 0 && (
						<AtButton
							variant={filterActive ? 'transparent' : 'white'}
							className='w-full'
						>
							{filterActive ? 'No Active Semesters' : 'No Closed Semesters'}
						</AtButton>
					)}
					{!isLoading &&
						filteredSemesters.map((semester) => (
							<Link
								key={semester.semester_id}
								to={`/my-courses/${semester.semester_id}`}
							>
								<AtButton
									variant={filterActive ? 'primary' : 'white'}
									className='flex items-center w-[330px] justify-center'
								>
									{semester.semester_name}
									<span className='text-[1.7rem] pl-4'>
										<AiOutlineEye />
									</span>
								</AtButton>
							</Link>
						))}
				</div>
			</div>
		);
	};

	const handleGetSemesters = async (email: string) => {
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
		if (userEmail) {
			handleGetSemesters(userEmail);
		}
	}, [userEmail]);

	return { semesters, isLoading, renderSemesterList };
};
