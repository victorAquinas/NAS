import { useEffect, useState } from 'react';
import { AdminHeadquarter, GroupPlace } from '../../../../api/types';
import { toast } from 'react-toastify';
import {
	createNewGroupPlace,
	getLocations,
	getPlaces,
	updateGroupPlace,
} from '../../../../api/adminServices';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { formValidationSchema, FormValidationSchema } from './formValidation';

export const useAdminGroupLocations = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		control,
		reset,
	} = useForm<FormValidationSchema>({
		resolver: zodResolver(formValidationSchema),
	});

	const [places, setPlaces] = useState<GroupPlace[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const typeOptions = [
		{
			label: 'In-Site',
			value: 2,
		},
		{
			label: 'Off-site',
			value: 1,
		},
	];
	const [modalType, setModalType] = useState<'new' | 'edit'>('new');
	const [selectedPlace, setSelectedPlace] = useState<GroupPlace | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [institutionId, setInstitutionId] = useState<number>();

	const getAdminData = async () => {
		try {
			const response = (await getLocations()) as unknown as AdminHeadquarter;
			if (response?.error) {
				setInstitutionId(response?.institution_id);
				return;
			}

			const fullResponse = response as unknown as AdminHeadquarter[];
			setInstitutionId(fullResponse[0]?.institution_id);
		} catch (error) {
			console.error(error);
			toast.error('Error');
		}
	};
	const handleGetPlaces = async (institution_id: number) => {
		setIsLoading(true);
		try {
			const places = await getPlaces(institution_id?.toString());

			setPlaces(places?.data);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(true);
			toast.error('Error');
			console.error(error);
		}
	};

	const handleUpdatePlace = async (
		practicePlaceId: number,
		name: string,
		typeId: number,
		address: string,
		institutionId: number
	) => {
		const idLoading = toast.loading('Updating place');
		try {
			await updateGroupPlace(
				practicePlaceId,
				name,
				typeId,
				address,
				institutionId
			);
			toast.update(idLoading, {
				render: 'Place updated',
				type: 'success',
				isLoading: false,
				autoClose: 500,
			});
			handleGetPlaces(institutionId);
			handleCloseModal();
		} catch (error) {
			console.error(error);

			toast.update(idLoading, {
				render: 'Error',
				type: 'error',
				isLoading: false,
				autoClose: 1000,
			});
		}
	};
	const handleCloseModal = () => {
		reset();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		setValue('type', null as any);
		setIsModalOpen(false);
	};

	const handleOpenNewModal = () => {
		setModalType('new');
		setIsModalOpen(true);
	};
	const handleOpenEditModal = (
		placeId: number,
		name: string,
		address: string,
		type: number,
		status: boolean,
		institutionId: number
	) => {
		setModalType('edit');
		setValue('name', name);
		setValue('address', address);
		setValue('type', type);
		setIsModalOpen(true);
		setSelectedPlace({
			id: placeId,
			name: name,
			address: address,
			type_id: type,
			status: status,
			institution_id: institutionId,
		});
	};

	const handleCreateNewPlace = async (
		name: string,
		address: string,
		type: number,
		institutionId: number
	) => {
		const idLoading = toast.loading('Creating place');
		try {
			const newPlace = await createNewGroupPlace(
				name,
				address,
				type,
				institutionId
			);
			toast.update(idLoading, {
				render: 'Place created',
				type: 'success',
				isLoading: false,
				autoClose: 500,
			});

			handleGetPlaces(institutionId);

			handleCloseModal();

			console.log(newPlace);
		} catch (error) {
			console.error(error);

			toast.update(idLoading, {
				render: 'Error',
				type: 'error',
				isLoading: false,
				autoClose: 1000,
			});
		}
	};

	const onSubmit = (data: FormValidationSchema) => {
		const { name, address, type } = data;

		if (modalType === 'new') {
			return handleCreateNewPlace(name, address, type, institutionId || 0);
		}

		if (selectedPlace && institutionId) {
			return handleUpdatePlace(
				selectedPlace?.id,
				name,
				type,
				address,
				institutionId
			);
		}
	};

	useEffect(() => {
		getAdminData();

		if (institutionId) {
			handleGetPlaces(institutionId);
		}
	}, [institutionId]);

	return {
		places,
		register,
		handleSubmit,
		onSubmit,
		errors,
		setValue,
		control,
		isModalOpen,
		setIsModalOpen,
		handleCloseModal,
		handleOpenEditModal,
		typeOptions,
		handleOpenNewModal,
		modalType,
		selectedPlace,
		isLoading,
		institutionId,
	};
};
