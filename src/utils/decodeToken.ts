export type DecodedToken = {
	user_name: string;
	user_email: string;
	role: {
		role_name: string;
		role_id: number;
	};
	expiration_time: number;
};

export const decodeToken = (token: string): DecodedToken | null => {
	try {
		const base64Url = token.split('.')[1]; // Extract the payload part of the JWT
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe characters
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

// Example usage
const token =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJkYW5pZWwrc3R1ZGVudCIsInVzZXJfZW1haWwiOiJkYW5pZWwrc3R1ZGVudCIsInJvbGUiOnsicm9sZV9uYW1lIjoic3R1ZGVudCIsInJvbGVfaWQiOjN9LCJleHBpcmF0aW9uX3RpbWUiOjE3MzI5MjQ0NzJ9.Vy3srJqbFyMAP83nUEHC3VDGu_cqJsil4eWylwZQt_8';

const decoded = decodeToken(token);
console.log('Decoded Token:', decoded);
