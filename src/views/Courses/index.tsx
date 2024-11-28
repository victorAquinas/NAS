import { Fragment } from 'react';
import AtButton from '../../components/AtButton';
import { BasicLayout } from '../../layouts/BasicLayout';
import { CgChevronRight } from 'react-icons/cg';
import { useCourses } from './useCourses';
import { Link } from 'react-router-dom';
import { BiLoader } from 'react-icons/bi';

export const Courses = () => {
	const { courses, isLoading } = useCourses(
		import.meta.env.VITE_TEST_EMAIL_USER
	);
	return (
		<>
			<BasicLayout className='!items-start !pt-12'>
				<div className='container flex flex-col justify-center text-center items-center'>
					<h1 className='text-2xl font-medium'>Courses </h1>
					<div className='text-center'>
						<p>Select the assigned course to continue.</p>
					</div>

					<div className='list flex mt-20 gap-6 flex-wrap justify-center max-w-[80%] '>
						{isLoading && (
							<>
								<AtButton variant='white' className='flex items-center'>
									<span className='text-2xl pr-4'>
										<BiLoader />
									</span>{' '}
									Loading
								</AtButton>
							</>
						)}

						{!isLoading && courses.length === 0 && (
							<div>
								<AtButton variant='white'>No courses assigned</AtButton>
								<p className='pt-4 text-primary font-normal'>
									Please wait for the administrator to assign you a course
								</p>
							</div>
						)}

						{!isLoading && courses.length > 0 && (
							<Fragment>
								{courses.map((course) => (
									<Link
										to={`/calendar/${course.program_semester_id}`}
										key={course.program.id}
									>
										<AtButton
											variant='info'
											className='flex items-center w-[320px] justify-between !text-primary hover:!text-white'
										>
											{course.program.name}
											<span className='text-2xl '>
												<CgChevronRight />
											</span>
										</AtButton>
									</Link>
								))}
							</Fragment>
						)}
					</div>
				</div>
			</BasicLayout>
		</>
	);
};
