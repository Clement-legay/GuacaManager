import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";

export interface DialogTitleProps {
    id: string;
    onClose: () => void;
    children?: React.ReactNode;
}

export const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
}));


export function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}