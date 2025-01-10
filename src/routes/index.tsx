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

const Router = () => {
	const routes = createBrowserRouter([
		{ path: '/', element: <Login /> },
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
				{ path: '/admin/locations', element: <AdminLocations /> },
				{ path: '/admin/semester/:locationId', element: <AdminSemesters /> },
				{
					path: '/admin/courses/:programSemesterId/semester/:semesterId',
					element: <AdminCourses />,
				},
				{ path: '/admin/group/:programSemesterId', element: <AdminGroup /> },
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
