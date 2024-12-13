import { useState } from 'react';

export const useCourses = () => {
	const [isAddCourseModalOpen, setIsAddCourseModalOpen] =
		useState<boolean>(false);

	const handleOpenAddCourseModal = () => {
		setIsAddCourseModalOpen(true);
	};

	const handleCloseAddCourseModal = () => {
		setIsAddCourseModalOpen(false);
	};
	return {
		isAddCourseModalOpen,
		handleOpenAddCourseModal,
		handleCloseAddCourseModal,
	};
};
