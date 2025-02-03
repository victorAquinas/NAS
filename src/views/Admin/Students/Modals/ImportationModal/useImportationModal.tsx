import { useState } from 'react';
import { ImportationModalStep } from './types';
import { importUsers } from '../../../../../api/adminServices';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useImportationModal = (
	onClose: () => void,
	updateTable: () => void
) => {
	const { programSemesterId } = useParams();
	const [step, setStep] = useState<ImportationModalStep>(
		ImportationModalStep.SELECTION
	);
	const [results, setResults] = useState<{
		duplicated: number;
		imported: number;
	}>({
		duplicated: 0,
		imported: 0,
	});
	const [file, setFile] = useState<File | null>(null);

	const updateResults = (
		updatedFields: Partial<{
			duplicated: number;
			imported: number;
		}>
	) => {
		setResults((prevUser) => ({
			...prevUser,
			...updatedFields,
		}));
	};

	const handleUploadFile = async (file: File, programSemesterId: number) => {
		const idLoading = toast.loading('Importing students');
		try {
			const uploadedFile = await importUsers(programSemesterId, file);
			setStep(ImportationModalStep.SUCCESS);
			updateResults({
				duplicated:
					uploadedFile?.data?.only_register_in_program_semester?.length,
				imported: uploadedFile?.data?.first_time_registers?.length,
			});
			updateTable();
			toast.update(idLoading, {
				render: 'Students imported',
				type: 'success',
				isLoading: false,
				autoClose: 500,
			});
		} catch (error) {
			console.error(error);
			toast.update(idLoading, {
				render: 'Error',
				type: 'error',
				isLoading: false,
				autoClose: 1000,
			});
			setStep(ImportationModalStep.ERROR);
		}
	};

	const getModalTitle = (variant: ImportationModalStep) => {
		switch (variant) {
			case ImportationModalStep.SUCCESS:
				return 'Imported successfully';
			case ImportationModalStep.ERROR:
				return 'Error';
				return 'Imported successfully';
			default:
				return 'Import students';
		}
	};

	const handleClose = () => {
		onClose();
		setStep(ImportationModalStep.SELECTION);
		setFile(null);
		updateResults({
			duplicated: 0,
			imported: 0,
		});
	};

	const handleTryAgain = () => {
		setStep(ImportationModalStep.SELECTION);
		setFile(null);
		updateResults({
			duplicated: 0,
			imported: 0,
		});
	};

	return {
		step,
		setStep,
		ImportationModalStep,
		file,
		setFile,
		handleUploadFile,
		programSemesterId,
		results,
		getModalTitle,
		handleClose,
		handleTryAgain,
	};
};
