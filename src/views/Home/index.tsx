import AquinasLogo from '../../assets/aquinas.svg';
export const Home = () => {
	return (
		<>
			<div className='fixed left-0 top-0 h-full w-full bg-primary flex items-center justify-center flex-col'>
				<img src={AquinasLogo} className='logo' alt='Vite logo' />
				<h1 className='text-white text-2xl mt-4'>
					Starter Template Aquinas Networks
				</h1>
			</div>
		</>
	);
};
