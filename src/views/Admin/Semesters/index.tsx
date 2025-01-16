import AtButton from '../../../components/AtButton';
import { MlActionModal } from '../../../components/MlModal/MlActionModal';
import { useAdminSemesters } from './useAdminSemesters';
import { AtBadge } from '../../../components/AtBadge';
import { LuEye } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { transformDateString } from '../../../utils/transformDateString';
import { AtLoadingWrapper } from '../../../components/AtLoadingWrapper';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { MdOutlineDelete } from 'react-icons/md';
import AtBreadcrumb from '../../../components/AtBreadCrumb';

const AdminSemesters = () => {
	const {
		isAddSemesterModalOpen,
		handleOpenAddLocationModal,
		handleCloseAddLocationModal,
		semesters,
		isLoading,
		handleAddSemester,
		semesterName,
		setSemesterName,
		startDate,
		setStartDate,
		setEndDate,
		endDate,
		locationId,
		showDeleteSemesterModal,
		semesterIdToDelete,
		handleDesactivateSemester,
		handleCloseDeleteSemesterModal,
		handleShowDeleteSemesterModal,
		location,
	} = useAdminSemesters();
	const breadcrumbItems = [
		{ label: 'Locations', link: '/admin/locations' },
		{ label: 'Semesters' },
		// { label: 'Courses', link: '/admin/courses/4/semester/3/location/1' },
	];

	return (
		<AdminLayout>
			<MlActionModal
				isOpen={isAddSemesterModalOpen}
				closeButtonLabel='Cancel'
				onClose={handleCloseAddLocationModal}
				actionButtonLabel='Add Semester'
				title='Add a Semester'
				styles={{
					height: '550px',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
				}}
				onAction={() =>
					toast.promise(
						handleAddSemester(
							semesterName,
							startDate,
							endDate,
							locationId ?? ''
						),
						{
							pending: 'Creating semester',
							success: 'Semester created successfully',
							error: 'Error creating semester',
						}
					)
				}
			>
				<form className='flex flex-col gap-4 mt-4'>
					<input
						type='text'
						id='email'
						onChange={(e) => setSemesterName(e.target.value)}
						placeholder='Name'
						className='w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>
					<DatePicker
						selected={startDate}
						onChange={(date) => setStartDate(date)}
						placeholderText='Start Date'
						className='w-full h-full bg-white p-3 text-gray-700 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>
					<DatePicker
						selected={endDate}
						onChange={(date) => setEndDate(date)}
						placeholderText='End date'
						className='w-full h-full bg-white p-3 text-gray-700 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>
				</form>
			</MlActionModal>

			<MlActionModal
				isOpen={showDeleteSemesterModal}
				onAction={() => {
					handleDesactivateSemester(semesterIdToDelete);
				}}
				isLoading={false}
				onClose={handleCloseDeleteSemesterModal}
				title='Are you sure you want to delete this semester?'
				description='This action cannot be undone.'
				closeButtonLabel='Cancel'
				actionButtonLabel='Delete'
				variant='danger'
			></MlActionModal>

			<AtLoadingWrapper isLoading={isLoading} />
			<div className='header flex justify-between' id='content-semester'>
				<div className='left'>
					<h2 className='text-xl font-semibold'>{location.headquarter_name}</h2>
					<AtBreadcrumb items={breadcrumbItems} separator='/' />

					<h2 className='text-base font-medium pt-4'>
						Administration Panel - Semesters
					</h2>
					<p className='text-sm max-w-[50rem]'>
						Manage and view all semesters.
					</p>
				</div>
				<div className='right'>
					<AtButton variant='secondary' onClick={handleOpenAddLocationModal}>
						Add semester
					</AtButton>
				</div>
			</div>

			<div className='table w-full mt-12'>
				<table className='border-collapse  w-full'>
					<thead>
						<tr>
							<th className='border border-gray-200 bg-primary_light font-normal px-3 py-2 text-start'>
								Name
							</th>
							<th className='border border-gray-200 bg-primary_light font-normal px-3 py-2 text-start'>
								Dates
							</th>
							<th className='border border-gray-200 bg-primary_light font-normal px-3 py-2 text-start'>
								State
							</th>
							<th className='border border-gray-200 bg-primary_light font-normal px-3 py-2 text-start'>
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{semesters?.semesters_in.map((semester) => (
							<tr className='text-center bg-white' key={semester.semester_id}>
								<td className='border-b border-gray-200 px-3 p-3  text-start'>
									{semester.semester_name}
								</td>
								<td className='border-b border-gray-200 px-3 p-3  text-start'>
									{transformDateString(semester.semester_start_date)} -{' '}
									{transformDateString(semester.semester_end_date)}
								</td>
								<td className='border-b border-gray-200 px-3 p-3  text-start'>
									{semester.semester_status ? (
										<AtBadge label='Active' variant='primary' />
									) : (
										<AtBadge label='Inactive' variant='danger' />
									)}
								</td>
								<td className='border-b border-gray-200 px-3 p-3  text-start '>
									<div className='flex items-center'>
										<Link
											to={`/admin/courses/${
												semester?.programs_in[0]?.program_semester_id ??
												'no-courses'
											}/semester/${
												semester.semester_id
											}/location/${locationId}`}
										>
											<span className='text-2xl'>
												<LuEye />
											</span>
										</Link>

										<button
											className='text-2xl pl-2'
											onClick={() =>
												handleShowDeleteSemesterModal(semester.semester_id)
											}
										>
											<MdOutlineDelete className='text-red_primary' />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{semesters?.semesters_in.length === 0 && (
					<div className='text-center bg-white w-full p-4'>No data found</div>
				)}
			</div>
		</AdminLayout>
	);
};

export default AdminSemesters;
