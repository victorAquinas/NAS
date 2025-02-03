import { useForm } from 'react-hook-form';
import { formValidationSchema, FormValidationSchema } from './formValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import {
	createUser,
	getUsers,
	updateUser,
} from '../../../../api/adminServices';
import { Role, User, UsersFilters } from '../../../../api/types';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

export const useAdminCoordinators = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset,
	} = useForm<FormValidationSchema>({
		resolver: zodResolver(formValidationSchema),
	});
	const [coordinators, setCoordinators] = useState<User[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [tableFilter, setTableFilter] = useState<UsersFilters>({
		name: '',
		role: 'instructor',
		status: null,
		page: null,
		limit: null,
	});
	const [selectedUser, setSelectedUser] = useState<{
		id: string;
		name: string;
		email: string;
		phone: string;
	}>({
		id: '',
		name: '',
		email: '',
		phone: '',
	});
	const [modalType, setModalType] = useState<'new' | 'edit'>('new');
	const initialFilters = {
		name: '',
		role: 'instructor',
		status: null,
		page: null,
		limit: null,
	};
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const getEmailName = (email: string): string => {
		const [name] = email.split('@');
		return name;
	};

	const handleOpenModal = (type: 'new' | 'edit') => {
		setModalType(type);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setValue('email', '');
		setValue('name', '');
		setValue('phone', '');
		setIsModalOpen(false);
		reset();
	};
	const handleNewCoordinator = async (
		name: string,
		email: string,
		phone: string
	) => {
		const idLoading = toast.loading('Creating coordinator');
		try {
			console.log('Password', getEmailName(email));
			const newCoordinator = await createUser(
				name,
				email,
				getEmailName(email),
				'1',
				Role.COORDINATOR,
				phone
			);
			toast.update(idLoading, {
				render: 'Coordinator created',
				type: 'success',
				isLoading: false,
				autoClose: 500,
			});
			await handleGetCoordinators(initialFilters);
			handleCloseModal();
			console.log('New Coordinator', newCoordinator);
		} catch (error) {
			const axiosError = error as AxiosError;

			if (axiosError.status === 404) {
				return toast.update(idLoading, {
					render: 'Email address is already in use',
					type: 'error',
					isLoading: false,
					autoClose: 1500,
				});
			}

			toast.update(idLoading, {
				render: 'Error',
				type: 'error',
				isLoading: false,
				autoClose: 1000,
			});
		}
	};

	const handleUpdateUser = async (
		user_id: string,
		name: string,
		email: string,
		phone: string
	) => {
		const idLoading = toast.loading('Editing coordinator');
		try {
			const updatedUser = await updateUser(user_id, name, email, phone);
			console.log('Updated User', updatedUser);
			toast.update(idLoading, {
				render: 'Coordinator edited',
				type: 'success',
				isLoading: false,
				autoClose: 500,
			});
			handleGetCoordinators(initialFilters);
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

	const handleChangeStatus = async (
		user_id: string,
		name: string,
		email: string,
		phone: string,
		isActive: boolean
	) => {
		const idLoading = toast.loading('Editing coordinator');
		try {
			await updateUser(user_id, name, email, phone, isActive);
			toast.update(idLoading, {
				render: 'Coordinator edited',
				type: 'success',
				isLoading: false,
				autoClose: 500,
			});
			handleGetCoordinators(initialFilters);
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

	const handleOpenEditModal = async (
		user_id: string,
		name: string,
		email: string,
		phone: string
	) => {
		handleOpenModal('edit');
		setSelectedUser({
			id: user_id,
			name,
			email,
			phone,
		});
		setValue('name', name);
		setValue('email', email);
		setValue('phone', phone);
	};
	const onSubmit = (data: FormValidationSchema) => {
		const { name, email, phone } = data;

		if (modalType === 'new') {
			handleNewCoordinator(name, email, phone ?? '');
			return;
		}

		handleUpdateUser(selectedUser.id, name, email, phone ?? '');
	};

	const handleGetCoordinators = async (filters: UsersFilters) => {
		setIsLoading(true);
		try {
			const coordinators = await getUsers(filters);
			setCoordinators(coordinators);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.error(error);
		}
	};
	const updateTableFilter = (updatedFields: Partial<UsersFilters>) => {
		setTableFilter((prevUser) => ({
			...prevUser,
			...updatedFields,
		}));
	};

	useEffect(() => {
		handleGetCoordinators(initialFilters);
	}, []);

	return {
		register,
		errors,
		handleSubmit,
		onSubmit,
		isModalOpen,
		setIsModalOpen,
		coordinators,
		handleCloseModal,
		tableFilter,
		handleGetCoordinators,
		updateTableFilter,
		handleOpenEditModal,
		modalType,
		handleOpenModal,
		handleChangeStatus,
		isLoading,
	};
};
