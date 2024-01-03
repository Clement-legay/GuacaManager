import * as React from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {Fragment, useCallback, useContext, useEffect} from "react";
import { LoadingButton } from '@mui/lab';
import Typography from "@mui/material/Typography";
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import { useRouter } from "next/navigation";
import {Tooltip} from "@mui/material";
import {MainContext} from "@/app/context/contextProvider";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {BootstrapDialog, BootstrapDialogTitle} from "@/styles/components/bootstrapDialog";

type Props = {
    formId: string | undefined,
    type: "table" | "form",
    setGridSelection?: React.Dispatch<React.SetStateAction<any>>,
}

export default function DeleteFormModal({ formId, type = "form", setGridSelection }: Props) {
    const [open, setOpen] = React.useState(false);
    const [responses, setResponses] = React.useState<number | null>(null);
    const [buttonLoading, setButtonLoading] = React.useState(true);
    const {getIntOfFormResponses} = useContext(MainContext);
    const toastedContext = useToastedContext();

    const router = useRouter();

    const getFormResponsesNumber = useCallback(async () => {
        if (!formId) return;
        const result = await getIntOfFormResponses({formId: formId});
        if (result) setResponses(result)
    }, [formId])

    useEffect(() => {
        if (open) {
            setButtonLoading(true)
            getFormResponsesNumber().then()
            setTimeout(() => {
                setButtonLoading(false)
            }, 3000)
        } else {
            setResponses(null)
        }
    }, [open])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeletion = async () => {
        if (!formId) return;
        setButtonLoading(true)
        const result = await toastedContext("deleteForm", {formId: formId})
        if (result) {
            if (setGridSelection) {
                setGridSelection(undefined);
                setOpen(false);
            } else {
                router.push("/formulaires");
            }
        } else setButtonLoading(false)
    }

    return (
        <div>
            <Tooltip title={"Supprimer le formulaire"} arrow>
                <Fragment>
                    <Button sx={{
                        mr: type === "table" ? 2 : 0,
                    }} disabled={!formId} color={"warning"} variant="outlined" onClick={handleClickOpen}>
                        <DeleteOutlineTwoToneIcon />
                    </Button>
                </Fragment>
            </Tooltip>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="create-form-dialog"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Suppression du formulaire
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Êtes-vous sûr de vouloir supprimer ce formulaire ?
                    </Typography>
                    {responses && responses > 0
                        ? (
                            <Typography variant={"body2"} color={"error"}>
                                Attention, ce formulaire contient {responses} réponses.
                            </Typography>
                        )
                        : (
                            <Typography variant={"body2"} color={"success"}>
                                Ce formulaire ne contient encore aucune réponse.
                            </Typography>
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <LoadingButton loading={buttonLoading} color={"warning"} onClick={handleDeletion}>
                        Supprimer
                    </LoadingButton>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}