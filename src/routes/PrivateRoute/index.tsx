import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getTokenFromCookies } from '../../utils/cookies';

const validateAuthToken = (token: string): boolean => {
	return token !== '';
};

const PrivateRoute: React.FC = () => {
	const authToken = getTokenFromCookies();

	if (authToken && validateAuthToken(authToken)) {
		return <Outlet />;
	} else {
		return <Navigate to='/' replace />;
	}
};

export default PrivateRoute;
