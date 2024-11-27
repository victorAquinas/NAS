import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from '../views/Home';
import { ToastContainer } from 'react-toastify';
import { UserWelcome } from '../views/UserWelcome';
import { Semesters } from '../views/Semesters';
import { Courses } from '../views/Courses';
import CalendarPage from '../views/CalendarPage';
import MyShiftsPage from '../views/MyShiftsPage';

const Router = () => {
	const routes = createBrowserRouter([
		{ path: '/', element: <Home /> },
		{ path: '/welcome', element: <UserWelcome /> },
		{ path: '/semesters', element: <Semesters /> },
		{ path: '/my-courses/:semesterID', element: <Courses /> },
		{ path: '/calendar/:programSemesterId', element: <CalendarPage /> },
		{ path: '/my-shifts', element: <MyShiftsPage /> },
	]);

	return (
		<>
			<ToastContainer />
			<RouterProvider router={routes} />
		</>
	);
};

export default Router;
