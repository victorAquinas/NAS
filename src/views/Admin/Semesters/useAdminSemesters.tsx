import { useState } from 'react';

export const useAdminSemesters = () => {
	const [isAddSemesterModalOpen, setIsAddSemesterModalOpen] =
		useState<boolean>(false);

	const handleOpenAddLocationModal = () => {
		setIsAddSemesterModalOpen(true);
	};

	const handleCloseAddLocationModal = () => {
		setIsAddSemesterModalOpen(false);
	};
	return {
		isAddSemesterModalOpen,
		handleOpenAddLocationModal,
		handleCloseAddLocationModal,
	};
};
