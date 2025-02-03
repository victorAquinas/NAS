import { Link } from 'react-router-dom';
import AtButton from '../../../../components/AtButton';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import { useAdminGroupLocations } from './useAdminGroupLocations';
import { AtBadge } from '../../../../components/AtBadge';
import { PracticaPlaceTypeId } from '../../../../api/types';
import { MlActionModal } from '../../../../components/MlModal/MlActionModal';
import Select from 'react-select';
import { Controller } from 'react-hook-form';
import { TbEdit } from 'react-icons/tb';
import { AtLoadingWrapper } from '../../../../components/AtLoadingWrapper';

const AdminGroupLocations = () => {
	const {
		places,
		register,
		handleSubmit,
		onSubmit,
		errors,
		handleCloseModal,
		isModalOpen,
		control,
		handleOpenNewModal,
		handleOpenEditModal,
		typeOptions,
		modalType,
		isLoading,
	} = useAdminGroupLocations();
	return (
		<AdminLayout>
			<AtLoadingWrapper isLoading={isLoading} />
			<MlActionModal
				isOpen={isModalOpen}
				variant='transparent'
				title={`${modalType === 'new' ? 'Add new location' : 'Edit location'}`}
				styles={{
					height: '550px',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
				}}
			>
				<form
					className='flex flex-col gap-4 mt-6'
					onSubmit={handleSubmit(onSubmit)}
				>
					<input
						type='text'
						{...register('name')}
						placeholder='Name'
						className='w-full h-full bg-white px-3 py-2 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>
					<div className='text-sm text-red_primary'>
						{errors.name && <>{errors.name.message}</>}
					</div>
					<input
						type='text'
						{...register('address')}
						placeholder='Address'
						className='w-full h-full bg-white px-3 py-2 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
					/>
					<div className='text-sm text-red_primary'>
						{errors.address && <>{errors.address.message}</>}
					</div>

					<Controller
						name='type'
						control={control}
						rules={{ required: 'Required' }}
						render={({ field }) => (
							<Select
								{...field}
								styles={{
									control: (baseStyles, state) => ({
										...baseStyles,
										borderColor: state.isFocused ? 'grey' : '#b1b6c0',
									}),
								}}
								options={typeOptions}
								value={typeOptions.find(
									(option) => option.value === field.value
								)}
								placeholder='Select Type'
								className='w-full h-full bg-white !placeholder:text-[#807f7f] !font-normal rounded-md'
								onChange={(selected) => {
									field.onChange(selected ? selected.value : null);
								}}
							/>
						)}
					/>

					<div className='text-sm text-red_primary'>
						{errors.type && <>{errors.type.message}</>}
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
							{modalType === 'new' ? 'Add' : 'Edit'} Location
						</AtButton>
					</div>
				</form>
			</MlActionModal>

			<div className='flex justify-between'>
				<div>
					<h2 className='text-xl font-medium pt-4'>
						Settings - Group Locations
					</h2>
					<p className='text-sm max-w-[50rem]'>
						Manage and view In-site and Off-site locations
					</p>
				</div>

				<div className='flex justify-end '>
					<AtButton variant='secondary' onClick={handleOpenNewModal}>
						Add group location
					</AtButton>
				</div>
			</div>

			<ul className='sub-menu flex items-center w-full gap-x-4 mt-6 border-b border-gray-300'>
				<Link to={`/admin/settings`}>
					<li>Coordinators</li>
				</Link>

				<li className='border-b border-b-primary text-primary'>
					In-site/Off-site
				</li>
			</ul>

			<div className='content pt-6'>
				<div className='mb-16 mt-8 bg-white shadow-md rounded-md py-4 px-3 border border-gray-300'>
					<table className='border-collapse  w-full'>
						<thead>
							<tr>
								<th className='border border-gray-200 bg-primary_light font-normal px-3 py-2 text-start'>
									Name
								</th>
								<th className='border border-gray-200 bg-primary_light font-normal px-3 py-2 text-start'>
									Address
								</th>
								<th className='border border-gray-200 bg-primary_light font-normal px-3 py-2 text-start'>
									Type
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
							{places?.map((place) => (
								<tr className='text-center bg-white' key={place.id}>
									<td className='border-b border-gray-200 px-3 p-3  text-start'>
										{place.name}
									</td>
									<td className='border-b border-gray-200 px-3 p-3  text-start'>
										{place.address}
									</td>
									<td className='border-b border-gray-200 px-3 p-3  text-start'>
										{/* OFFSITE = bg-secondary
                                        IN SITE = BG-YELLOW-500 */}
										<AtBadge
											variant={
												place.type_id === PracticaPlaceTypeId.IN_SITE
													? 'warning'
													: 'dark'
											}
											label={
												place.type_id === PracticaPlaceTypeId.IN_SITE
													? 'In-Site'
													: 'Off-Site'
											}
										/>
									</td>
									<td className='border-b border-gray-200 px-3 p-3  text-start'>
										{place.status}
										<AtBadge
											variant={place.status ? 'primary' : 'danger'}
											label={place.status ? 'Active' : 'Inactive'}
										/>
									</td>
									<td className='border-b border-gray-200 px-3 p-3  text-start'>
										<div className='btns'>
											<button
												className='edit text-2xl'
												onClick={() =>
													handleOpenEditModal(
														place.id,
														place.name,
														place.address,
														place.type_id,
														place.status
													)
												}
											>
												<TbEdit />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{places.length === 0 && (
						<div className='text-lg py-4  w-full flex justify-center'>
							Not found
						</div>
					)}
				</div>
			</div>
		</AdminLayout>
	);
};

export default AdminGroupLocations;
