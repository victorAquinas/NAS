import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from '../views/Home';
import { ToastContainer } from 'react-toastify';

const Router = () => {
	const routes = createBrowserRouter([{ path: '/', element: <Home /> }]);

	return (
		<>
			<ToastContainer />
			<RouterProvider router={routes} />
		</>
	);
};

export default Router;
