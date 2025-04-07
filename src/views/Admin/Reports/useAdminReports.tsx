import { useEffect, useState } from 'react';
import { getDashboard, getLocations } from '../../../api/adminServices';
import { AdminHeadquarter, DashboardResponse } from '../../../api/types';
import { toast } from 'react-toastify';

export const useAdminReports = () => {
	const [dashboard, setDashboard] = useState<DashboardResponse>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [institutionId, setInstitutionId] = useState<number>();

	const getAdminData = async () => {
		try {
			const response = (await getLocations()) as unknown as AdminHeadquarter;
			if (response?.error) {
				setInstitutionId(response?.institution_id);
				return;
			}

			const fullResponse = response as unknown as AdminHeadquarter[];
			setInstitutionId(fullResponse[0]?.institution_id);
		} catch (error) {
			console.error(error);
			toast.error('Error');
		}
	};
	const handleGetDashboard = async (institution_id: number) => {
		setIsLoading(true);
		try {
			const dashboard = await getDashboard(institution_id);
			setDashboard(dashboard);
			setIsLoading(false);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
			toast.error('Error');
		}
	};

	useEffect(() => {
		getAdminData();
		if (institutionId) {
			handleGetDashboard(institutionId);
		}
	}, [institutionId]);

	return { dashboard, isLoading, institutionId };
};
