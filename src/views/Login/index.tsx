import NasLogoText from '../../assets/nas-logo.svg';
import AtButton from '../../components/AtButton';
import { useLogin } from './useLogin';

export const Login = () => {
	const { onSubmit, handleSubmit, register, errors } = useLogin();
	return (
		<div className='h-screen w-full bg-background flex justify-center items-center flex-col'>
			<div className='container w-full max-w-[350px]'>
				<div className='logo flex justify-center mb-10'>
					<img src={NasLogoText} alt='Nas logo' />
				</div>

				<div className='form'>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='flex flex-col gap-y-4'
					>
						<div className='input-group w-full'>
							<input
								type='text'
								id='email'
								placeholder='Email Address'
								{...register('email')}
								className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md'
							/>
							<div className='text-sm text-red_primary pt-1'>
								{' '}
								{errors.email && <>{errors.email.message}</>}
							</div>
						</div>

						<div className='input-group w-full'>
							<input
								type='password'
								id='password'
								placeholder='Password'
								{...register('password')}
								className=' w-full h-full bg-white p-3 placeholder:text-gray-400 font-normal rounded-md'
							/>
							<div className='text-sm text-red_primary pt-1'>
								{errors.password && <>{errors.password.message}</>}
							</div>
						</div>
						<div className='text-gray-400 text-sm text-end'>
							Forgot Password
						</div>
						<AtButton variant='primary' type='submit'>
							Login
						</AtButton>
					</form>
				</div>
			</div>
		</div>
	);
};
