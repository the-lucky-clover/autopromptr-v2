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
						background: 'linear-gradient(45deg, rgba(236, 72, 153, 0.35), rgba(34, 197, 94, 0.40), rgba(147, 51, 234, 0.35))'
					},
					'25%': {
						background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.40), rgba(251, 146, 60, 0.35), rgba(236, 72, 153, 0.35))'
					},
					'50%': {
						background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.35), rgba(139, 92, 246, 0.40), rgba(34, 197, 94, 0.35))'
					},
					'75%': {
						background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.40), rgba(6, 182, 212, 0.35), rgba(251, 146, 60, 0.35))'
					},
					'100%': {
						background: 'linear-gradient(225deg, rgba(6, 182, 212, 0.35), rgba(236, 72, 153, 0.40), rgba(139, 92, 246, 0.35))'
					}
				},
				'color-cycle': {
					'0%': {
						background: 'linear-gradient(270deg, rgba(167, 243, 208, 0.25), rgba(139, 69, 19, 0.30), rgba(165, 243, 252, 0.25))'
					},
					'33%': {
						background: 'linear-gradient(0deg, rgba(139, 69, 19, 0.30), rgba(217, 70, 239, 0.25), rgba(167, 243, 208, 0.25))'
					},
					'66%': {
						background: 'linear-gradient(90deg, rgba(217, 70, 239, 0.25), rgba(165, 243, 252, 0.30), rgba(139, 69, 19, 0.25))'
					},
					'100%': {
						background: 'linear-gradient(180deg, rgba(165, 243, 252, 0.30), rgba(167, 243, 208, 0.25), rgba(217, 70, 239, 0.25))'
					}
				},
				'metallic-sheen': {
					'0%': {
						transform: 'translateX(-150%) translateY(-150%) rotate(45deg)',
						opacity: '0'
					},
					'10%': {
						opacity: '1'
					},
					'90%': {
						opacity: '1'
					},
					'100%': {
						transform: 'translateX(150%) translateY(150%) rotate(45deg)',
						opacity: '0'
					}
				},
				'enhanced-metallic-sheen': {
					'0%': {
						transform: 'translateX(150%) translateY(-150%) rotate(45deg)',
						opacity: '0'
					},
					'5%': {
						opacity: '0.3'
					},
					'15%': {
						opacity: '1'
					},
					'85%': {
						opacity: '1'
					},
					'95%': {
						opacity: '0.3'
					},
					'100%': {
						transform: 'translateX(-150%) translateY(150%) rotate(45deg)',
						opacity: '0'
					}
				},
				'lightning-flash': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.5)',
						filter: 'brightness(1)'
					},
					'10%': {
						opacity: '1',
						transform: 'scale(1.1)',
						filter: 'brightness(2) saturate(2)'
					},
					'20%': {
						opacity: '0.8',
						transform: 'scale(1.05)',
						filter: 'brightness(1.8) saturate(1.8)'
					},
					'40%': {
						opacity: '1',
						transform: 'scale(1.15)',
						filter: 'brightness(2.5) saturate(2.2)'
					},
					'60%': {
						opacity: '0.6',
						transform: 'scale(1.02)',
						filter: 'brightness(1.5) saturate(1.5)'
					},
					'80%': {
						opacity: '0.3',
						transform: 'scale(1)',
						filter: 'brightness(1.2) saturate(1.2)'
					},
					'100%': {
						opacity: '0',
						transform: 'scale(1)',
						filter: 'brightness(1)'
					}
				},
				'electric-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(147, 51, 234, 0.3)',
						filter: 'brightness(1)'
					},
					'50%': {
						boxShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(147, 51, 234, 0.6), 0 0 30px rgba(236, 72, 153, 0.4)',
						filter: 'brightness(1.1)'
					}
				},
				'sheen': {
					'0%': {
						transform: 'translateX(-100%) translateY(-100%) rotate(45deg)'
					},
					'100%': {
						transform: 'translateX(400%) translateY(400%) rotate(45deg)'
					}
				},
				'tech-pulse': {
					'0%, 100%': {
						opacity: '0.3',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '0.7',
						transform: 'scale(1.05)'
					}
				},
				'holographic': {
					'0%': {
						background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))'
					},
					'50%': {
						background: 'linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))'
					},
					'100%': {
						background: 'linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))'
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
				'psychedelic-shift': 'psychedelic-shift 45s ease-in-out infinite alternate',
				'color-cycle': 'color-cycle 50s ease-in-out infinite',
				'sheen': 'sheen 1.2s ease-out',
				'sheen-delay-1': 'sheen 1.2s ease-out 2s',
				'sheen-delay-2': 'sheen 1.2s ease-out 4s',
				'sheen-delay-3': 'sheen 1.2s ease-out 6s',
				'tech-pulse': 'tech-pulse 3s ease-in-out infinite',
				'holographic': 'holographic 8s ease-in-out infinite',
				'metallic-sheen': 'metallic-sheen 0.6s ease-out',
				'enhanced-metallic-sheen': 'enhanced-metallic-sheen 0.8s ease-out',
				'lightning-flash': 'lightning-flash 0.8s ease-out',
				'electric-pulse': 'electric-pulse 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
