"use client";

import Box from "@mui/material/Box";
import React, {useEffect, useState, useCallback} from "react";
import Typography from "@mui/material/Typography";
import {TemplateFileTable} from "@/components/assets/tables/templateFileTable";
import CreateTemplateFileModal from "@/components/assets/modals/create/createTemplateFileModal";
import {TemplateFileWithRelations} from "@/services/TemplateFile/models/templateFile.model";
import {Tooltip, useTheme} from "@mui/material";
import UpdateTemplateFileModal from "@/components/assets/modals/update/updateTemplateFileModal";
import DeleteTemplateFileModal from "@/components/assets/modals/delete/deleteTemplateFileModal";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {defaultError} from "@/app/context/config/toastMessages";
import {GridSelection} from "@glideapps/glide-data-grid";

export const TemplateFiles = () => {
    const [isLoading, setLoading] = useState(false)
    const [fileSelected, setFileSelected] = React.useState<TemplateFileWithRelations | null>(null);
    const [gridSelection, setGridSelection] = React.useState<GridSelection>();
    const toastedContext = useToastedContext();
    const theme = useTheme();

    const callBackTemplateFiles = useCallback(async () => {
        await toastedContext("getTemplateFiles", undefined, defaultError);
    }, []);

    useEffect(() => {
        setLoading(true)
        callBackTemplateFiles().then(() => setLoading(false))
    }, [])


    return (
        <Box sx={{
            flexGrow: 1,
            [theme.breakpoints.up("md")]: {px: 5, py: 1},
            [theme.breakpoints.down("md")]: {px: 2, pt: 3, pb: 1}
        }}>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
            }}>
                <Typography variant="h1" color="initial" sx={{
                    [theme.breakpoints.up("sm")]: {fontSize: "2rem"},
                    [theme.breakpoints.down("sm")]: {fontSize: "1.5rem"},
                }}>Fichiers</Typography>
                <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <Tooltip
                        arrow
                        title={
                            <>
                                <Typography sx={{fontSize: "0.8rem", textAlign: "center"}} color="inherit">Modifier le fichier</Typography>
                                {!fileSelected && (
                                    <Typography sx={{fontSize: "0.8rem", textAlign: "center"}} color="inherit">(sélectionnez un fichier)</Typography>
                                )}
                            </>
                        }
                    >
                        <Box>
                            <UpdateTemplateFileModal fileSelected={fileSelected}/>
                        </Box>
                    </Tooltip>
                    <Tooltip
                        arrow
                        title={
                            <>
                                <Typography sx={{fontSize: "0.8rem", textAlign: "center"}} color="inherit">Supprimer le fichier</Typography>
                                {!fileSelected && (
                                    <Typography sx={{fontSize: "0.8rem", textAlign: "center"}} color="inherit">(sélectionnez un fichier)</Typography>
                                )}
                            </>
                        }
                    >
                            <Box>
                                <DeleteTemplateFileModal templateFileSelected={fileSelected} setTemplateFileSelected={setFileSelected} setGridSelection={setGridSelection}/>
                            </Box>
                    </Tooltip>
                    <CreateTemplateFileModal/>
                </Box>
            </Box>
            <TemplateFileTable setFileSelected={setFileSelected} isLoading={isLoading} gridSelection={{
                gridSelection,
                setGridSelection
            }}/>
        </Box>
    )
}