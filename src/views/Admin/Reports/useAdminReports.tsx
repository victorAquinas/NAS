import { useEffect, useState } from 'react';
import { getDashboard } from '../../../api/adminServices';
import { DashboardResponse } from '../../../api/types';

export const useAdminReports = () => {
	const [dashboard, setDashboard] = useState<DashboardResponse>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const handleGetDashboard = async () => {
		setIsLoading(true);
		try {
			const dashboard = await getDashboard(import.meta.env.VITE_DASHBOARD_ID);
			setDashboard(dashboard);
			setIsLoading(false);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		handleGetDashboard();
	}, []);

	return { dashboard, isLoading };
};
