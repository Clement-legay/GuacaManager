import {CSSObject, styled, Theme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import {AppBarProps as MuiAppBarProps} from "@mui/material/AppBar/AppBar";
import {BoxProps} from "@mui/system";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import IconButton, {IconButtonProps} from "@mui/material/IconButton";
import {ImageProps} from "next/image";
import { Avatar, ListItemButton } from "@mui/material";

const drawerWidth = 300;
const closedDrawerWidth = 65;
const appBarHeight = 90;

interface iconButtonProps extends IconButtonProps {
    open: boolean;
}

interface listItemProps extends IconButtonProps {
    open: boolean;
}

export const LinksItemButton = styled(ListItemButton, 
    { shouldForwardProp: (prop) => prop !== 'open' })
    <listItemProps>(({ theme, open }) => ({
        minHeight: 48,
        justifyContent: open ? 'initial' : 'center',
        px: 2.5,
        marginLeft: '15px',
        borderRadius: '15px 0 0 15px',
        ...(!open && {
            borderRadius: '5px',
            marginLeft: '5px',
            marginRight: '5px',
            justifyContent: 'center',
            width: 'calc(100% - 10px)',
            flexDirection: 'column',
        })
}));

export const ButtonSidebar = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'open'})
    <iconButtonProps>(({ theme, open }) => ({
        position: "fixed",
        height: "30px",
        width: "30px",
        border: "1px solid rgba(0,0,0,0.3)",
        backgroundColor: "#f5f5f5",
        zIndex: 1200,
        top: appBarHeight / 2,
        left: open ? `${drawerWidth}px` : `${closedDrawerWidth }px`,
        transform: "translate(-50%, -50%)",
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        hover: {
            '&:hover': {
                backgroundColor: "#f5f5f5",
            }
        },
        [theme.breakpoints.between("xs", 'md')]: {
            left: open ? `${drawerWidth}px` : 8,
        },
}));


const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('md')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
    [theme.breakpoints.between("xs", 'md')]: {
        width: 0,
    },
    overflowX: 'hidden',
});

export const ContainerBox = styled(Box, {
        shouldForwardProp: (prop) => prop !== 'open' })
    <ContainerBoxProps>(({ theme, open }) => ({
        display: 'flex',
        flexDirection: 'column',
        marginTop: `${appBarHeight}px`,
        [theme.breakpoints.up('sm')]: {
            marginLeft: `${drawerWidth}px`,
            ...(open && {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: `${drawerWidth}px`,
            }),
            ...(!open && {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                marginLeft: `${closedDrawerWidth}px`,
            }),
        },
        [theme.breakpoints.between('xs', 'md')]: {
            marginLeft: 0,
            marginTop: 0,
        }
    }));


export const DrawerHeader = styled('div')(({ theme }) => ({
    height: `${appBarHeight}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface LogoImageProps extends ImageProps {
    open?: boolean;
}
export const LogoImage = styled('img', {
    shouldForwardProp: (prop) => prop !== 'open',
    })<LogoImageProps>(({ theme, open }) => ({
        height: open ? 50 : 25,
        width: open ? 100 : 50,
        transition: theme.transitions.create(['width', 'height'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
}));

export const AccountCard = styled(Box,
    { shouldForwardProp: (prop) => prop !== 'open' })
    <ContainerBoxProps>(({ theme, open }) => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-between',
        width: 'calc(100% - 30px)',
        height: '100px',
        backgroundColor: "rgba(145,158,171,0.12)",
        borderRadius: "15px",
        margin: "15px",
        padding: "10px",
        transition: theme.transitions.create('padding', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(!open && {
            transition: theme.transitions.create('hide', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: 'calc(100%)',
            marginLeft: "0px",
            marginRight: "0px",
            borderRadius: "0px",
            display: 'none',
        }),
}));

export const AccountCardAvatar = styled(Avatar, { shouldForwardProp: (prop) => prop !== 'open' })
    <ContainerBoxProps>(({ theme, open }) => ({
        transition: theme.transitions.create(['width', 'height'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: 45,
        height: 45,
        ...(open && {
            transition: theme.transitions.create(['width', 'height'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: 60,
            height: 60,
            marginRight: "15px",
        }),
}));

export const AccountCardInfos = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })
    <ContainerBoxProps>(({ theme, open }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-between',
        color: "#212B36",
        ...(!open && {
            transition: theme.transitions.create('display', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            display: 'none',
        }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

interface ContainerBoxProps extends BoxProps {
    open?: boolean;
}

export const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    [theme.breakpoints.up('md')]: {
        zIndex: theme.zIndex.drawer - 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: `calc(100% - ${closedDrawerWidth}px)`,
        height: `${appBarHeight}px`,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-between',
        boxShadow: "none",
        ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    },
    [theme.breakpoints.down('md')]: {
        display: 'none',
    }
}));

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);