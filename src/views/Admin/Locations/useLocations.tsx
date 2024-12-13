import { useState } from 'react';

export const useLocations = () => {
	const [isAddLocationModalOpen, setIsAddLocationModalOpen] =
		useState<boolean>(false);

	const handleOpenAddLocationModal = () => {
		setIsAddLocationModalOpen(true);
	};

	const handleCloseAddLocationModal = () => {
		setIsAddLocationModalOpen(false);
	};
	return {
		isAddLocationModalOpen,
		handleOpenAddLocationModal,
		handleCloseAddLocationModal,
	};
};
