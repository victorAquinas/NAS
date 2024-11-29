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
	]);

	return (
		<>
			<ToastContainer />
			<RouterProvider router={routes} />
		</>
	);
};

export default Router;
