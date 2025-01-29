import { Link } from 'react-router-dom';
import NasLogoText from '../../assets/nas-logo.svg';
import AtButton from '../../components/AtButton';
import { MlInfoModal } from '../../components/MlModal/MlInfoModal';
import { useRecoverPass } from './useRecoverPass';

export const RecoverPass = () => {
	const {
		onSubmit,
		handleSubmit,
		register,
		errors,
		isModalOpen,
		setIsModalOpen,
	} = useRecoverPass();
	return (
		<>
			<MlInfoModal
				isOpen={isModalOpen}
				title='Password Recovery'
				onClose={() => setIsModalOpen(false)}
				description='A new password has been sent to your email. Please check your inbox to retrieve it.'
				closeButtonLabel='Close'
			/>

			<div className='h-screen w-full bg-background flex justify-center items-center flex-col'>
				<div className='container w-full max-w-[350px]'>
					<Link to={'/'}>
						<div className='logo flex justify-center my-8'>
							<img src={NasLogoText} alt='Nas logo' />
						</div>
					</Link>
					<div className='text-xl font-medium text-center pb-8'>
						Recover password
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

							<AtButton variant='primary' type='submit'>
								Recover Password
							</AtButton>
						</form>
						<Link to={'/'}>
							<div className='text-gray-400 text-sm text-end pt-4'>
								Back to Login
							</div>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};
