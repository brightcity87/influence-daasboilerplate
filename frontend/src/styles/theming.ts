import { ThemeConfig, extendTheme } from '@chakra-ui/react';
import { Inter, Roboto } from 'next/font/google';

export const roboto = Roboto({ weight: '500', style: 'normal', subsets: ['latin'] });
export const robotoBold = Roboto({ weight: '700', style: 'normal', subsets: ['latin'] });

export const interRegular = Inter({ weight: '400', style: 'normal', subsets: ['latin'] });
export const interFat = Inter({ weight: '700', style: 'normal', subsets: ['latin'] });
export const interExtraFat = Inter({ weight: '900', style: 'normal', subsets: ['latin'] });


const secondaryBlack = '#121216'
const platinum = '#D8DBE2'


const grey = '#F2F2F2'
const lightGrey = '#E2E2E2'
const cyanblue = '#2B3440'
export const accent = '#4A00FF'


export const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const breakpoints = {
  base: '0px',     // Mobile devices
  sm: '480px',     // Small devices (phones)
  md: '768px',     // Medium devices (tablets)
  lg: '992px',     // Large devices (small laptops/desktops)
  xl: '1200px',    // Extra large devices (large laptops/desktops)
  '2xl': '1536px', // Extra extra large devices (full HD and larger screens)
}


export const newTheme = {
  breakpoints,
  colors: {
    navbar: {
      bg: {
        light: grey, // Slightly darker for distinction
        dark: secondaryBlack
      },
      textPrimary: {
        light: "black",
        dark: platinum
      },
    },
    sections: {
      darker: cyanblue,
      lighter: grey
    },
    text: {
      lighter: lightGrey
    },
    brand: {
      50: '#F5F8FF',  // Lightest - subtle background
      100: '#E5EDFF', // Very light - hover states
      200: '#CCE0FF', // Light - active states
      300: '#99C1FF', // Medium light - secondary buttons
      400: '#6699FF', // Medium - primary elements
      500: '#3366FF', // Base color - primary actions
      600: '#2952CC', // Medium dark - hover states
      700: '#1F3D99', // Dark - active states
      800: '#142966', // Very dark - text on light backgrounds
      900: '#0A1433'  // Darkest - deep accents
    },
    buttons: accent,
    neutral: {
      50: '#F9FAFB',  // Lightest - table row background
      100: '#F3F4F6', // Very light - table header/alternate rows
      200: '#E5E7EB', // Light - borders, dividers
      300: '#D1D5DB', // Medium light - disabled states
      400: '#9CA3AF', // Medium - placeholder text
      500: '#6B7280', // Base - secondary text
      600: '#4B5563', // Medium dark - primary text
      700: '#374151', // Dark - headings
      800: '#1F2937', // Very dark - emphasized text
      900: '#111827', // Darkest - black text alternative
    },
  },
};

export const theme = extendTheme({
  // ... (existing theme config)
  styles: {
    global: {
      '@keyframes pulseRight': {
        '0%': { transform: 'translateX(0)' },
        '50%': { transform: 'translateX(3px)' },
        '100%': { transform: 'translateX(0)' },
      },
    },
  },
});

