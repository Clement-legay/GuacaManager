"use client";

import React, {useContext} from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { AppBar, Drawer, DrawerHeader, ContainerBox, ButtonSidebar, LogoImage, AccountCard, AccountCardInfos, AccountCardAvatar, LinksItemButton } from '@/styles/components/sidebar.module';
import {
    InsertDriveFileTwoTone,
    SpeedTwoTone,
    DynamicFormTwoTone,
    SearchTwoTone,
    MenuOpen,
    Menu
} from "@mui/icons-material";
import {MainContext} from "@/app/context/contextProvider";
import {Avatar, useMediaQuery, useTheme} from "@mui/material";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function MiniDrawer({ children }: { children: React.ReactNode }) {
    const { sideBarOpen, setSideBarState } = useContext(MainContext);
    const linkPath = usePathname();
    const theme = useTheme()
    const onlySmallScreen = useMediaQuery(theme.breakpoints.between('xs', 'md'));

    const avatarLink = "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50";

    const handleLinkClicked = () => {
        if (onlySmallScreen) setSideBarState(false);
    }

    const handleDrawerChange = () => {
        setSideBarState(!sideBarOpen);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', position: "relative" }}>
                <AppBar position="fixed" open={sideBarOpen} sx={{backgroundColor: "#fff"}}>
                    <Toolbar sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                        <Typography variant="h6" noWrap component="div" sx={{color: "#000", fontSize: "2rem", ml: 2}}>
                            <SearchTwoTone sx={{color: "#637381", mr: 2}}/>
                        </Typography>
                        <Avatar alt="Remy Sharp" src={avatarLink} sx={{mr: 2}}/>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={sideBarOpen}>
                    <DrawerHeader>
                        <LogoImage src="/images/logo/logo.png" alt="logo CESI" open={sideBarOpen}/>
                    </DrawerHeader>
                    <AccountCard open={sideBarOpen}>
                        <AccountCardAvatar alt="Remy Sharp" src={avatarLink} open={sideBarOpen}/>
                        <AccountCardInfos open={sideBarOpen}>
                            <Typography variant="subtitle1" sx={{fontWeight: 550}}>Remy Sharp</Typography>
                            <Typography variant="subtitle2" sx={{fontWeight: 550}}>Administrateur</Typography>
                        </AccountCardInfos>
                    </AccountCard>
                    {sideBarOpen && (
                        <Typography variant="subtitle1" sx={{fontWeight: 550, color: "#637381", mt: 3, ml: 2.5}}>Général</Typography>
                    )}
                    <List>
                        {links.map((link, index) => (
                            <ListItem key={index} disablePadding sx={{ display: 'flex' }}>
                                <Link onClick={handleLinkClicked} href={link.link} style={{display: 'block', width: "100%"}}>
                                    <LinksItemButton open={!!sideBarOpen}
                                        sx={{
                                            backgroundColor: (link.link !== "/" ? linkPath.includes(link.link) : linkPath === link.link) ? 'rgba(175,165,209,0.15)' : 'transparent',
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: sideBarOpen ? 3 : 'auto',
                                                justifyContent: 'center',
                                                color: linkPath == link.link ? '#AFA5D1' : '#637381'
                                            }}
                                        >
                                            {link.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={link.name} sx={{
                                                color: linkPath === link.link ? "#AB9ED6" : "#637381",
                                                fontSize: linkPath === link.link ? "1.1rem" : "0.5rem",
                                            }}
                                            primaryTypographyProps={{
                                                fontSize: sideBarOpen ? "1.1rem" : "0.6rem",
                                            }}
                                        />
                                    </LinksItemButton>
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </Box>
            <ButtonSidebar sx={{
                backgroundColor: "#f5f5f5",
                outline: "none"
            }} open={!!sideBarOpen} onClick={handleDrawerChange}>
                {onlySmallScreen
                    ? sideBarOpen ? <MenuOpen/> : <Menu/>
                    : sideBarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />
                }
            </ButtonSidebar>
            <ContainerBox open={sideBarOpen}>
                {children}
            </ContainerBox>
        </Box>
    );
}

const links = [
    {
        name: "Dashboard",
        link: "/",
        icon: <SpeedTwoTone />
    },
    {
        name: "Formulaires",
        link: "/formulaires",
        icon: <DynamicFormTwoTone />
    },
    {
        name: "Fichiers",
        link: "/fichiers",
        icon: <InsertDriveFileTwoTone />
    }
]