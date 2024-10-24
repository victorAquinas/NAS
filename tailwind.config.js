import { theme } from './tailwind.theme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme,
	plugins: [
		function ({ addUtilities }) {
			addUtilities({
				'.placeholder-white::placeholder': {
					color: 'white',
				},
				'.disabled\\:placeholder-white:disabled::placeholder': {
					color: 'white',
				},
			});
		},
	],
};
