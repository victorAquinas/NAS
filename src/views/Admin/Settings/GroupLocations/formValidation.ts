import { z } from 'zod';

export const formValidationSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	address: z.string().min(1, 'Address is required'),
	type: z
		.number()
		.min(1, 'Type is required')
		.nullable()
		.refine((value) => value !== null, 'Type is required'),
});

export type FormValidationSchema = z.infer<typeof formValidationSchema>;
