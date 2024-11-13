import AtButton from '../../components/AtButton';
import { BasicLayout } from '../../layouts/BasicLayout';
import { CgChevronRight } from 'react-icons/cg';

export const Courses = () => {
	return (
		<>
			<BasicLayout className='!items-start !pt-12'>
				<div className='container flex flex-col justify-center text-center items-center'>
					<h1 className='text-2xl font-medium'>Courses </h1>
					<div className='text-center'>
						<p>Select the assigned course to continue.</p>
					</div>

					<div className='list flex mt-20 gap-6 flex-wrap justify-center max-w-[80%] '>
						{Array.from({ length: 8 }).map((_, index) => (
							<AtButton
								variant='info'
								className='flex items-center w-[320px] justify-between !text-primary hover:!text-white'
								key={index}
							>
								Odontología
								<span className='text-2xl '>
									<CgChevronRight />
								</span>
							</AtButton>
						))}
					</div>
				</div>
			</BasicLayout>
		</>
	);
};
