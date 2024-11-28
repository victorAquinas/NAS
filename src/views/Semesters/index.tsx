import { BasicLayout } from '../../layouts/BasicLayout';
import { useSemesters } from './useSemesters';

export const Semesters = () => {
	const { renderSemesterList } = useSemesters(
		import.meta.env.VITE_TEST_EMAIL_USER
	);

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
