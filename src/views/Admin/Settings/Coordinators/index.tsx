import { Link } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import AtButton from '../../../../components/AtButton';
import { MlActionModal } from '../../../../components/MlModal/MlActionModal';
import { useAdminCoordinators } from './useAdminCoordinators';
import { AtBadge } from '../../../../components/AtBadge';
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber';
import { TbEdit } from 'react-icons/tb';
import { BsToggle2Off, BsToggle2On } from 'react-icons/bs';
import { AtLoadingWrapper } from '../../../../components/AtLoadingWrapper';

const AdminCoordinatorSettings = () => {
	const {
		register,
		handleSubmit,
		onSubmit,
		errors,
		isModalOpen,
		modalType,
		handleCloseModal,
		coordinators,
		tableFilter,
		handleGetCoordinators,
		updateTableFilter,
		handleOpenModal,
		handleOpenEditModal,
		handleChangeStatus,
		isLoading,
	} = useAdminCoordinators();
	console.log('Meta', import.meta.env.DATAVISION_API);
	return (
		<AdminLayout>
			<AtLoadingWrapper isLoading={isLoading} />
			<MlActionModal
				isOpen={isModalOpen}
				variant='transparent'
				title={`${modalType === 'new' ? 'Add' : 'Edit'} coordinator`}
				styles={{
					height: '550px',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
				}}
			>
				<form
					className='flex flex-col gap-4 mt-4'
					onSubmit={handleSubmit(onSubmit)}
				>
					<input
						type='text'
						{...register('name')}
						placeholder='Name'
						className='w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>
					<div className='text-sm text-red_primary'>
						{errors.name && <>{errors.name.message}</>}
					</div>
					<input
						type='text'
						{...register('email')}
						placeholder='Email'
						className='w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>
					<div className='text-sm text-red_primary'>
						{errors.email && <>{errors.email.message}</>}
					</div>

					<input
						type='text'
						{...register('phone')}
						placeholder='Phone'
						className='w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>
					<div className='text-sm text-red_primary'>
						{errors.phone && <>{errors.phone.message}</>}
					</div>

					<div className='flex w-full justify-center gap-x-6'>
						<AtButton
							variant='transparent'
							type='submit'
							onClick={handleCloseModal}
						>
							Cancel
						</AtButton>
						<AtButton variant='primary' type='submit'>
							{modalType === 'new' ? 'Add' : 'Edit'} Coordinator
						</AtButton>
					</div>
				</form>
			</MlActionModal>

			<div className='flex justify-between'>
				<h2 className='text-xl font-medium pt-4'>Settings - Coordinators</h2>

				<div className='flex justify-end '>
					<AtButton variant='secondary' onClick={() => handleOpenModal('new')}>
						Add Coordinator
					</AtButton>
				</div>
			</div>

			<ul className='sub-menu flex items-center w-full gap-x-4 mt-6 border-b border-gray-300'>
				<li className='border-b border-b-primary text-primary'>Coordinators</li>

				<Link to={`/admin/settings/group-location`}>
					<li>In-site/Off-site</li>
				</Link>
			</ul>

			<div className='content pt-12'>
				<div className='flex items-center gap-x-4 pb-6'>
					<input
						type='text'
						value={tableFilter.name}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								handleGetCoordinators(tableFilter);
							}
						}}
						onChange={(e) => updateTableFilter({ name: e.target.value })}
						placeholder='Search by name...'
						className='w-full h-full bg-white p-3 py-2 placeholder:text-[#807f7f] font-normal rounded-md border border-gray-400'
					/>

					<AtButton
						variant='primary'
						className='!py-2.5'
						onClick={() => handleGetCoordinators(tableFilter)}
					>
						Search
					</AtButton>
				</div>
				<div className='mb-16 mt-8 bg-white shadow-md rounded-md py-4 px-3 border border-gray-300'>
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
									Is active
								</th>
								<th className='border border-gray-200 bg-primary_light font-normal px-3 py-2 text-start'>
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{coordinators?.map((coordinator) => (
								<tr className='text-center bg-white' key={coordinator.id}>
									<td className='border-b border-gray-200 px-3 p-3  text-start'>
										{coordinator.name ? coordinator.name : 'N/A'}
									</td>
									<td className='border-b border-gray-200 px-3 p-3  text-start'>
										{coordinator.email ? coordinator.email : 'N/A'}
									</td>
									<td className='border-b border-gray-200 px-3 p-3  text-start'>
										{coordinator.phone
											? formatPhoneNumber(coordinator.phone)
											: 'N/A'}
									</td>
									<td className='border-b border-gray-200 px-3 p-3  text-start'>
										{coordinator.status ? (
											<AtBadge variant='primary' label='Active' />
										) : (
											<AtBadge variant='danger' label='Inactive' />
										)}
									</td>
									<td className='border-b border-gray-200 px-3 p-3  text-start'>
										<div className='btns flex items-center'>
											<button
												className='edit text-2xl'
												onClick={() =>
													handleOpenEditModal(
														String(coordinator.id),
														coordinator.name,
														coordinator.email,
														coordinator.phone ?? ''
													)
												}
											>
												<TbEdit />
											</button>
											<button
												className='text-3xl ml-4'
												onClick={async () =>
													handleChangeStatus(
														String(coordinator.id),
														coordinator.name,
														coordinator.email,
														coordinator.phone ?? '',
														!coordinator.status
													)
												}
											>
												{coordinator.status ? (
													<BsToggle2On className='text-primary' />
												) : (
													<BsToggle2Off className='text-red_primary' />
												)}
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{coordinators.length === 0 && (
						<div className='text-lg py-4  w-full flex justify-center'>
							Not found
						</div>
					)}
				</div>
			</div>
		</AdminLayout>
	);
};

export default AdminCoordinatorSettings;
