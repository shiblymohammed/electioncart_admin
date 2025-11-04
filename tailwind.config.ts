import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Removed 'darkMode: class' as the panel is strictly dark mode.
  theme: {
    extend: {
      colors: {
        // Base dark theme palette (now the sole focus)
        dark: {
          DEFAULT: '#0D1117', // Main background (very dark slate)
          surface: '#161B22', // Card, modal, and component backgrounds
          border: '#30363D',  // Borders and dividers
          hover: '#21262D',   // Hover state for list items, etc.
        },
        // Text Colors (re-aliased for clarity in a dark-only theme)
        text: {
          DEFAULT: '#F0F6FC', // Primary text (near white)
          muted: '#8D96A0',  // Secondary/muted text (light gray)
        },
        
        // Brand & Accent Colors
        primary: {
          DEFAULT: '#3b82f6', // Vibrant Blue (e.g., blue-500)
          hover: '#60a5fa',   // Lighter blue for hover (e.g., blue-400)
          focus: '#2563eb',   // Darker blue for focus/active (e.g., blue-600)
          content: '#ffffff',     // Text color on primary buttons (renamed from 'text' to 'content' to avoid conflict with top-level 'text')
        },
        secondary: {
          DEFAULT: '#8b5cf6', // Vibrant Purple (e.g., purple-500)
          hover: '#a78bfa',   // (e.g., purple-400)
          focus: '#7c3aed',   // (e.g., purple-600)
          content: '#ffffff',
        },
        accent: {
          DEFAULT: '#22d3ee', // Electric Cyan/Teal (for glows, highlights)
          hover: '#67e8f9',
          focus: '#06b6d4',
          content: '#0D1117',     // Dark text on this bright color
        },

        // Status Colors (for pending, processing, active, etc.)
        success: {
          DEFAULT: '#22c55e', // Green-500
          content: '#ffffff',
          surface: 'rgba(34, 197, 94, 0.1)', // For light green badge backgrounds
          border: 'rgba(34, 197, 94, 0.4)',  // For badge borders
        },
        warning: {
          DEFAULT: '#eab308', // Yellow-500
          content: '#ffffff',
          surface: 'rgba(234, 179, 8, 0.1)',
          border: 'rgba(234, 179, 8, 0.4)',
        },
        danger: {
          DEFAULT: '#ef4444', // Red-500
          content: '#ffffff',
          surface: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.4)',
        },
        info: {
          DEFAULT: '#60a5fa', // Blue-400
          content: '#ffffff',
          surface: 'rgba(96, 165, 250, 0.1)',
          border: 'rgba(96, 165, 250, 0.4)',
        },
      },
      
      // Custom Border Radius for sleek cards and buttons
      borderRadius: {
        'card': '1rem',      // For all cards
        'btn': '0.5rem',       // For all buttons
        'pill': '9999px',      // For status badges
      },

      // Custom Box Shadows for card depth and glow effects
      boxShadow: {
        'card': '0 4px 14px 0 rgba(0, 0, 0, 0.25)', // Subtle shadow for cards
        'card-hover': '0 6px 20px 0 rgba(0, 0, 0, 0.3)', // On-hover shadow
        'glow-primary': '0 0 15px -3px rgba(59, 130, 246, 0.4)', // Blue glow
        'glow-accent': '0 0 15px -3px rgba(34, 211, 238, 0.5)', // Cyan glow
      },

      // Custom Background Images for Gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, var(--tw-colors-primary-DEFAULT), var(--tw-colors-secondary-DEFAULT))',
        'gradient-accent': 'linear-gradient(to right, var(--tw-colors-accent-DEFAULT), var(--tw-colors-primary-DEFAULT))',
        'gradient-surface': 'linear-gradient(to bottom, var(--tw-colors-dark-surface), var(--tw-colors-dark-DEFAULT))',
      },

      // Custom Blur Filters for glassmorphism
      blur: {
        'xs': '2px', // Very subtle blur
        'lg-xl': '16px', // Heavy for backgrounds
      },

      // Custom Transition Durations for smoother UI effects
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },

      // Enables the 'glow' animation to use colors
      shadowColor: theme => ({
        ...theme('colors'),
        primary: theme('colors.primary.DEFAULT', '#3b82f6'),
        accent: theme('colors.accent.DEFAULT', '#22d3ee'),
      }),

      // Custom Keyframes for animations
      keyframes: {
        // Fade-in and slide-up for page/component loads
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Fade-in animation
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Slide in from right
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        // Subtle pulse for 'processing' or 'pending' status
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.6' },
        },
        // Glow effect for buttons or highlights
        'glow': {
          '0%, 100%': { boxShadow: '0 0 5px -2px var(--tw-shadow-color)' },
          '50%': { boxShadow: '0 0 10px -2px var(--tw-shadow-color)' },
        },
        // Floating animation
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        // Slide up animation for banners
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      // Custom Animations mapping keyframes to utilities
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'pulse-status': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-accent': 'glow 2.5s ease-in-out infinite', // Use with `shadow-accent`
        'glow-primary': 'glow 2.5s ease-in-out infinite', // Use with `shadow-primary`
        'float-gentle': 'float 4s ease-in-out infinite',
      },
    },
  },
  // Add plugins
  plugins: [],
} satisfies Config
