import { FaRegFileAlt } from 'react-icons/fa';
import { MlActionModal } from '../../../../../components/MlModal/MlActionModal';
import { LuImport } from 'react-icons/lu';
import AtFileUploader from '../../../../../components/AtFileUploader';
import { BsFiletypeXlsx } from 'react-icons/bs';
import { IoMdClose, IoMdCloseCircleOutline } from 'react-icons/io';
import { truncateText } from '../../../../../utils/truncateText';
import { useImportationModal } from './useImportationModal';
import AtButton from '../../../../../components/AtButton';

interface ImportationModalProps {
	isOpen: boolean;
	onClose: () => void;
	updateTable: () => void;
}
const OrImportationModal = ({
	isOpen,
	onClose,
	updateTable,
}: ImportationModalProps) => {
	const {
		setStep,
		step,
		ImportationModalStep,
		setFile,
		file,
		programSemesterId,
		handleUploadFile,
		results,
		getModalTitle,
		handleClose,
		handleTryAgain,
	} = useImportationModal(onClose, updateTable);
	return (
		<MlActionModal
			isOpen={isOpen}
			variant='transparent'
			onClose={handleClose}
			title={getModalTitle(step)}
		>
			<div
				className='absolute top-4 right-4 text-2xl cursor-pointer'
				onClick={handleClose}
			>
				<IoMdClose />
			</div>

			{/* Step 1 */}
			{step === ImportationModalStep.SELECTION && (
				<div className='content mt-6 flex justify-between items-center gap-x-8'>
					<a
						href={'/NAS_template_importation.xlsx'}
						download
						className='shadow-xl border border-gray-200 rounded-md bg-white py-5 px-2 flex flex-col justify-center items-center hover:bg-primary/20 w-full max-w-[250px] font-medium'
					>
						<div className='text-4xl text-primary pb-2 mt-4'>
							<FaRegFileAlt />
						</div>
						Download template
					</a>

					<button
						className='shadow-xl border border-gray-200 rounded-md bg-white py-5 px-2 flex flex-col justify-center items-center hover:bg-primary/20 w-full max-w-[250px] font-medium'
						onClick={() => setStep(ImportationModalStep.IMPORT)}
					>
						<div className='text-4xl text-primary pb-2 mt-4'>
							<LuImport />
						</div>
						Let's import
					</button>
				</div>
			)}

			{/* Step 2 */}
			{step === ImportationModalStep.IMPORT && (
				<>
					<div className='mt-4'>
						<AtFileUploader onFileUpload={(file) => setFile(file)} />
					</div>

					{file && (
						<div className='file-selected flex items-center w-full mt-4 justify-between bg-gray-100 p-4 rounded-md'>
							<div className='left flex items-center'>
								<div className='icon text-4xl'>
									<BsFiletypeXlsx />
								</div>
								<div className='file-name font-medium pl-2'>
									{truncateText(file.name, 30)}
								</div>
							</div>
							<div className='right'>
								<button
									className='text-3xl text-red_primary'
									onClick={() => setFile(null)}
								>
									<IoMdCloseCircleOutline />
								</button>
							</div>
						</div>
					)}

					<div
						className={`w-full text-center mt-8 ${
							!file
								? 'opacity-50 pointer-events-none'
								: 'opacity-100 pointer-events-auto'
						}`}
						onClick={() => {
							if (file) {
								handleUploadFile(file, parseInt(programSemesterId ?? '0'));
							}
						}}
					>
						<AtButton variant='primary'>Import students</AtButton>
					</div>
				</>
			)}

			{/* Step 3 */}
			{step === ImportationModalStep.SUCCESS && (
				<div className='succcess'>
					<div className='info flex justify-center items-center mt-12 text-lg gap-x-12'>
						<div className='success rounded-md shadow-md p-4 border border-primary'>
							<span className='text-primary font-medium'>
								{results.imported}
							</span>{' '}
							Imported
						</div>
						<div className='rounded-md shadow-md p-4 border border-yellow-500'>
							<span className='text-yellow-500 border-yellow-500 font-medium'>
								{results.duplicated}
							</span>{' '}
							Duplicated
						</div>
					</div>
				</div>
			)}

			{step === ImportationModalStep.ERROR && (
				<div className='error'>
					<div className='flex justify-center items-center text-xl pt-8 flex-col'>
						<div className='text-red_primary font-medium'>
							An Error has occured please try again.
						</div>
						<div className='mt-6'>
							<AtButton variant='primary' onClick={handleTryAgain}>
								Try again
							</AtButton>
						</div>
					</div>
				</div>
			)}
		</MlActionModal>
	);
};

export default OrImportationModal;
