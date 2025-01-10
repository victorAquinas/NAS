import Cookies from 'universal-cookie';
import { decodeToken } from './decodeToken';

const tokenCookieName = 'auth_token';
const cookies = new Cookies();
export const setTokenInCookies = (token: string, expirationTime: number) => {
	const expires = new Date(expirationTime * 1000);
	const decodedToken = decodeToken(token);

	cookies.set(tokenCookieName, token, {
		expires,
	});

	cookies.set('user_email', decodedToken?.user_email ?? '', {
		expires,
		path: '/',
	});
};

export const getTokenFromCookies = (): string | undefined => {
	const token = cookies.get(tokenCookieName);
	return token;
};

export const getCookieItem = (cookieName: string): string | undefined => {
	const token = cookies.get(cookieName);
	return token;
};

export const deleteCookie = (cookieName: string) => {
	cookies.remove(cookieName);
};
