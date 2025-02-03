import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getTokenFromCookies } from '../../utils/cookies';
import { decodeToken } from '../../utils/decodeToken';

const validateAuthToken = (token: string): boolean => {
	const userData = decodeToken(token);
	if (!token) return false;
	if (userData?.role.role_name === 'admin') return false;
	if (userData?.role.role_name === 'student') return true;
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
