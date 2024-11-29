import { z } from 'zod';

export const loginSchema = z.object({
	email: z
		.string()
		.nonempty('Email is required'),
		// email: z
		// .string()
		// .email('Invalid email address')
		// .nonempty('Email is required'),
	password: z
		.string()
		.min(8, 'Password must be at least 5 characters')
		.nonempty('Password is required'),
});

export type LoginFormSchema = z.infer<typeof loginSchema>;
