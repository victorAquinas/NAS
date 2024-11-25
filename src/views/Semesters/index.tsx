import { AiOutlineEye } from 'react-icons/ai';
import AtButton from '../../components/AtButton';
import { BasicLayout } from '../../layouts/BasicLayout';
import { useSemesters } from './useSemesters';
import { Link } from 'react-router-dom';

export const Semesters = () => {
	const { semesters, isLoading } = useSemesters('daniel+student');

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

	return (
		<BasicLayout className='!items-start !pt-12'>
			<div className='flex flex-col justify-center text-center'>
				<h1 className='text-2xl font-medium'>Semesters</h1>
				<div className='text-center max-w-[43rem]'>
					<p>
						Select the <span className='text-primary'>active</span> semester to
						continue. You can also view closed semesters to review information
						from previous periods.
					</p>
				</div>
				<div className='list flex justify-between mt-6 gap-6 max-w-[43rem]'>
					{renderSemesterList(false, 'Closed')}
					{renderSemesterList(true, 'Active')}
				</div>
			</div>
		</BasicLayout>
	);
};
