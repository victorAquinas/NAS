import { Portal } from 'react-portal';
import Modal from 'react-modal';
import AtButton from '../../AtButton';
import { CgChevronRight } from 'react-icons/cg';
import { AtBadge } from '../../AtBadge';
import { CalendarEvent } from '../../../views/CalendarPage/types';
import { UserStatus } from '../../../api/types';
import { canShowStatus } from '../../../utils/canShowForStatus';
import { getPracticalPlaceColor } from '../../../utils/getPracticalPlaceColor';

interface MlGroupDetailModalProps {
	isOpen: boolean;
	onAction: () => void;
	onClose: () => void;
	closeButtonLabel: string;
	actionButtonLabel: string;
	event: CalendarEvent | null;
	variant: UserStatus;
}
export const MlGroupDetailModal = ({
	isOpen,
	onAction,
	onClose,
	closeButtonLabel,
	actionButtonLabel,
	event,
	variant,
}: MlGroupDetailModalProps) => {
	const customStyles = {
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
			padding: '2rem',
			width: '100%',
			maxWidth: '650px',
			borderRadius: '0.5rem',
			maxHeight: '90%',
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
				<div className='font-semibold text-lg text-center flex justify-center flex-col'>
					<h2>
						<span className='text-primary'>{event?.group_name}</span> -{' '}
						{event?.title}
					</h2>

					<p className='pt-2'>
						<AtBadge
							label={event?.shift.toString() ?? ''}
							variant='primary'
							className='!text-base'
						/>
					</p>
				</div>

				<div className='box shadow-md bg-white p-2 md:p-4 border border-gray-200 rounded-md mt-4'>
					<div className='flex items-center justify-between'>
						<h3 className='font-semibold'>Clinical offsite</h3>
						<p className='text-primary text-sm font-medium'>
							Total Hours: {event?.offsite_total_hours}
						</p>
					</div>
					<p className='text-sm w-[350px]'>{event?.offsiteAddress}</p>

					<ul className='list flex flex-col gap-y-3 mt-4'>
						{event?.dates?.off_site?.map((date, index) => (
							<li
								className='listItem flex items-center justify-between border-b border-gray-300 pb-1 last:border-none'
								key={`offsite-${index}`}
							>
								<div className='left flex items-center gap-x-4 font-medium w-[235px] justify-between'>
									<div>{date.date}</div>
									<div>{date.shift}</div>
								</div>
								<div className='right'>
									<AtBadge
										label={date.tutor}
										variant={getPracticalPlaceColor('off-site')}
									/>
								</div>
							</li>
						))}
					</ul>
				</div>

				<div className='box shadow-md bg-white p-2 md:p-4 border border-gray-200 rounded-md mt-4'>
					<div className='flex items-center justify-between'>
						<h3 className='font-semibold'>Clinical in campus</h3>
						<p className='text-primary text-sm font-medium'>
							Total Hours: {event?.insite_total_hours}
						</p>
					</div>
					<p className='text-sm w-[350px]'>{event?.campusAddress}</p>

					<ul className='list flex flex-col gap-y-3 mt-4'>
						{event?.dates?.in_site?.map((date, index) => (
							<li
								className='listItem flex items-center justify-between border-b border-gray-300 pb-1 last:border-none'
								key={`offsite-${index}`}
							>
								<div className='left flex items-center gap-x-4 font-medium w-[235px] justify-between'>
									<p>{date.date}</p>
									<p>{date.shift}</p>
								</div>
								<div className='right'>
									<AtBadge
										label={date.tutor}
										variant={getPracticalPlaceColor('in-site')}
									/>
								</div>
							</li>
						))}
					</ul>
				</div>
				<div className='buttons-container w-full flex justify-center mt-2'>
					<div className='buttons flex items-center jsutify-center gap-6'>
						<AtButton
							variant={
								canShowStatus(variant as UserStatus, [
									UserStatus.ACCEPTED,
									UserStatus.PENDING,
								])
									? 'primary'
									: 'transparent'
							}
							className='flex items-center mt-6'
							onClick={onClose}
						>
							{closeButtonLabel}
						</AtButton>

						{canShowStatus(variant as UserStatus, [
							UserStatus.OPEN,
							UserStatus.REJECTED,
						]) && (
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
