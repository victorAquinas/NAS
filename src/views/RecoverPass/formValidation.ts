import { z } from 'zod';

export const recoverPassSchema = z.object({
	email: z
		.string()
		.email('Invalid email address')
		.nonempty('Email is required'),
});

export type RecoverPassSchema = z.infer<typeof recoverPassSchema>;
