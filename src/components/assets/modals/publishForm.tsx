import React, {Fragment, useEffect} from 'react';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { LoadingButton } from '@mui/lab';
import Typography from "@mui/material/Typography";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {BootstrapDialog, BootstrapDialogTitle} from "@/styles/components/bootstrapDialog";
import SendIcon from '@mui/icons-material/Send';
import Button from "@mui/material/Button";

type Props = {
    disabled: boolean,
    formId: string
}

export default function PublishForm({ disabled, formId }: Props) {
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

    const handlePublication = async () => {
        setButtonLoading(true)
        await toastedContext("publishForm", {formId: formId})
        setOpen(false)
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <Button sx={{mr:1}} disabled={disabled} color={"success"} variant={"outlined"} onClick={handleClickOpen}>
                <SendIcon/>
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="create-form-dialog"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Publier le formulaire
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Êtes-vous sûr de vouloir publier ce formulaire ?
                    </Typography>
                    <Typography variant={"body2"}>
                        Cette action est irréversible et rendra le formulaire accessible à tous.
                    </Typography>
                    <Typography variant={"body2"}>
                        De fait, vous ne pourrez plus le modifier mais vous pourrez toujours le dupliquer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <LoadingButton loading={buttonLoading} color={"secondary"} onClick={handlePublication}>
                        Publier
                    </LoadingButton>
                </DialogActions>
            </BootstrapDialog>
        </Fragment>
    );
}