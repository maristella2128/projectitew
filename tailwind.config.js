import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Source Serif 4', ...defaultTheme.fontFamily.sans],
                serif: ['Playfair Display', ...defaultTheme.fontFamily.serif],
            },
            colors: {
                primary: 'var(--primary)',
                secondary: 'var(--secondary)',
                accent: 'var(--secondary)', // Map accent to secondary
                background: 'var(--background)',
                surface: 'var(--surface)',
                border: 'var(--border)',
                danger: 'var(--danger)',
                success: 'var(--success)',
            },
            borderRadius: {
                'xl': '12px',
            },
            boxShadow: {
                'subtle': '0 2px 4px rgba(0,0,0,0.05)',
            }
        },
    },

    plugins: [forms],
};
