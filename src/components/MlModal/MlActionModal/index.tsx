import { Portal } from 'react-portal';
import Modal from 'react-modal';
import AtButton from '../../AtButton';
import { CgChevronRight } from 'react-icons/cg';
import {
	IoAlertCircleOutline,
	IoCheckmarkCircleOutline,
} from 'react-icons/io5';

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
	variant?: 'success' | 'danger' | 'transparent';
	isLoading?: boolean;
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
	variant = 'success',
	isLoading = false,
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
			paddingTop: '2.5rem',
			width: '650px',
			borderRadius: '0.5rem',
			position: 'relative',
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
				<div
					className={`text-[3rem] flex justify-center w-full pb-4 ${
						variant === 'success' ? 'text-primary' : 'text-red_primary'
					}`}
				>
					{variant === 'success' && <IoCheckmarkCircleOutline />}
					{variant === 'danger' && <IoAlertCircleOutline />}
				</div>
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
								isLoading={isLoading}
							>
								{closeButtonLabel}
							</AtButton>
						)}
						{actionButtonLabel && (
							<AtButton
								variant={
									variant === 'success' || variant === 'transparent'
										? 'primary'
										: 'danger'
								}
								className='flex items-center mt-6'
								onClick={onAction}
								isLoading={isLoading}
							>
								{actionButtonLabel}
								<span className='text-2xl'>
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
