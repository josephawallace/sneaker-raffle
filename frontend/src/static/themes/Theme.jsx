import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            light: '#6d6d6d',
            main: '#424242',
            dark: '#1b1b1b',
            contrastText: '#fff',
        },
        secondary: {
            light: '#68ff50',
            main: '#00E100',
            dark: '#00ad00',
            contrastText: '#000',
        },
    },
    typography: {
        // base font is roboto
        // headers and buttons use boldface mono45
        h1: { fontFamily: 'mono45-headline, monospace', fontWeight: 700, fontStyle: 'normal', },
        h2: { fontFamily: 'mono45-headline, monospace', fontWeight: 700, fontStyle: 'normal', },
        h3: { fontFamily: 'mono45-headline, monospace', fontWeight: 700, fontStyle: 'normal', },
        h4: { fontFamily: 'mono45-headline, monospace', fontWeight: 700, fontStyle: 'normal', },
        h5: { fontFamily: 'mono45-headline, monospace', fontWeight: 700, fontStyle: 'normal', },
        h6: { fontFamily: 'mono45-headline, monospace', fontWeight: 700, fontStyle: 'normal', },
        button: { fontFamily: 'mono45-headline, monospace', fontWeight: 700, fontStyle: 'normal', fontSize: '1.575rem', },
    },
});

export default theme;