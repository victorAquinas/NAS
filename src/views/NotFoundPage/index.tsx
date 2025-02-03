import { Link } from 'react-router-dom';
import AtButton from '../../components/AtButton';

export const NotFoundPage = () => {
	return (
		<div className='content text-center w-full h-screen bg-background flex justify-center items-center flex-col'>
			<h1 className='font-bold text-5xl mb-4 '>Page Not Found</h1>
			<p className='mb-8 text-lg'>
				We couldn't find the page you're looking for. Please check the URL.
			</p>
			<Link to={'/'}>
				<AtButton variant='primary'>Home</AtButton>
			</Link>
		</div>
	);
};
