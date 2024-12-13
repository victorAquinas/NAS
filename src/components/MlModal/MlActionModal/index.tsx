import { Portal } from 'react-portal';
import Modal from 'react-modal';
import AtButton from '../../AtButton';
import { CgChevronRight } from 'react-icons/cg';

interface MlActionModalProps {
	isOpen: boolean;
	onAction?: () => void;
	onClose?: () => void;
	title: string;
	description?: string;
	closeButtonLabel?: string;
	actionButtonLabel?: string;
	children?: React.ReactNode;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	styles?: any;
}
export const MlActionModal = ({
	isOpen,
	onAction,
	onClose,
	title,
	description,
	closeButtonLabel,
	actionButtonLabel,
	children,
	styles,
}: MlActionModalProps) => {
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
			...styles,
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
				<div className='font-medium text-2xl text-center flex justify-center flex-col'>
					<h2>{title}</h2>
				</div>
				{description && <p className='pt-4 text-center'>{description}</p>}
				{children && children}
				<div className='buttons-container w-full flex justify-center mt-2'>
					<div className='buttons flex items-center jsutify-center gap-6'>
						{closeButtonLabel && (
							<AtButton
								variant='transparent'
								className='flex items-center mt-6'
								onClick={onClose}
							>
								{closeButtonLabel}
							</AtButton>
						)}
						{actionButtonLabel && (
							<AtButton
								variant='primary'
								className='flex items-center mt-6'
								onClick={onAction}
							>
								{actionButtonLabel}
								<span className='text-2xl'>
									{' '}
									<CgChevronRight />
								</span>
							</AtButton>
						)}
					</div>
				</div>
			</Modal>
		</Portal>
	);
};
