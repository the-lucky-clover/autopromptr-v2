import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
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
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
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
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'scroll': {
					'0%': {
						transform: 'translateX(0)'
					},
					'100%': {
						transform: 'translateX(-50%)'
					}
				},
				'slide-in-from-bottom': {
					'0%': {
						transform: 'translateY(100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'psychedelic-shift': {
					'0%': {
						background: 'linear-gradient(45deg, rgba(236, 72, 153, 0.15), rgba(34, 197, 94, 0.20), rgba(147, 51, 234, 0.20))'
					},
					'25%': {
						background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.20), rgba(251, 146, 60, 0.20), rgba(236, 72, 153, 0.15))'
					},
					'50%': {
						background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.20), rgba(139, 92, 246, 0.20), rgba(34, 197, 94, 0.15))'
					},
					'75%': {
						background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.20), rgba(6, 182, 212, 0.20), rgba(251, 146, 60, 0.15))'
					},
					'100%': {
						background: 'linear-gradient(225deg, rgba(6, 182, 212, 0.20), rgba(236, 72, 153, 0.20), rgba(139, 92, 246, 0.15))'
					}
				},
				'color-cycle': {
					'0%': {
						background: 'linear-gradient(270deg, rgba(167, 243, 208, 0.15), rgba(139, 69, 19, 0.15), rgba(165, 243, 252, 0.15))'
					},
					'33%': {
						background: 'linear-gradient(0deg, rgba(139, 69, 19, 0.15), rgba(217, 70, 239, 0.15), rgba(167, 243, 208, 0.15))'
					},
					'66%': {
						background: 'linear-gradient(90deg, rgba(217, 70, 239, 0.15), rgba(165, 243, 252, 0.15), rgba(139, 69, 19, 0.15))'
					},
					'100%': {
						background: 'linear-gradient(180deg, rgba(165, 243, 252, 0.15), rgba(167, 243, 208, 0.15), rgba(217, 70, 239, 0.15))'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scroll': 'scroll 20s linear infinite',
				'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
				'psychedelic-shift': 'psychedelic-shift 25s ease-in-out infinite alternate',
				'color-cycle': 'color-cycle 30s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
