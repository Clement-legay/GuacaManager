import React, {useContext, useEffect, useCallback, useState, ReactNode} from 'react';
import { Formik } from 'formik';
import {FormInputWithRelations} from "@/services/FormInputs/models/formInput.model";
import {CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {Check, Close, DeleteForeverOutlined} from "@mui/icons-material";
import * as Yup from "yup";
import {FileAssociationWithRelations} from "@/services/FormInputs/models/fileAssociation.model";
import {TemplateFileWithRelations} from "@/services/TemplateFile/models/templateFile.model";
import {LoadingDataInput} from "@/components/assets/inputs/LoadingDataInput";
import {MainContext} from "@/app/context/contextProvider";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {defaultError} from "@/app/context/config/toastMessages";
import * as mime from "mime-types";

type Props = {
    fileAssociation: FileAssociationWithRelations,
    index: number,
    formInput: FormInputWithRelations,
}

const validationSchema = Yup.object().shape({
    templateFileId: Yup.string().required(),
    value: Yup.string().required(),
});

export const FileAssociationForm = ({ fileAssociation, index, formInput}: Props) => {
    const [fileType, setFileType] = useState<string | false>("");
    const { templateFiles } = useContext(MainContext);
    const toastedContext = useToastedContext();
    const [inputStates, setInputStates] = useState<{[key: string]: "current" | "pending" | "updated" | "error"}>({
        templateFileId: "current",
        value: "current"
    });

    const getFiles = useCallback(async () => {
        await toastedContext("getTemplateFiles", undefined, defaultError)
    }, []);

    useEffect(() => {
        getFiles().then();
    }, [getFiles]);

    const endAdornment = function (inputField: string): ReactNode {
        if (inputStates[inputField] === "pending") return <CircularProgress size={20} sx={{color: "black"}}/>
        else if (inputStates[inputField] === "updated") return <Check color={"success"}/>
        else if (inputStates[inputField] === "error") return <Close color={"error"}/>
        else return null;
    }

    const updateFileAssociation = async (values: any) => {
        if (templateFiles) {
            const {name, value} = values.target;
            const fileAssociationField = name as keyof FileAssociationWithRelations;
            if (name === "templateFileId") {
                const templateFile: TemplateFileWithRelations | undefined = templateFiles.find((templateFile: TemplateFileWithRelations) => templateFile.id === value);
                if (templateFile) {
                    setFileType(mime.extension(templateFile.fileType));
                }
            }
            if (fileAssociation[fileAssociationField] !== value && value !== "") {
                if (formInput.FileAssociations.find((fileAssociation: FileAssociationWithRelations) => fileAssociation[fileAssociationField] === value)) {
                    setInputStates({
                        ...inputStates,
                        [name]: "error"
                    });
                    return;
                }
                await toastedContext("patchFileAssociation", {
                    formInputId: formInput.id,
                    fileAssociationId: fileAssociation.id,
                    field: name,
                    value: value
                });
                setInputStates({
                    ...inputStates,
                    [name]: "updated"
                });
            }
        }
    }

    const deleteAssociation = async () => {
       await toastedContext("deleteFileAssociation", {formInputId: formInput.id, fileAssociationId: fileAssociation.id});
    }

    return (
        <Formik
            key={fileAssociation.id}
            initialValues={fileAssociation}
            validationSchema={validationSchema}
            onSubmit={() => {
            }}
        >
            {({
                  values,
                  errors,
                  touched,
                  handleChange
              }) => (
                <form>
                    <Grid container spacing={2} px={4} mb={1} alignItems="center"
                          justifyContent="center">
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography variant="h6" sx={{
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                }}>
                                    association {index + 1}
                                </Typography>
                                <IconButton
                                    onClick={deleteAssociation}
                                    sx={{outline: "1px solid rgba(75,85,94,0.1)"}}
                                >
                                    <DeleteForeverOutlined/>
                                </IconButton>
                            </Box>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            {templateFiles ?
                                (
                                    <FormControl
                                        color={"secondary"}
                                        fullWidth
                                    >
                                        <InputLabel>{templateFiles.length === 0 ? "Aucun fichier" : "Fichier"}</InputLabel>
                                        <Select
                                            name={"templateFileId"}
                                            label={templateFiles.length === 0 ? "Aucun fichier" : "Fichier"}
                                            disabled={templateFiles.length === 0}
                                            value={values.templateFileId || ""}
                                            onChange={(values) => {
                                                handleChange(values);
                                                setInputStates({
                                                    ...inputStates,
                                                    templateFileId: "pending"
                                                })
                                                if (!touched.templateFileId && !errors.templateFileId) {
                                                    updateFileAssociation(values).catch()
                                                } else {
                                                    setInputStates({
                                                        ...inputStates,
                                                        templateFileId: "current"
                                                    })
                                                }
                                            }}
                                        >
                                            {templateFiles.map((templateFile: TemplateFileWithRelations) => (
                                                <MenuItem
                                                    key={templateFile.id}
                                                    value={templateFile.id}
                                                >
                                                    {templateFile.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <LoadingDataInput props={{
                                        fullWidth: true,
                                        label: "Fichier",
                                        placeholder: "Fichier",
                                    }}/>
                                )
                            }
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <TextField
                                color={"secondary"}
                                variant={"outlined"}
                                fullWidth
                                name="value"
                                label={`Value ${fileType ? `(${fileType})` : ""}`}
                                defaultValue={values.value || ""}
                                disabled={fileType === false}
                                onChange={(values) => {
                                    handleChange(values);
                                    setInputStates({
                                        ...inputStates,
                                        value: "pending"
                                    })
                                }}
                                onBlur={async (values) => {
                                    if (!touched.value && !errors.value) {
                                        await updateFileAssociation(values);
                                    } else {
                                        setInputStates({
                                            ...inputStates,
                                            value: "current"
                                        })
                                    }
                                }}
                                InputProps={{endAdornment: endAdornment("value")}}
                            />
                        </Grid>
                    </Grid>
                </form>
            )}
        </Formik>
    )
}