import { createTheme } from '@mui/material/styles';


//surcharger le thème par défaut du calendrier
const darkTheme = createTheme({
    palette: {
        primary: {
            main: "#E67E22",
            contrastText: "#EEE",
        },
        secondary: {
            main: "#E67E22BB",
            contrastText: "#EEE",
        },
        background: {
            default: "#313338",
            paper: "#313338",
        },
        grey: {
            "300": "#80848E",
        },
        text: {
            primary: "#DDD",
            secondary: "#CCC",
        },
        error: {
            light: "#C31313",
            main: "#C31313",
        },
    },
    components: {
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#DDD',
                },
            }
        },
        MuiIcon:{
            styleOverrides: {
                root: {
                    color: '#DDD',
                },
            }
        },
        MuiTab:{
            styleOverrides: {
                root: {
                    backgroundColor: "#313338",
                }
            }
        }
    },
}
);

export {darkTheme};