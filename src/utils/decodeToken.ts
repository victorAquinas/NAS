export type DecodedToken = {
	user_name: string;
	user_id: number;
	user_email: string;
	role: {
		role_name: string;
		role_id: number;
	};
	expiration_time: number;
};

export const decodeToken = (token: string): DecodedToken | null => {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
				.join('')
		);

		return JSON.parse(jsonPayload);
	} catch (error) {
		console.error('Failed to decode token:', error);
		return null;
	}
};
