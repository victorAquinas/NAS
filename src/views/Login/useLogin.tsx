import { useForm } from 'react-hook-form';
import { LoginFormSchema, loginSchema } from './formValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUser } from '../../api/services';
import { toast } from 'react-toastify';
import { setTokenInCookies } from '../../utils/cookies';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../../utils/decodeToken';

export const useLogin = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormSchema>({
		resolver: zodResolver(loginSchema),
	});
	const navigate = useNavigate();

	const handleLogin = async (email: string, password: string) => {
		try {
			const loginResponse = await loginUser(email, password);
			const tokenData = decodeToken(loginResponse.data.token);

			if (!loginResponse.data.token)
				return toast.error('Internal server error, please try again later');

			setTokenInCookies(
				loginResponse.data.token,
				loginResponse.data.expiration_time
			);

			if (tokenData?.role.role_name === 'admin') {
				return navigate('/admin/locations');
			}

			navigate('/semesters');
		} catch (error) {
			console.error(error);
			toast.error('Your email or password is incorrect, please try again');
		}
	};
	const onSubmit = (data: LoginFormSchema) => {
		const { email, password } = data;
		handleLogin(email, password);
		console.log('Form Data:', data);
	};
	return { handleSubmit, onSubmit, register, errors };
};
