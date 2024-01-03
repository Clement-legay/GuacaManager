import * as React from 'react';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import {Fragment, useContext} from "react";
import {AddLinkOutlined} from "@mui/icons-material";
import {FormInputWithRelations} from "@/services/FormInputs/models/formInput.model";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {LoadingButton} from "@mui/lab";
import {FileAssociationForm} from "@/components/assets/fileAssociationForm";
import {MainContext} from "@/app/context/contextProvider";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {FileAssociationWithRelations} from "@/services/FormInputs/models/fileAssociation.model";
import { Tooltip } from '@mui/material';
import Button from "@mui/material/Button";
import {BootstrapDialog, BootstrapDialogTitle} from "@/styles/components/bootstrapDialog";

type Props = {
    formInput: FormInputWithRelations,
}

export default function CreateFileAssociations({ formInput }: Props) {
    const [open, setOpen] = React.useState(false);
    const [buttonLoading, setButtonLoading] = React.useState(false);
    const { form } = useContext(MainContext);
    const toastedContext = useToastedContext();

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const createFileAssociation = async () => {
        if (form) {
            setButtonLoading(true);
            await toastedContext("addFileAssociation", {inputId: formInput.id, option: "default"});
            setButtonLoading(false);
        }
    }

    return (
        <Fragment>
            <Tooltip
                arrow
                title={"Gérer les associations aux fichiers"}
            >
                <IconButton
                    onClick={handleClickOpen}
                    sx={{outline: "1px solid rgba(75,85,94,0.1)", mb: 1}}
                >
                    <AddLinkOutlined/>
                </IconButton>
            </Tooltip>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="create-input-options-dialog"
                open={open}
            >
                <BootstrapDialogTitle id="input-options-title" onClose={handleClose}>
                    Gestion des associations aux fichiers
                </BootstrapDialogTitle>
                <DialogContent dividers sx={{
                    minWidth: 400,
                }}>
                    {formInput.FileAssociations?.length !== 0 ?
                        formInput.FileAssociations.map((fileAssociation: FileAssociationWithRelations, index: number) => (
                            <FileAssociationForm
                                key={index}
                                fileAssociation={fileAssociation}
                                index={index}
                                formInput={formInput}
                            />
                        )) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mb: 2
                                }}>
                                <Typography variant="h6" component="div">
                                    Pas encore d'association
                                </Typography>
                            </Box>
                        )
                    }
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 4
                        }}
                    >
                        <LoadingButton loading={buttonLoading} variant={"outlined"} color={"secondary"} onClick={createFileAssociation}>
                            Ajouter
                        </LoadingButton>
                        <Button variant={"contained"} color={"primary"} onClick={handleClose} sx={{ml: 2}}>
                            Valider
                        </Button>
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </Fragment>
    );
}