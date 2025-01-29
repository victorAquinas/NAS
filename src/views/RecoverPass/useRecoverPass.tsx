import { useForm } from 'react-hook-form';
import { RecoverPassSchema, recoverPassSchema } from './formValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { recoverPassword } from '../../api/services';
import { toast } from 'react-toastify';
import { useState } from 'react';

export const useRecoverPass = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RecoverPassSchema>({
		resolver: zodResolver(recoverPassSchema),
	});

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const handleRecoverPassword = async (email: string) => {
		const idLoading = toast.loading('Checking email');
		setIsModalOpen(false);
		try {
			await recoverPassword(email);
			toast.update(idLoading, {
				render: 'Password changed',
				type: 'success',
				isLoading: false,
				autoClose: 500,
			});
			setIsModalOpen(true);
		} catch (error) {
			setIsModalOpen(false);
			console.error(error);
			toast.update(idLoading, {
				render: 'Error, try later',
				type: 'error',
				isLoading: false,
				autoClose: 1000,
			});
		}
	};
	const onSubmit = (data: RecoverPassSchema) => {
		const { email } = data;
		handleRecoverPassword(email);
	};
	return {
		handleSubmit,
		onSubmit,
		register,
		errors,
		isModalOpen,
		setIsModalOpen,
	};
};
