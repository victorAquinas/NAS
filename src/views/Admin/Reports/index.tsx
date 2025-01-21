import { AdminLayout } from '../../../layouts/AdminLayout';
import { useAdminReports } from './useAdminReports';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import { AtLoadingWrapper } from '../../../components/AtLoadingWrapper';

const AdminReports = () => {
	const { dashboard, isLoading } = useAdminReports();
	return (
		<AdminLayout>
			<AtLoadingWrapper isLoading={isLoading} />
			<div className='left'>
				<h2 className='text-xl font-medium'>Reports</h2>
				<p className='text-sm max-w-[50rem]'>Here you can view your reports.</p>
			</div>

			<div className='pt-6'>
				{dashboard && (
					<PowerBIEmbed
						embedConfig={{
							type: 'report',
							embedUrl: dashboard.report.url,
							accessToken: dashboard.embedToken,
							tokenType: models.TokenType.Embed,
							settings: {
								panes: {
									filters: {
										expanded: false,
										visible: false,
									},
								},
							},
						}}
						cssClassName='h-screen w-full'
					/>
				)}
			</div>
			{!dashboard && (
				<div className='h-[calc(100vh-120px)] w-full flex flex-col items-center justify-center'>
					<p>No dashboard available.</p>
					<p>please contact IT department for more information</p>
				</div>
			)}
		</AdminLayout>
	);
};

export default AdminReports;
