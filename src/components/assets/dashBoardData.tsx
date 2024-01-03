import React from "react";
import {Box, Grid, Typography, useTheme} from "@mui/material";
import {TrendingUp} from "@mui/icons-material";
import EqualizerIcon from '@mui/icons-material/Equalizer';

type Props = {
    type: "form" | "response",
}

export const DashBoardData = ({ type }: Props) => {
    const theme = useTheme();

    return (
        <Box sx={{
            width: "100%",
            borderRadius: "10px",
            mb: type === "form" ? 2 : 0,
            mt: type === "response" ? 2 : 0,
            py: 2,
            px: 4,
            height: "calc(50% - 16px)",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        }}>
            <Grid container spacing={2} alignItems={"center"} justifyContent={"space-between"}>
                <Grid item xs={9}>
                    <Box sx={{
                        display:"flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                    }}>
                        <Typography variant="h2" color={"#212B36"} sx={{fontWeight: 500, fontSize: "1rem"}}>
                            {type === "form"
                                ? "Total des formulaires créés"
                                : "Total des réponses enregistrées"
                            }
                        </Typography>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyItems: "center",
                            my: 1
                        }}>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyItems: "center",
                                height: "auto",
                                padding: 0.5,
                                borderRadius: "50%",
                                backgroundColor: type === "form"
                                    ? "rgba(251,226,23,0.40)"
                                    : "rgba(175,165,209,0.4)",
                                mr: 1
                            }}>
                                <TrendingUp sx={{fontSize: "1em"}}/>
                            </Box>
                            <Typography variant="subtitle1" color={"#212B36"} sx={{fontWeight: 400, fontSize: "0.8rem"}}>
                                + 0.2%
                            </Typography>
                        </Box>
                        <Typography variant="h3" color={"#212B36"} sx={{fontWeight: 700, fontSize: "1.2rem"}}>10 820</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4} md={3}>
                    <Box sx={{
                        display:"flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                    }}>
                        <EqualizerIcon color={"success"} sx={{
                            fontSize: "4em",
                            color: type === "form"
                            ? "rgba(251,226,23,0.9)"
                            : "rgba(175,165,209,0.9)",
                        }}/>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}