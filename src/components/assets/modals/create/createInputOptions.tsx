import * as React from 'react';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import {SellOutlined} from "@mui/icons-material";
import {FormInputWithRelations} from "@/services/FormInputs/models/formInput.model";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {LoadingButton} from "@mui/lab";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {InputOptionForm} from "@/components/assets/inputOptionForm";
import {InputOptionWithRelations} from "@/services/FormInputs/models/inputOption.model";
import { Tooltip } from '@mui/material';
import {Fragment} from "react";
import Button from "@mui/material/Button";
import {BootstrapDialog, BootstrapDialogTitle} from "@/styles/components/bootstrapDialog";

type Props = {
    formInput: FormInputWithRelations,
    disabled: boolean
}

export default function CreateInputOptions({ disabled, formInput }: Props) {
    const [open, setOpen] = React.useState(false);
    const [buttonLoading, setButtonLoading] = React.useState(false);
    const toastedContext = useToastedContext();

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const createInputOption = async () => {
        setButtonLoading(true);
        await toastedContext("addInputOption", {inputId: formInput.id, option: "default"});
        setButtonLoading(false);
    }

    return (
        <Fragment>
            <Tooltip
                arrow
                title={"Gérer les options du champ"}
            >
                <Box>
                    <IconButton
                        onClick={handleClickOpen}
                        sx={{outline: "1px solid rgba(75,85,94,0.1)", mb: 1}}
                        disabled={disabled}
                    >
                        <SellOutlined/>
                    </IconButton>
                </Box>
            </Tooltip>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="create-input-options-dialog"
                open={open}
            >
                <BootstrapDialogTitle id="input-options-title" onClose={handleClose}>
                    Gestion des options du champ
                </BootstrapDialogTitle>
                <DialogContent dividers sx={{
                    minWidth: 400,
                }}>
                    {formInput.InputOptions && formInput.InputOptions.length !== 0 ?
                        formInput.InputOptions
                            .sort((a: InputOptionWithRelations, b: InputOptionWithRelations) => a.createdAt > b.createdAt ? 1 : -1)
                            .map((inputOption: InputOptionWithRelations, index: number) => (
                            <InputOptionForm
                                key={index}
                                inputOption={inputOption}
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
                                    Pas encore options
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
                        <LoadingButton loading={buttonLoading} variant={"outlined"} color={"secondary"} onClick={createInputOption}>
                            Ajouter
                        </LoadingButton>
                        <Button variant={"contained"} onClick={handleClose} sx={{ml: 2}}>
                            Valider
                        </Button>
                    </Box>
                </DialogContent>
            </BootstrapDialog>
        </Fragment>
    );
}