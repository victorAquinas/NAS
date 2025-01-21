import { z } from 'zod';

export const formValidationSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email address'),
	phone: z
		.string()
		.optional()
		.refine((phone) => {
			if (!phone) return true; // Allow empty phone field
			return /^\+?\d{7,15}$/.test(phone); // Validate phone format if provided
		}, 'Invalid phone number'),
});

export type FormValidationSchema = z.infer<typeof formValidationSchema>;
