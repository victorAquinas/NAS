import { AdminLayout } from '../../../layouts/AdminLayout';
import {
	IoCheckmarkCircleOutline,
	IoCloseCircleOutline,
} from 'react-icons/io5';
import { useAdminStudents } from './useAdminStudents';
import { UserStatus } from '../../../api/types';
import { Link } from 'react-router-dom';
import { MlActionModal } from '../../../components/MlModal/MlActionModal';

import Select from 'react-select';
import { AtSelectWithDescription } from '../../../components/AtSelectWithDescription';
import { BiTransfer } from 'react-icons/bi';
import { Tooltip } from 'react-tooltip';
import AtBreadcrumb from '../../../components/AtBreadCrumb';

const AdminStudents = () => {
	const {
		students,
		AtBadgeDynamic,
		handleAcceptStudent,
		handleRejecttStudent,
		programSemesterId,
		handleSelectChange,
		groups,
		handleSelectMoveTo,
		selectedMoveTo,
		isLoadingGroups,
		moveToType,
		handleShowMoveToModal,
		selectedUser,
		canShowMoveToModal,
		handleCloseMoveToModal,
		handleRelocateStudent,
		semesterId,
		locationId,
	} = useAdminStudents();

	const breadcrumbItems = [
		{ label: 'Locations', link: '/admin/locations' },
		{ label: 'Semesters', link: `/admin/semester/${locationId}` },
		{
			label: 'Courses',
			link: `/admin/courses/${programSemesterId}/semester/${semesterId}/location/${locationId}`,
		},
		{ label: 'Groups' },
	];

	return (
		<AdminLayout>
			<MlActionModal
				isOpen={canShowMoveToModal}
				onClose={handleCloseMoveToModal}
				title='Move Student'
				variant='transparent'
				actionButtonLabel='Move'
				closeButtonLabel='Cancel'
				// onAction={() => console.log('Hola')}
				onAction={() => {
					if (selectedMoveTo) {
						handleRelocateStudent(selectedUser.id, selectedMoveTo?.value);
					}
				}}
			>
				<div className='detail my-4  py-3 flex flex-col items-center border-y border-primary'>
					<div className='name uppercase'>
						<span className='font-medium'>Name</span>: {selectedUser.name}
					</div>
					<div className='email uppercase'>
						<span className='font-medium'>Email</span>: {selectedUser.email}
					</div>
					<div className='group uppercase'>
						<span className='font-medium'>Group</span>:{' '}
						{selectedUser.group ? selectedUser.group : 'N/A'}
					</div>
				</div>
				<div className='group mt-4'>
					<p className='font-medium pb-2'>Select Type</p>
					<Select
						styles={{
							control: (baseStyles, state) => ({
								...baseStyles,
								borderColor: state.isFocused ? 'grey' : '#b1b6c0',
							}),
						}}
						options={[
							{
								label: 'Group',
								value: 'groups',
							},
							{
								label: 'Location',
								value: 'location',
							},
						]}
						placeholder='Select'
						className='w-full h-full bg-white !placeholder:text-[#807f7f] !font-normal rounded-md'
						onChange={(selected) => {
							console.log('Selected', selected);
							if (selected && programSemesterId) {
								handleSelectChange(
									selected?.value as 'groups' | 'location',
									programSemesterId
								);
							}
						}}
					/>
					{moveToType === 'groups' && (
						<div className='info text-sm text-gray-500 mt-2'>
							This action will assign the student to a different group. For
							example, moving John Doe from Group A to Group B.
						</div>
					)}

					{moveToType === 'location' && (
						<div className='info text-sm text-gray-500 mt-2'>
							This action will move the student to a different group in a new
							location. For example, transferring John Doe from NAS Miami to NAS
							New York.
						</div>
					)}
				</div>

				<div className='group mt-4'>
					<p className='font-medium pb-2'>Move to:</p>
					<AtSelectWithDescription
						options={groups?.map((group) => ({
							label: `${group.name}`,
							description: `${group.headquarter}`,
							value: group.id,
						}))}
						onChange={(selected) => {
							if (selected) {
								handleSelectMoveTo(selected);
							}
						}}
						isLoading={isLoadingGroups}
						value={selectedMoveTo}
					/>
				</div>

				{selectedMoveTo && moveToType && (
					<div className='my-4 flex flex-col items-center py-4 border-y border-primary'>
						<p className='font-semibold pb-2'>Details:</p>
						<ul className='w-full'>
							<li className='flex justify-between'>
								<div>Moving student: </div>
								<div className='font-medium'>Victor Escalona</div>
							</li>
							<li className='flex justify-between'>
								<div>To group:</div>
								<div className='font-medium'>{selectedMoveTo.label}</div>
							</li>
							{moveToType === 'location' && (
								<li className='flex justify-between'>
									<div className='text-left'>In location:</div>
									<div className='font-medium text-right'>
										{selectedMoveTo.description}
									</div>
								</li>
							)}
						</ul>
						{/* Label es el grupo, description headquarter */}
					</div>
				)}
			</MlActionModal>

			<AtBreadcrumb items={breadcrumbItems} separator='/' />

			<h2 className='text-xl font-medium pt-4'>Dental Assistant</h2>
			<p className='text-gray-500'>Below is a list of all students</p>
			<ul className='sub-menu flex items-center w-full gap-x-4 mt-6 border-b border-gray-300'>
				<Link
					to={`/admin/group/${programSemesterId}/semester/${semesterId}/location/${locationId}`}
				>
					<li>Groups</li>
				</Link>

				<li className='border-b border-b-primary text-primary'>Students</li>
			</ul>

			{/* Table */}
			<div className='mb-16 mt-8 bg-white shadow-md rounded-md py-4 px-3 border border-gray-300'>
				<div className='w-[initial] overflow-auto mt-12'>
					<table className='border-collapse  w-full'>
						<thead>
							<tr>
								<th className='border border-gray-200 bg-primary_light font-normal px-3 py-2 text-start'>
									Name
								</th>
								<th className='border border-gray-200 bg-primary_light font-normal px-3 py-2 text-start'>
									Email
								</th>
								<th className='border border-gray-200 bg-primary_light font-normal px-3 py-2 text-start'>
									Phone
								</th>
								<th className='border border-gray-200 bg-primary_light font-normal px-3 py-2 text-start'>
									Group
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
							{students.length > 0 &&
								students?.map((student) => (
									<tr className='text-center bg-white' key={student.id}>
										<td className='border-b border-gray-200 px-3 p-3  text-start'>
											{student.name}
										</td>
										<td className='border-b border-gray-200 px-3 p-3  text-start'>
											{student.email}{' '}
										</td>
										<td className='border-b border-gray-200 px-3 p-3  text-start'>
											{student.phone ?? 'N/A'}
										</td>
										<td className='border-b border-gray-200 px-3 p-3  text-start uppercase'>
											{student.request.requested_group_name ?? 'N/A'}
											{/* Falta agregar el GRUPO seleccionado */}
										</td>
										<td className='border-b border-gray-200 px-3 p-3  text-start'>
											{AtBadgeDynamic(
												student.request.requested_group_status as UserStatus
											)}
										</td>
										<td className='border-b border-gray-200 px-3 p-3  text-start min-w-[150px]'>
											<div className='flex items-center gap-x-2'>
												{student.request.requested_group_status.toLowerCase() ===
													UserStatus.PENDING.toLocaleLowerCase() && (
													<>
														<Tooltip
															id={`accept-student-${student.id}`}
															place='top'
															content={'Accept student'}
															className='!text-sm'
														/>

														<button
															data-tooltip-id={`accept-student-${student.id}`}
															className='check text-4xl text-primary'
															onClick={() =>
																handleAcceptStudent(
																	student.email,
																	student.request.requested_group_id
																)
															}
														>
															<IoCheckmarkCircleOutline />
														</button>

														<Tooltip
															id={`reject-student-${student.id}`}
															place='top'
															content={'Reject student'}
															className='!text-sm'
														/>
														<button
															data-tooltip-id={`reject-student-${student.id}`}
															onClick={() =>
																handleRejecttStudent(
																	student.email,
																	student.request.requested_group_id
																)
															}
															className='delete text-4xl  font-bold text-red_primary'
														>
															<IoCloseCircleOutline />
														</button>
													</>
												)}

												<Tooltip
													id={`move-student-${student.id}`}
													place='top'
													content={'Move student'}
													className='!text-sm'
												/>
												<button
													data-tooltip-id={`move-student-${student.id}`}
													className='text-4xl '
													onClick={() =>
														handleShowMoveToModal({
															id: student.id,
															name: student.name,
															email: student.email,
															group: student.request.requested_group_name,
														})
													}
												>
													<BiTransfer />
												</button>
											</div>
											{/* {student.request.requested_group_status.toLowerCase() ===
												UserStatus.REJECT.toLocaleLowerCase() && (
												<div className='flex items-center'>
													Student needs to request a new group
												</div>
											)}

											{student.request.requested_group_status.toLowerCase() ===
												UserStatus.OPEN.toLocaleLowerCase() && (
												<div className='flex items-center'>
													Student needs to request a group
												</div>
											)}

											{student.request.requested_group_status.toLowerCase() ===
												UserStatus.ACCEPTED.toLocaleLowerCase() && (
												<div className='flex items-center'>----</div>
											)} */}
										</td>
									</tr>
								))}
						</tbody>
					</table>

					{students.length === 0 && (
						<div className='text-lg py-4  w-full flex justify-center'>
							No students found
						</div>
					)}
				</div>
			</div>
		</AdminLayout>
	);
};

export default AdminStudents;
