/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				myviolet: '#FF99D4',
				mygray: '#eaeaea',
				mydark: '#101010',
				newprimary: '#F9F9F9',
				myadmin: '#5865F2',
			},
		},
		screens: {
			xl: { max: '1279px' }, // => @media (max-width: 1279px) { ... }
			ml: { max: '1060px' },
			lg: { max: '900px' }, // => @media (max-width: 1023px) { ... }
			md: { max: '768px' }, // => @media (max-width: 767px) { ... }
			sm: { max: '640px' }, // => @media (max-width: 639px) { ... }
			xs: { max: '450px' }, // => @media (max-width: 480px) { ... },
			'sm!': { min: '640px' },
		},
	},
	plugins: [],
}
