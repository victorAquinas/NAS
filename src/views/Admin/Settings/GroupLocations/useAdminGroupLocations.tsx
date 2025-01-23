import { useEffect, useState } from 'react';
import { GroupPlace } from '../../../../api/types';
import { toast } from 'react-toastify';
import {
	createNewGroupPlace,
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

	const handleGetPlaces = async () => {
		try {
			const places = await getPlaces(import.meta.env.VITE_INSTITUTION_ID);
			console.log('Places', places);
			setPlaces(places?.data);
		} catch (error) {
			toast.error('Error');
			console.error(error);
		}
	};

	const handleUpdatePlace = async (
		practicePlaceId: number,
		name: string,
		typeId: number,
		address: string
	) => {
		const idLoading = toast.loading('Updating place');
		try {
			await updateGroupPlace(
				practicePlaceId,
				name,
				typeId,
				address,
				import.meta.env.VITE_INSTITUTION_ID
			);
			toast.update(idLoading, {
				render: 'Place updated',
				type: 'success',
				isLoading: false,
				autoClose: 500,
			});
			handleGetPlaces();
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
		status: boolean
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
			institution_id: import.meta.env.VITE_INSTITUTION_ID,
		});
	};

	const handleCreateNewPlace = async (
		name: string,
		address: string,
		type: number
	) => {
		const idLoading = toast.loading('Creating place');
		try {
			const newPlace = await createNewGroupPlace(
				name,
				address,
				type,
				import.meta.env.VITE_INSTITUTION_ID
			);
			toast.update(idLoading, {
				render: 'Place created',
				type: 'success',
				isLoading: false,
				autoClose: 500,
			});
			handleGetPlaces();
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

		console.log('Selected Plcae', selectedPlace);
		console.log('Modal Type', modalType);
		if (modalType === 'new') {
			return handleCreateNewPlace(name, address, type);
		}

		if (selectedPlace) {
			return handleUpdatePlace(selectedPlace?.id, name, type, address);
		}
		console.log('Data', data);
	};

	useEffect(() => {
		handleGetPlaces();
	}, []);

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
	};
};
