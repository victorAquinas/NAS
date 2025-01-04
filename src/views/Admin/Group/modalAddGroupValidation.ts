import { z } from 'zod';

const selectOptionSchema = z.object({
	label: z.string().min(1, { message: 'Label must not be empty' }),
	value: z.number().min(1, { message: 'Value must not be empty' }),
});

export const newGroupSchema = z.object({
	group_name: z.string().min(1, 'Group name is required'),
	start_date: z.string().min(1, 'Start date is required'),
	end_date: z.string().min(1, 'End date is required'),
	default_start_time: z.string().min(1, 'Shift start time is required'),
	default_end_time: z.string().min(1, 'Shift end time is required'),
	max_students: z.preprocess(
		(value) => (typeof value === 'string' ? Number(value) : value),
		z
			.number({ required_error: 'This field is required' })
			.positive('Must be a positive number')
			.int('Must be an integer')
	),
	default_instructor_id: selectOptionSchema,
	default_offsite_practice_place_id: selectOptionSchema,
	verity_group_id: z.string().min(1, 'Verity ID is required'),
	in_days: z
		.array(z.string())
		.min(1, 'Days of the week for practices are required'),
	offsite_num_weeks_for_generate: z.preprocess(
		(value) => (typeof value === 'string' ? Number(value) : value),
		z
			.number({ required_error: 'This field is required' })
			.positive('Must be a positive number')
			.int('Must be an integer')
	),
	default_insite_practice_place_id: selectOptionSchema,
	insite_num_weeks_for_generate: z.preprocess(
		(value) => (typeof value === 'string' ? Number(value) : value),
		z
			.number({ required_error: 'This field is required' })
			.positive('Must be a positive number')
			.int('Must be an integer')
	),
});

export type NewGroupSchema = z.infer<typeof newGroupSchema>;
