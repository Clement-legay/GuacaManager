"use client";

import Box from "@mui/material/Box";
import React, {useEffect, useState, useCallback, useContext} from "react";
import DeleteFormModal from "@/components/assets/modals/delete/deleteFormModal";
import Link from "next/link";
import {Button, Tooltip, useTheme} from "@mui/material";
import Typography from "@mui/material/Typography";
import ChevronLeftTwoToneIcon from '@mui/icons-material/ChevronLeftTwoTone';
import {FormManageInputs} from "@/components/assets/formManageInputs";
import {DataThresholdingOutlined, Edit, Share} from "@mui/icons-material";
import {ResponseTable} from "@/components/assets/tables/responseTable";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {defaultError} from "@/app/context/config/toastMessages";
import {MainContext} from "@/app/context/contextProvider";
import ConfigureForm from "@/components/assets/modals/configureForm";
import PublishForm from "@/components/assets/modals/publishForm";
import IconButton from "@mui/material/IconButton";

export const FormManage = ({ formId, mode }: { formId: string, mode: "data" | "update" }) => {
    const [tooltipState, setTooltipState] = useState<boolean>(false)
    const [isLoading, setLoading] = useState(false)
    const { form } = useContext(MainContext);
    const toastedContext = useToastedContext();
    const theme = useTheme();

    const getData = useCallback(async (mode: string, formId: string)=> {
        if (mode === "data") {
            await toastedContext("getFormWithResponses", {formId: formId}, defaultError)
        } else {
            await toastedContext("getForm", {formId: formId}, defaultError)
        }
    }, []);

    const handleCopyLinkClick = async () => {
        if (!form) return;
        setTooltipState(true);
        setTimeout(() => {
            setTooltipState(false);
        }, 1000);
        const fullUrl = window.location.href.split("/")[0] + "//" + window.location.href.split("/")[2];
        const identifier = (form.alias && form.alias !== "") ? form.alias : form.id;
        await navigator.clipboard.writeText(fullUrl + "/" + identifier);
    };

    useEffect(() => {
        setLoading(true)
        getData(mode, formId).then(() => setLoading(false))
    }, [formId, mode])


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
                <Link href={"/formulaires"}>
                    <Button color={"secondary"} sx={{textTransform: "none"}}>
                        <ChevronLeftTwoToneIcon sx={{color: "#4b555e"}}/>
                        <Typography variant="h1" color="initial" sx={{
                            fontWeight: 600,
                            fontSize: "1.4rem",
                            color: "#4b555e"
                        }}>Formulaires</Typography>
                    </Button>
                </Link>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    {form && (form.status === "published" ? (
                        <Tooltip
                            arrow
                            title={tooltipState ? "Lien copié" : "Copier le lien"}
                        >
                            <Button variant={"outlined"} sx={{mr:1}} color={"success"} onClick={handleCopyLinkClick}>
                                <Share/>
                            </Button>
                        </Tooltip>
                    ) : (
                        <PublishForm disabled={form?.FormInputs.length === 0} formId={formId}/>
                    ))}
                    <ConfigureForm />
                    <Tooltip
                        arrow
                        title={mode === "update" ? "Voir les données" : "Modifier les données"}
                    >
                        <Link href={`/formulaires/${formId}/${mode === "update" ? "donnees" : ""}`}>
                            <Button
                                color={"primary"}
                                variant={"outlined"}
                                sx={{
                                    textTransform: "none",
                                    mr: 1}}
                                disabled={(mode === "update" && form?.FormInputs?.length === 0)}
                            >
                                {mode === "update" ? <DataThresholdingOutlined/> : <Edit/>}
                            </Button>
                        </Link>
                    </Tooltip>
                    <DeleteFormModal type={"form"} formId={formId}/>
                </Box>
            </Box>
            {mode === "update" ? (
                <FormManageInputs isLoading={isLoading}/>
            ) : (
                <ResponseTable isLoading={isLoading}/>
            )}
        </Box>
    )
}