import {createTheme} from "@mui/material";

export const theme = (darkMode: Boolean) => {
    const palette = darkMode ? {
            primary: {
                main: "#FBE217",
            },
            secondary: {
                main: "#AFA5D1",
            },
            warning: {
                main: "#DD6E42",
            },
            success: {
                main: "#6A994E",
            },
            info: {
                main: "#387780",
            },
            error: {
                main: "#8C1C13",
            },
            background: {
                default: "#000000",
                paper: "#1C1C1C",
            },
            text: {
                primary: "#FFFFFF",
            }
        } : {
            primary: {
                main: "#FBE217",
            },
            secondary: {
                main: "#AFA5D1",
            },
            warning: {
                main: "#DD6E42",
            },
            success: {
                main: "#6A994E",
            },
            info: {
                main: "#387780",
            },
            error: {
                main: "#8C1C13",
            },
            background: {
                default: "#FFFFFF",
                paper: "#F5F5F5",
            },
            text: {
                primary: "#000000",
            }
        };

    return createTheme({
            palette,
        }
    );
}
