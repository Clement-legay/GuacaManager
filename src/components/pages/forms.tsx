"use client";

import Box from "@mui/material/Box";
import React, {useContext, useEffect, useState, useCallback} from "react";
import { FormTable } from "@/components/assets/tables/formTable";
import Typography from "@mui/material/Typography";
import CreateFormModal from "@/components/assets/modals/create/createFormModal";
import { FormWithRelations } from "@/services/Forms/models/form.model";
import Button from "@mui/material/Button";
import {useRouter} from "next/navigation";
import {ContentCopy} from "@mui/icons-material";
import {Tooltip, useTheme} from "@mui/material";
import {defaultError} from "@/app/context/config/toastMessages";
import {MainContext} from "@/app/context/contextProvider";
import {useToastedContext} from "@/app/context/config/toastedContext";
import DeleteFormModal from "@/components/assets/modals/delete/deleteFormModal";
import {GridSelection} from "@glideapps/glide-data-grid";

export const Forms = () => {
    const [isLoading, setLoading] = useState(false)
    const [formSelected, setFormSelected] = React.useState<FormWithRelations | null>(null);
    const [gridSelection, setGridSelection] = React.useState<GridSelection>();
    const {getForms} = useContext(MainContext);
    const toastedContext = useToastedContext();
    const router = useRouter();
    const theme = useTheme();

    const callBackForms = useCallback(async () => {
        await toastedContext("getForms", undefined, defaultError);
    }, [getForms]);

    useEffect(() => {
        setLoading(true)
        callBackForms().then(() => setLoading(false))
    }, [])

    const handleDuplicate = async () => {
        if (formSelected) {
            setLoading(true)
            const result = await toastedContext("duplicateForm", {formId: formSelected.id})
            if (result) {
                router.push("/formulaires/" + result)
            } else {
                setLoading(false)
            }
        }
    }

    return (
        <Box sx={{
            flexGrow: 1,
            [theme.breakpoints.up("md")]: {px: 5, py: 1},
            [theme.breakpoints.down("md")]: {px: 2, pt: 3, pb: 1}
        }}
        >
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
                }}>Formulaires</Typography>
                <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <Tooltip
                        arrow
                        title={
                            <>
                                <Typography sx={{fontSize: "0.8rem", textAlign: "center"}} color="inherit">Dupliquer le formulaire</Typography>
                                {!formSelected && (
                                    <Typography sx={{fontSize: "0.8rem", textAlign: "center"}} color="inherit">(sélectionnez un formulaire)</Typography>
                                )}
                            </>
                        }
                    >
                        <Box>
                            <Button onClick={handleDuplicate} color={"success"} variant={"outlined"} sx={{textTransform: "none", ml:1, mr:2}} disabled={!formSelected}>
                                <ContentCopy/>
                            </Button>
                        </Box>
                    </Tooltip>
                    <DeleteFormModal type={"table"} formId={formSelected?.id} setGridSelection={setGridSelection}/>
                    <CreateFormModal/>
                </Box>
            </Box>
            <FormTable setFormSelected={setFormSelected} isLoading={isLoading} gridSelection={gridSelection} setGridSelection={setGridSelection}/>
        </Box>
    )
}