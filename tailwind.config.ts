import type { Config } from "tailwindcss";

export default {
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Simple 3-color system
				background: '#000000', // Black background
				foreground: '#ffffff', // White text
				accent: '#171717', // Charcoal for accents
				border: 'rgba(255, 255, 255, 0.1)', // Light white for borders

				// Component colors mapped to our 3-color system
				primary: {
					DEFAULT: '#ffffff',
					foreground: '#000000'
				},
				secondary: {
					DEFAULT: '#171717',
					foreground: '#ffffff'
				},
				destructive: {
					DEFAULT: '#ef4444',
					foreground: '#ffffff'
				},
				muted: {
					DEFAULT: '#171717',
					foreground: 'rgba(255, 255, 255, 0.7)'
				},
				card: {
					DEFAULT: '#000000',
					foreground: '#ffffff'
				},
				popover: {
					DEFAULT: '#000000',
					foreground: '#ffffff'
				},
				input: '#171717',
				ring: '#ffffff',

				// Sidebar colors
				sidebar: {
					DEFAULT: '#000000',
					foreground: '#ffffff',
					primary: '#ffffff',
					'primary-foreground': '#000000',
					accent: '#171717',
					'accent-foreground': '#ffffff',
					border: 'rgba(255, 255, 255, 0.2)',
					ring: '#ffffff'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;