import { PiLightbulbFilamentLight } from 'react-icons/pi';

export const TUTORIAL_STEPS = [
	{
		content: (
			<div>
				<div className='text-xl text-primary w-full flex justify-center mb-4 font-medium'>
					Welcome to the NAS
				</div>
				<p className='text-left'>
					Here you can easily manage your clinical practices. Select the{' '}
					<span className='font-medium text-primary'>shift </span> that best
					suits your schedule at the available{' '}
					<span className='font-medium text-primary'>hospitals</span> through
					the calendar.
				</p>
			</div>
		),

		placement: 'center',
		target: 'body',
		styles: {
			options: {
				width: 400,
			},
		},
	},
	{
		content: (
			<div>
				<div className='text-4xl text-primary w-full flex justify-center mb-4'>
					<PiLightbulbFilamentLight />
				</div>
				<p>
					This is a quick{' '}
					<span className='font-medium text-primary'>Tutorial</span>, how to use{' '}
					<span className='font-medium text-primary'>
						Nursing Appointment System
					</span>
				</p>
			</div>
		),

		placement: 'center',
		target: 'body',
	},
	{
		content: (
			<div>
				<div className='text-4xl text-primary w-full flex justify-center mb-4'>
					<PiLightbulbFilamentLight />
				</div>
				<p>
					<span className='font-medium text-primary'>To get started</span>, you
					can select the group that best suits you in the{' '}
					<span className='font-medium text-primary'>opportunities </span>{' '}
					section.
				</p>
			</div>
		),
		spotlightPadding: 20,
		target: '.opportunities-container',
		styles: {
			options: {
				width: 300,
			},
		},
	},
	{
		content: (
			<div>
				<div className='text-4xl text-primary w-full flex justify-center mb-4'>
					<PiLightbulbFilamentLight />
				</div>
				<p>
					<span className='font-medium text-primary'>
						You can also select a group directly from the calendar
					</span>
					, The colors will help you easily identify each group.
				</p>
			</div>
		),
		spotlightPadding: 20,
		target: '.calendar-event-container',
		styles: {
			options: {
				width: 300,
			},
		},
	},
];
