import { AtIconButton } from '../../../components/AtIconButton';
import AtButton from '../../../components/AtButton';
import { MlActionModal } from '../../../components/MlModal/MlActionModal';
import { useCourses } from './useCourses';
import { RiBookMarkedLine } from 'react-icons/ri';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import { AtLoadingWrapper } from '../../../components/AtLoadingWrapper';
import { AdminLayout } from '../../../layouts/AdminLayout';
import AtBreadcrumb from '../../../components/AtBreadCrumb';

const AdminCourses = () => {
	const {
		isAddCourseModalOpen,
		handleOpenAddCourseModal,
		handleCloseAddCourseModal,
		courses,
		programSemesterId,
		setMaxEnrollmentDate,
		maxEnrollmentDate,
		courseName,
		setCourseName,
		handleAddCourse,
		semesterId,
		isLoading,
		handleDesactivateCourse,
		handleCloseDeleteCourseModal,
		handleShowDeleteCourseModal,
		programSemesterIdToDelete,
		showDeleteCourseModal,
		locationId,
		location,
	} = useCourses();

	const breadcrumbItems = [
		{ label: 'Locations', link: '/admin/locations' },
		{ label: 'Semesters', link: `/admin/semester/${locationId}` },
		{ label: 'Courses' },
		// link: '/admin/courses/4/semester/3/location/1'
	];

	return (
		<AdminLayout>
			<MlActionModal
				isOpen={isAddCourseModalOpen}
				closeButtonLabel='Cancel'
				onClose={handleCloseAddCourseModal}
				actionButtonLabel='Add Course'
				title='Add a Course'
				styles={{
					height: '550px',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
				}}
				onAction={() =>
					toast.promise(
						handleAddCourse(
							courseName,
							semesterId ?? '',
							maxEnrollmentDate,
							locationId ?? ''
						),
						{
							pending: 'Adding course',
							success: 'Course added successfully',
							error: 'Error adding course',
						}
					)
				}
			>
				<form className='flex flex-col gap-4 mt-4'>
					<input
						type='text'
						value={courseName}
						onChange={(e) => setCourseName(e.target.value)}
						placeholder='Course Name'
						className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>
					<DatePicker
						selected={maxEnrollmentDate}
						onChange={(date) => setMaxEnrollmentDate(date)}
						placeholderText='Max enrollment date'
						className='w-full h-full bg-white p-3 text-gray-700 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>
				</form>
			</MlActionModal>

			<MlActionModal
				isOpen={showDeleteCourseModal}
				onAction={() => {
					handleDesactivateCourse(programSemesterIdToDelete, locationId ?? '');
				}}
				isLoading={false}
				onClose={handleCloseDeleteCourseModal}
				title='Are you sure you want to delete this course?'
				description='This action cannot be undone.'
				closeButtonLabel='Cancel'
				actionButtonLabel='Delete'
				variant='danger'
			></MlActionModal>

			<AtLoadingWrapper isLoading={isLoading} />
			<div className='header flex justify-between'>
				<div className='left'>
					<h2 className='text-xl font-semibold'>{location.headquarter_name}</h2>
					<AtBreadcrumb items={breadcrumbItems} separator='/' />
					<h2 className='text-base font-medium pt-4'>
						Administration Panel - Courses
					</h2>
					<p className='text-sm max-w-[50rem]'>Manage and view all courses.</p>
				</div>
				<div className='right'>
					{programSemesterId !== 'no-courses' && (
						<AtButton variant='secondary' onClick={handleOpenAddCourseModal}>
							Add course
						</AtButton>
					)}
				</div>
			</div>

			{(programSemesterId === 'no-courses' || courses.length === 0) && (
				<div className='content flex justify-center flex-col items-center mt-60'>
					<h2 className='text-xl font-medium pb-6'>
						There are no courses assigned to this semester.
					</h2>

					<AtButton variant='secondary' onClick={handleOpenAddCourseModal}>
						Add course
					</AtButton>
				</div>
			)}

			<div className='location-list pt-6 flex flex-wrap gap-8 w-full justify-center lg:justify-start'>
				{courses.map((course) => (
					<AtIconButton
						href={`/admin/group/${course.program_semester_id}/semester/${semesterId}/location/${locationId}`}
						label={course.program.name}
						Icon={RiBookMarkedLine}
						key={course.program.id}
						tooltipId={`tooltip-${course.program_semester_id}`}
						tooltipContent={'Delete course'}
						deleteLocationClick={() =>
							handleShowDeleteCourseModal(course.program_semester_id)
						}
					/>
				))}
			</div>
		</AdminLayout>
	);
};

export default AdminCourses;
