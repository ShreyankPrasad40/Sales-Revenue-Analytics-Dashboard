import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // Light Mode
                primary: {
                    main: '#6C63FF',
                },
                secondary: {
                    main: '#00BFA6',
                },
                background: {
                    default: '#f4f6f8',
                    paper: '#ffffff',
                },
                text: {
                    primary: '#2b3445',
                    secondary: '#6c757d',
                },
                divider: 'rgba(0, 0, 0, 0.08)',
            }
            : {
                // Dark Mode
                primary: {
                    main: '#6C63FF',
                },
                secondary: {
                    main: '#00BFA6',
                },
                background: {
                    default: '#121212',
                    paper: '#1E1E1E',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#b0b0b0',
                },
                divider: 'rgba(255, 255, 255, 0.12)',
            }),
    },
    typography: {
        fontFamily: 'sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundImage: 'none',
                    borderRadius: 12,
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 20px rgba(0,0,0,0.5)'
                        : '0 2px 12px rgba(0,0,0,0.08)',
                }),
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    boxShadow: 'none',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }),
            },
        },
    },
});

export const lightTheme = createTheme(getDesignTokens('light'));
export const darkTheme = createTheme(getDesignTokens('dark'));
