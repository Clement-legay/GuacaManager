"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import * as Yup from "yup";
import { Formik } from "formik";
import { Grid, TextField } from "@mui/material";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {useRouter} from "next/navigation";
import {LoadingButton} from "@mui/lab";
import {BootstrapDialog, BootstrapDialogTitle} from "@/styles/components/bootstrapDialog";

type FormValues = {
    name: string,
    description: string,
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
});

export default function CreateFormModal() {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const toastedContext = useToastedContext();
    const router = useRouter();

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const submitBtnClick = () => {
        const button = document.getElementById("sendFormButton");
        if (button) {
            button.click();
        }
    }

    const formSubmit = async (values: FormValues) => {
        setLoading(true);
        const parsedValues = {
            name: values.name,
            description: values.description !== "" ? values.description : null,
        }
        const newFormId = await toastedContext("addForm", {values: parsedValues})
        if (newFormId) {
            router.push("/formulaires/" + newFormId)
        }
        setLoading(false);
        setOpen(false);
    }

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                Créer
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="create-form-dialog"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Création Formulaire
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Formik
                        initialValues={{
                            name: "",
                            description: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={formSubmit}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2} p={1} alignItems="center" justifyContent="center">
                                    <Grid item xs={12} lg={12}>
                                        <TextField
                                            color={"secondary"}
                                            fullWidth
                                            id="name"
                                            name="name"
                                            label="Name"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={12}>
                                        <TextField
                                            color={"secondary"}
                                            fullWidth
                                            id="description"
                                            name="description"
                                            label="Description"
                                            value={values.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.description && Boolean(errors.description)}
                                            helperText={touched.description && errors.description}
                                        />
                                    </Grid>
                                </Grid>
                                <Button id={"sendFormButton"} type="submit" hidden={true} />
                            </form>
                        )}
                    </Formik>
                </DialogContent>
                <DialogActions>
                    <LoadingButton loading={loading} color={"secondary"} onClick={submitBtnClick}>
                        Enregistrer
                    </LoadingButton>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}