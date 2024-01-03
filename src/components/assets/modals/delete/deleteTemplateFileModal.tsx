import * as React from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {useEffect} from "react";
import { LoadingButton } from '@mui/lab';
import Typography from "@mui/material/Typography";
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import {TemplateFileWithRelations} from "@/services/TemplateFile/models/templateFile.model";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {BootstrapDialog, BootstrapDialogTitle} from "@/styles/components/bootstrapDialog";

type Props = {
    templateFileSelected: TemplateFileWithRelations | null,
    setTemplateFileSelected: (templateFile: TemplateFileWithRelations | null) => void,
    setGridSelection: (gridSelection: any) => void,
}

export default function DeleteTemplateFileModal({ templateFileSelected, setTemplateFileSelected, setGridSelection }: Props) {
    const [open, setOpen] = React.useState(false);
    const [buttonLoading, setButtonLoading] = React.useState(true);
    const toastedContext = useToastedContext();

    useEffect(() => {
        if (open) {
            setButtonLoading(true)
            setTimeout(() => {
                setButtonLoading(false)
            }, 3000)
        }
    }, [open])

    const handleDeletion = async () => {
        setButtonLoading(true)
        if (!templateFileSelected) return;

        await toastedContext("deleteTemplateFile", {templateFileId: templateFileSelected.id});
        setOpen(false);
        setTemplateFileSelected(null);
        setGridSelection(undefined);
        setButtonLoading(false)
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button color={"warning"} variant="outlined" sx={{mr:2, ml:1}} onClick={handleClickOpen} disabled={!templateFileSelected}>
                <DeleteOutlineTwoToneIcon />
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="create-form-dialog"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Suppression de fichier
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Êtes-vous sûr de vouloir supprimer ce fichier ?
                    </Typography>
                    {templateFileSelected && templateFileSelected.FileAssociations.length > 0
                        ? (
                            <Typography color={"error"} gutterBottom sx={{textAlign:"justify"}}>
                                Attention, ce fichier est associé {templateFileSelected.FileAssociations.length} fois à des champs.
                            </Typography>
                        )
                        : (
                            <Typography variant={"body2"} color={"success"}>
                                Ce fichier n'est actuellement associé à aucun champ de formulaire.
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