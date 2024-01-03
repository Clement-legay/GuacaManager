import * as React from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import * as Yup from "yup";
import {Formik} from "formik";
import {Grid, TextField} from "@mui/material";
import {MuiFileInput} from "mui-file-input";
import Typography from "@mui/material/Typography";
import { useToastedContext} from "@/app/context/config/toastedContext";
import {BootstrapDialog, BootstrapDialogTitle} from "@/styles/components/bootstrapDialog";

type TemplateFileValues = {
    name: string,
    description: string,
    templateFile: string,
}

const fileSizeLimit = process.env.MAX_FILE_SIZE_MO ? parseInt(process.env.MAX_FILE_SIZE_MO) * 1024 * 1024 : 2 * 1024 * 1024;

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Le nom est requis"),
    description: Yup.string().required("La description est requise"),
    templateFile: Yup.string().required("Le fichier est requis"),
});

export default function CreateTemplateFileModal() {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [file, setFile] = React.useState<File | null>(null);
    const [fileError, setFileError] = React.useState<string | undefined>(undefined);
    const toastedContext = useToastedContext();
    const [initialValues, setInitialValues] = React.useState<TemplateFileValues>({
        name: "",
        description: "",
        templateFile: "",
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleFileChange = (fileValues: File | null, values: TemplateFileValues): void => {
        if (fileValues) {
            setFile(fileValues);
            if (fileValues.size > fileSizeLimit) {
                setFileError(`Le fichier est trop volumineux (${(fileValues.size/1024/1024).toFixed(2)}MB) - limite: ${(fileSizeLimit/1024/1024).toFixed(2)}MB`);
                return;
            }

            setFileError(undefined);
            const reader = new FileReader();
            reader.readAsDataURL(fileValues);

            reader.onloadend = () => {
                values.templateFile = reader.result as string;
            }
        } else {
            setFile(null);
            values.templateFile = "";
        }
    }

    const submitBtnClick = () => {
        const button = document.getElementById("sendTemplateFileButton");
        if (button) {
            button.click();
        }
    }

    const templateFileSubmit = async (values: TemplateFileValues) => {
        setLoading(true);

        await toastedContext("addTemplateFile", {values: values, file: file!});
        setLoading(false)
        setOpen(false);
        setInitialValues({
            name: "",
            description: "",
            templateFile: "",
        });
        setFile(null);
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
                    Création fichier Template
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={templateFileSubmit}
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
                                    <Grid item xs={12} lg={12}>
                                        <MuiFileInput
                                            fullWidth
                                            color={"secondary"}
                                            id="file"
                                            name="file"
                                            label="Fichier (.docx, .xlsx)"
                                            value={file}
                                            onChange={(fileValues) => {
                                                handleFileChange(fileValues, values);
                                            }}
                                            onBlur={handleBlur}
                                            error={touched.templateFile && Boolean(errors.templateFile)}
                                            helperText={touched.templateFile && errors.templateFile}
                                            inputProps={{
                                                accept: ".docx,.xlsx",
                                            }}
                                        />
                                        {(fileError && !touched.templateFile) && (
                                            <Typography sx={{p:0, m:0, pl:1.6}} variant={"caption"} color={"#8C1C13"}>
                                                {fileError}
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>
                                <Button disabled={loading} id={"sendTemplateFileButton"} type="submit" hidden={true} />
                            </form>
                        )}
                    </Formik>
                </DialogContent>
                <DialogActions>
                    <Button disabled={loading} color={"secondary"} onClick={submitBtnClick}>
                        Enregistrer
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}