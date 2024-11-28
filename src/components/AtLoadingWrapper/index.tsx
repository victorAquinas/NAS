import ReactLoading from 'react-loading';

interface AtLoadingWrapperProps {
	isLoading: boolean;
}
export const AtLoadingWrapper = ({ isLoading }: AtLoadingWrapperProps) => {
	return (
		<>
			{isLoading ? (
				<div className='bg-white z-20 flex-col fixed left-[115px] top-[52px] right-0 h-full flex items-center justify-center'>
					<ReactLoading type='cylon' color='#00BC92' width={100} />

					<p className='text-2xl w-[400px] pt-6 text-center text-secondary'>
						Almost done... unless the internet decides to take a nap!
					</p>
				</div>
			) : (
				''
			)}
		</>
	);
};
