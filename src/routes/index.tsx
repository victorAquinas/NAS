import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Login } from '../views/Login';
import { ToastContainer } from 'react-toastify';
import { UserWelcome } from '../views/UserWelcome';
import { Semesters } from '../views/Semesters';
import { Courses } from '../views/Courses';
import CalendarPage from '../views/CalendarPage';
import MyShiftsPage from '../views/MyShiftsPage';
import PrivateRoute from './PrivateRoute';
import { NotFoundPage } from '../views/NotFoundPage';
import AdminLocations from '../views/Admin/Locations';
import AdminSemesters from '../views/Admin/Semesters';
import AdminCourses from '../views/Admin/Courses';
import AdminGroup from '../views/Admin/Group';
import AdminPrivateRoute from './AdminPrivateRoute';
import AdminStudents from '../views/Admin/Students';
import AdminCoordinatorSettings from '../views/Admin/Settings/Coordinators';
import AdminReports from '../views/Admin/Reports';
import AdminGroupLocations from '../views/Admin/Settings/GroupLocations';
import { RecoverPass } from '../views/RecoverPass';

const Router = () => {
	const routes = createBrowserRouter([
		{ path: '/', element: <Login /> },
		{ path: '/recover-password', element: <RecoverPass /> },
		{ path: '*', element: <NotFoundPage /> },
		{
			element: <PrivateRoute />,
			children: [
				{ path: '/semesters', element: <Semesters /> },
				{ path: '/welcome', element: <UserWelcome /> },
				{ path: '/my-courses/:semesterID', element: <Courses /> },
				{ path: '/calendar/:programSemesterId', element: <CalendarPage /> },
				{ path: '/my-shifts/:programSemesterId', element: <MyShiftsPage /> },
			],
		},
		//Admin
		{
			element: <AdminPrivateRoute />,
			children: [
				{
					path: '/admin/locations',
					element: <AdminLocations />,
				},
				{
					path: '/admin/settings',
					element: <AdminCoordinatorSettings />,
				},
				{
					path: '/admin/reports',
					element: <AdminReports />,
				},
				{
					path: '/admin/settings/group-location',
					element: <AdminGroupLocations />,
				},
				{ path: '/admin/semester/:locationId', element: <AdminSemesters /> },
				{
					path: '/admin/courses/:programSemesterId/semester/:semesterId/location/:locationId',
					element: <AdminCourses />,
				},
				{
					path: '/admin/group/:programSemesterId/semester/:semesterId/location/:locationId',
					element: <AdminGroup />,
				},
				{
					path: '/admin/group/students/:programSemesterId/semester/:semesterId/location/:locationId',
					element: <AdminStudents />,
				},
			],
		},
	]);

	return (
		<>
			<ToastContainer limit={2} />
			<RouterProvider router={routes} />
		</>
	);
};

export default Router;
