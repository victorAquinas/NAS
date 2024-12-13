import { AppLayout } from '../../../layouts/AppLayout';
import { AtIconButton } from '../../../components/AtIconButton';
import AtButton from '../../../components/AtButton';
import { MlActionModal } from '../../../components/MlModal/MlActionModal';
import { useCourses } from './useCourses';
import { RiBookMarkedLine } from 'react-icons/ri';

const AdminCourses = () => {
	const {
		isAddCourseModalOpen,
		handleOpenAddCourseModal,
		handleCloseAddCourseModal,
	} = useCourses();
	return (
		<AppLayout course={'Administrator'} programSemesterId={'4' as string}>
			<MlActionModal
				isOpen={isAddCourseModalOpen}
				closeButtonLabel='Cancel'
				onClose={handleCloseAddCourseModal}
				actionButtonLabel='Add Course'
				title='Add a Course'
			>
				<form className='flex flex-col gap-4 mt-4'>
					<input
						type='text'
						id='email'
						placeholder='Course Name'
						// {...register('email')}
						className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>
				</form>
			</MlActionModal>
			<div className='header flex justify-between'>
				<div className='left'>
					<h2 className='text-xl font-medium'>
						Administration Panel - Courses
					</h2>
					<p className='text-sm max-w-[50rem]'>Manage and view all courses.</p>
				</div>
				<div className='right'>
					<AtButton variant='secondary' onClick={handleOpenAddCourseModal}>
						Add course
					</AtButton>
				</div>
			</div>

			<div className='location-list pt-6 flex flex-wrap gap-8 w-full justify-center lg:justify-start'>
				<AtIconButton
					href='/admin/course/1'
					label='Nursing'
					Icon={RiBookMarkedLine}
				/>
				<AtIconButton
					href='/admin/semester/1'
					label='Dental Assistant'
					Icon={RiBookMarkedLine}
				/>
				<AtIconButton
					href='/admin/semester/1'
					label='Pharmacy Technician'
					Icon={RiBookMarkedLine}
				/>
			</div>
		</AppLayout>
	);
};

export default AdminCourses;
