/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { deleteCookie, getTokenFromCookies } from '../../utils/cookies';
import { decodeToken } from '../../utils/decodeToken';
import { useNavigate } from 'react-router-dom';

export const useAppLayout = () => {
	const [username, setUsername] = useState<string>('');
	const navigate = useNavigate();
	const token = getTokenFromCookies();
	const isSidebarItemActive = (path: string) =>
		location.pathname.includes(path);

	const handleGetUsername = () => {
		if (token) {
			const decodedToken = decodeToken(token);
			setUsername(decodedToken?.user_name ?? '');
		}
	};

	const handleLogOut = () => {
		deleteCookie('auth_token');
		deleteCookie('user_email');
		navigate('/');
	};

	useEffect(() => {
		handleGetUsername();
	}, [token]);

	return {
		isSidebarItemActive,
		username,
		handleLogOut,
	};
};
