import * as React from 'react';
import {useEffect} from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import * as Yup from "yup";
import {Formik} from "formik";
import {Grid} from "@mui/material";
import {MuiFileInput} from "mui-file-input";
import Typography from "@mui/material/Typography";
import * as mime from "mime-types";
import Box from "@mui/material/Box";
import { FileSpecs } from ".prisma/client";
import Image from "next/image";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {BootstrapDialog, BootstrapDialogTitle} from "@/styles/components/bootstrapDialog";


type TemplateFileValues = {
    file: string,
}

const fileSizeLimit = process.env.MAX_FILE_SIZE_MO ? parseInt(process.env.MAX_FILE_SIZE_MO) * 1024 * 1024 : 2 * 1024 * 1024;

type fileProps = {
    fileUrl: string,
    fileType: string,
}

const validationSchema = Yup.object().shape({
    file: Yup.string().required("Le fichier est requis"),
});

export type InputElement = {
    formResponseId: string,
    formInputId: string | null,
    formResponseInputId: string | null,
    value: string | null,
    FileSpecs: FileSpecs | null,
}

type Props = {
    inputElement: InputElement | null,
    setInputElement: (value: InputElement | null) => void,
    open: boolean,
    setOpen: (value: boolean) => void,
}

export default function UpdateResponseFileModal({ inputElement, setInputElement, open, setOpen }: Props) {
    const [loading, setLoading] = React.useState(false);
    const [file, setFile] = React.useState<File | null>(null);
    const [fileProps, setFileProps] = React.useState<fileProps | null>(null);
    const toastedContext = useToastedContext();
    const [fileError, setFileError] = React.useState<string | undefined>(undefined);
    const [initialValues, setInitialValues] = React.useState<TemplateFileValues>({
        file: "",
    });

    const handleClose = () => {
        setOpen(false);
        setInputElement(null);
        setInitialValues({
            file: ""
        });
        setFileProps(null);
        setFile(null);
    };

    useEffect(() => {
        if (inputElement?.formResponseInputId && inputElement?.value) {
            const currentDomain = window.location.origin;
            const fileUrl = `${currentDomain}/${inputElement.value}`;
            const fileType = mime.extension(inputElement.FileSpecs?.fileType ?? inputElement.value.split('.').pop() ?? "");
            setFileProps({
                fileUrl: fileUrl,
                fileType: fileType || "",
            });
        }
    }, [inputElement]);

    const handleFileChange = (fileValues: File | null, setFieldValue: (fieldName: string, value: any) => void): void => {
        if (fileValues) {
            setFileError(undefined);
            if (fileValues.size > fileSizeLimit) {
                setFileError(`Le fichier est trop volumineux (${(fileValues.size/1024/1024).toFixed(2)}MB) - limite: ${(fileSizeLimit/1024/1024).toFixed(2)}MB`);
                return;
            }

            setFile(fileValues);
            const reader = new FileReader();

            reader.readAsDataURL(fileValues);
            reader.onloadend = () => {
                setFieldValue("file", reader.result)
            }
        } else {
            setFile(null);
            setFieldValue("file", null)
        }
    }

    const submitBtnClick = () => {
        const button = document.getElementById("sendTemplateFileButton");
        if (button) {
            button.click();
        }
    }

    const responseFileSubmit = async (values: TemplateFileValues) => {
        if (inputElement?.formResponseInputId && inputElement.formInputId && file) {
            setLoading(true);
            await toastedContext("patchFormResponse", {inputId: inputElement.formInputId, responseId: inputElement.formResponseId, value: values.file, file: file});
            setLoading(false)
            handleClose();
        } else if (file && inputElement?.formInputId) {
            setLoading(true);
            await toastedContext("addFormResponse", {formInputId: inputElement.formInputId, responseId: inputElement.formResponseId, value: values.file, file: file});
            setLoading(false)
            handleClose();
        }
    }

    return (
        <div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="update-form-dialog"
                open={open}
                maxWidth={"lg"}
                fullWidth={!!fileProps}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Modification de fichier
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} p={1} alignItems="center" justifyContent="center" alignContent={"center"}>
                        <Grid item xs={12}>
                            {fileProps ?
                                ["png", "jpg", "jpeg"].includes(fileProps.fileType) ? (
                                    <Image
                                        // url
                                        src={fileProps.fileUrl}
                                        alt={"file"}
                                        layout={"responsive"}
                                        objectFit={"contain"}
                                        width={600}
                                        height={600}
                                    />
                                ) : (
                                        <Box
                                            sx={{
                                                width: "100%",
                                                height: 600,
                                            }}
                                        >
                                            <iframe
                                                name="viewer"
                                                src={fileProps.fileUrl}
                                                width="100%"
                                                height="100%"
                                                style={{
                                                    border: 'none',
                                                }}
                                            ></iframe>
                                        </Box>
                                ) : (
                                    <Typography variant={"body1"} color={"error"}>
                                        Aucun fichier n'sest encore associé à cette réponse
                                    </Typography>
                                )
                            }
                        </Grid>
                        <Grid item xs={12} alignContent={"center"} justifyContent={"center"}>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={responseFileSubmit}
                            >
                                {({
                                    errors,
                                    touched,
                                    handleBlur,
                                    handleSubmit,
                                    setFieldValue
                                  }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Grid container spacing={2} p={1} alignItems="center" justifyContent="center">
                                            <Grid item xs={12} lg={12}>
                                                <MuiFileInput
                                                    color={"secondary"}
                                                    id="file"
                                                    fullWidth
                                                    name="file"
                                                    label={`Fichier`}
                                                    value={file}
                                                    onChange={(fileValues) => {
                                                        handleFileChange(fileValues, setFieldValue);
                                                    }}
                                                    onBlur={handleBlur}
                                                    error={touched.file && Boolean(errors.file)}
                                                    helperText={touched.file && errors.file}
                                                />
                                                {(fileError && !touched.file) && (
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
                        </Grid>
                    </Grid>
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