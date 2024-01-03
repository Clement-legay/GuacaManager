"use client";

import {Box, Button, Grid, Typography, useMediaQuery, useTheme} from "@mui/material";
import Link from "next/link";
import Lottie from "lottie-react";
import sendForm from "../../styles/lotties/sendForm.json";
import {TimelineTwoTone} from "@mui/icons-material";
import React from "react";
import {DashBoardData} from "@/components/assets/dashBoardData";
import {FormTableSample} from "@/components/assets/tables/formTableSample";

export const Dashboard = () => {
    const theme = useTheme();
    const onlySmallScreen = useMediaQuery(theme.breakpoints.between('xs', 'lg'));

    return (
        <Box sx={{
                flexGrow: 1,
                [theme.breakpoints.up("md")]: {px: 5, py: 1},
                [theme.breakpoints.down("md")]: {px: 2, py: 1}
            }}
        >
            <Grid container spacing={2}>
                <Grid item sm={12} md={12} lg={8}>
                    <Box sx={{
                        backgroundColor: "rgb(175, 165, 209, 0.5)",
                        height: "auto",
                        width: "100%",
                        borderRadius: "10px",
                        padding: 5,
                        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                    }}>
                        <Grid container spacing={2}>
                            <Grid item sm={12} md={12} lg={6}>
                                <Typography variant="h1" color="initial" sx={{
                                    fontWeight: 600,
                                    fontSize: "1.8rem",
                                    mb: 4
                                }}>Bienvenue !</Typography>
                                <Typography variant="body1" color="initial">Vous êtes sur la page daccueil de lapplication de gestion des formulaires du CESI.</Typography>
                                <Link href={"/formulaires"}>
                                    <Button variant="contained" sx={{fontWeight: 500, mt:4}}>
                                        Formulaires
                                    </Button>
                                </Link>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={6}>
                                <Box sx={{
                                    height: "300px",
                                    width: "100%",
                                    position: "relative",
                                    overflow: "hidden"
                                }}>
                                    <Lottie animationData={sendForm} style={{
                                        width: "500px",
                                        height: "500px",
                                        position: "absolute",
                                        transform: "translate(-50%, -50%)",
                                        top: "50%",
                                        left: "50%",
                                    }}/>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                {!onlySmallScreen && (
                    <Grid item lg={4}>
                        <Box sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}>
                            <DashBoardData type={"form"}/>
                            <DashBoardData type={"response"}/>
                        </Box>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <FormTableSample />
                </Grid>
            </Grid>
        </Box>
    )
}