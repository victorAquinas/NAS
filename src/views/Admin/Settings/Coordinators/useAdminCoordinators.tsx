import { useForm } from 'react-hook-form';
import { formValidationSchema, FormValidationSchema } from './formValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { createUser, getUsers } from '../../../../api/adminServices';
import { Role, User, UsersFilters } from '../../../../api/types';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

export const useAdminCoordinators = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
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
	const initialFilters = {
		name: '',
		role: 'instructor',
		status: null,
		page: null,
		limit: null,
	};

	const getEmailName = (email: string): string => {
		const [name] = email.split('@');
		return name;
	};

	const handleCloseModal = () => {
		setValue('email', '');
		setValue('name', '');
		setValue('phone', '');
		setIsModalOpen(false);
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

	const onSubmit = (data: FormValidationSchema) => {
		const { name, email, phone } = data;
		handleNewCoordinator(name, email, phone ?? '');
	};

	const handleGetCoordinators = async (filters: UsersFilters) => {
		try {
			const coordinators = await getUsers(filters);
			setCoordinators(coordinators);
		} catch (error) {
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
	};
};
