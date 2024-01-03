import * as React from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import * as Yup from "yup";
import {Formik} from "formik";
import {Grid} from "@mui/material";
import {MuiFileInput} from "mui-file-input";
import * as mime from "mime-types";
import Typography from "@mui/material/Typography";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {TemplateFileWithRelations} from "@/services/TemplateFile/models/templateFile.model";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {BootstrapDialog, BootstrapDialogTitle} from "@/styles/components/bootstrapDialog";

type TemplateFileValues = {
    templateFile: string,
}

const fileSizeLimit = process.env.MAX_FILE_SIZE_MO ? parseInt(process.env.MAX_FILE_SIZE_MO) * 1024 * 1024 : 2 * 1024 * 1024;

const validationSchema = Yup.object().shape({
    templateFile: Yup.string().required("Le fichier est requis"),
});

type Props = {
    fileSelected: TemplateFileWithRelations | null,
}

export default function UpdateTemplateFileModal({ fileSelected }: Props) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [file, setFile] = React.useState<File | null>(null);
    const [fileError, setFileError] = React.useState<string | undefined>(undefined);
    const toastedContext = useToastedContext();
    const [initialValues, setInitialValues] = React.useState<TemplateFileValues>({
        templateFile: ""
    });

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleFileChange = (fileValues: File | null, values: TemplateFileValues): void => {
        if (fileValues) {
            if (fileValues.size > fileSizeLimit) {
                setFileError(`Le fichier est trop volumineux (${(fileValues.size/1024/1024).toFixed(2)}MB) - limite: ${(fileSizeLimit/1024/1024).toFixed(2)}MB`);
                return;
            }

            setFile(fileValues);
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
        if (fileSelected && file) {
            setLoading(true);

            await toastedContext("updateTemplateFile", {templateFileId: fileSelected.id, templateFile: values.templateFile, file: file});
            setLoading(false)
            setOpen(false);
            setInitialValues({
                templateFile: "",
            });
            setFile(null);
        }
    }

    return (
        <div>
            <Button onClick={handleClickOpen} color={"secondary"} variant={"outlined"} sx={{textTransform: "none", mx:1}} disabled={!fileSelected}>
                <UploadFileIcon/>
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="update-form-dialog"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Modification de fichier
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} p={1} alignItems="center" justifyContent="center">
                        <Grid item xs={12} lg={12}>
                            {fileSelected?.FileAssociations && fileSelected.FileAssociations.length > 0
                                ? (
                                    <div>
                                        <Typography color={"error"} gutterBottom sx={{textAlign:"justify"}}>
                                            Attention, ce fichier est associé {fileSelected.FileAssociations.length} fois à des champs.
                                        </Typography>
                                        <Typography sx={{textAlign:"justify"}} gutterBottom>
                                            Veillez à ne modifier le fichier que si vous êtes sûr de ne pas les impacter.
                                        </Typography>
                                    </div>
                                )
                                : (
                                    <Typography sx={{textAlign:"justify"}} gutterBottom>
                                        Ce fichier n'est actuellement associé à aucun champ de formulaire.
                                    </Typography>
                                )
                            }
                        </Grid>
                    </Grid>
                    {fileSelected && (
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={templateFileSubmit}
                        >
                            {({
                                  values,
                                  errors,
                                  touched,
                                  handleBlur,
                                  handleSubmit,
                              }) => (
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={2} p={1} alignItems="center" justifyContent="center">
                                        <Grid item xs={12} lg={12}>
                                            <MuiFileInput
                                                fullWidth
                                                color={"secondary"}
                                                id="file"
                                                name="file"
                                                label={`Fichier (${mime.extension(fileSelected.fileType) ? mime.extensions[fileSelected.fileType][0] : ".docx, .xlsx"})`}
                                                value={file}
                                                onChange={(fileValues) => {
                                                    handleFileChange(fileValues, values);
                                                }}
                                                onBlur={handleBlur}
                                                error={touched.templateFile && Boolean(errors.templateFile)}
                                                helperText={touched.templateFile && errors.templateFile}
                                                inputProps={{
                                                    accept: mime.extension(fileSelected.fileType) ? "." + mime.extensions[fileSelected.fileType][0] : ".docx, .xlsx",
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
                    )}
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