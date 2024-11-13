export const theme = {
	container: {
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
		},
	},
	screens: {
		xs: '370px',
		sm: '640px',
		md: '768px',
		lg: '1024px',
		xl: '1280px',
		'2xl': '1536px',
	},
	fontSize: {
		xxxs: '0.5rem',
		xxs: '0.625rem',
		xs: '.75rem',
		sm: '.875rem',
		base: '1rem',
		lg: '1.125rem',
		xl: '1.25rem',
		'2xl': '1.5rem',
		'3xl': '1.875rem',
		'4xl': '2.25rem',
		'5xl': '3rem',
		'6xl': '3.75rem',
		'7xl': '4.5rem',
		'8xl': '6rem',
	},
	extend: {
		colors: {
			background: '#F4F5F9', // Gray light
			primary: '#00BC92', // Green 
			primary_light: '#DFF3EF', // Green light
			secondary: '#1B2831', // Dark blue
			red_primary: '#FF0004', // Red
		},
		boxShadow: {
			header: '-8px 0px 15px 0px rgba(0, 0, 0, 0.15)',
			dropdown:
				'0px 0px 6px 0px rgba(0, 0, 0, 0.12), 0px 4px 6px 0px rgba(0, 0, 0, 0.12)',
		},
	},
};
