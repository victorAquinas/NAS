import { useState } from 'react';

export const useAdminGroup = () => {
	const [isAddGroupModalOpen, setIsAddGroupModalOpen] =
		useState<boolean>(false);

	const handleOpenAddGroupModal = () => {
		setIsAddGroupModalOpen(true);
	};

	const handleCloseAddGroupModal = () => {
		setIsAddGroupModalOpen(false);
	};
	return {
		isAddGroupModalOpen,
		handleOpenAddGroupModal,
		handleCloseAddGroupModal,
	};
	return {
		isAddGroupModalOpen,
		handleOpenAddGroupModal,
		handleCloseAddGroupModal,
	};
};
