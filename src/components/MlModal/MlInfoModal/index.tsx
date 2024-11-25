import { Portal } from 'react-portal';
import Modal from 'react-modal';
import AtButton from '../../AtButton';
import { CgChevronRight } from 'react-icons/cg';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';

interface MlInfoModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description: string;
	closeButtonLabel: string;
}
export const MlInfoModal = ({
	isOpen,
	onClose,
	title,
	description,
	closeButtonLabel,
}: MlInfoModalProps) => {
	const customStyles = {
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
			padding: '4rem',
			width: '650px',
			borderRadius: '0.5rem',
			// zIndex: zIndex.modal,
		},
	};

	return (
		<Portal>
			<Modal
				ariaHideApp={false}
				isOpen={isOpen}
				style={customStyles}
				overlayClassName={'fixed inset-0 bg-black/85 z-[3000]'}
			>
				<div className='text-[3rem] text-primary flex justify-center w-full pb-4'>
					<IoCheckmarkCircleOutline />
				</div>
				<div className='font-medium text-2xl text-center flex justify-center flex-col'>
					<h2>{title}</h2>
				</div>
				<p className='pt-4 text-center'>{description}</p>

				<div className='buttons-container w-full flex justify-center mt-2'>
					<div className='buttons flex items-center jsutify-center gap-6'>
						<AtButton
							variant='primary'
							className='flex items-center mt-6'
							onClick={onClose}
						>
							{closeButtonLabel}
							<span className='text-2xl'>
								{' '}
								<CgChevronRight />
							</span>
						</AtButton>
					</div>
				</div>
			</Modal>
		</Portal>
	);
};
