import React, {ReactNode} from 'react';
import { Formik } from 'formik';
import {FormInputWithRelations} from "@/services/FormInputs/models/formInput.model";
import {InputOptionWithRelations} from "@/services/FormInputs/models/inputOption.model";
import {CircularProgress, Grid, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {Check, Close, DeleteForeverOutlined} from "@mui/icons-material";
import * as Yup from "yup";
import {useToastedContext} from "@/app/context/config/toastedContext";

type Props = {
    inputOption: InputOptionWithRelations,
    index: number,
    formInput: FormInputWithRelations
}

const validationSchema = Yup.object().shape({
    optionName: Yup.string().required("Name is required"),
    optionValue: Yup.string().required("Value is required"),
});

export const InputOptionForm = ({ inputOption, index, formInput }: Props) => {
    const toastedContext = useToastedContext();
    const [inputStates, setInputStates] = React.useState<{[key: string]: "current" | "pending" | "updated" | "error"}>({
        optionName: "current",
        optionValue: "current"
    });

    const endAdornment = function (inputField: string): ReactNode {
        if (inputStates[inputField] === "pending") return <CircularProgress size={20} sx={{color: "black"}}/>
        else if (inputStates[inputField] === "updated") return <Check color={"success"}/>
        else if (inputStates[inputField] === "error") return <Close color={"error"}/>
        else return null;
    }

    const updateInputOption = async (values: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = values.target;
        const optionField = name as keyof InputOptionWithRelations;
        if (inputOption[optionField] !== value && value !== "") {
            if (formInput.InputOptions.find((inputOption: InputOptionWithRelations) => inputOption[optionField] === value)) {
                setInputStates({
                    ...inputStates,
                    [name]: "error"
                });
                return;
            }
            await toastedContext("patchInputOption", {formInputId: formInput.id, inputOptionId: inputOption.id, field: name, value: value});
            setInputStates({
                ...inputStates,
                [name]: "updated"
            });
        }
    }

    const deleteOption = async () => {
        await toastedContext("deleteInputOption", {formInputId: formInput.id, inputOptionId: inputOption.id});
    }

    return (
        <Formik
            key={inputOption.id}
            initialValues={inputOption}
            validationSchema={validationSchema}
            onSubmit={() => {}}
            enableReinitialize={true}
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
                                    option {index + 1}
                                </Typography>
                                <IconButton
                                    onClick={deleteOption}
                                    sx={{outline: "1px solid rgba(75,85,94,0.1)"}}
                                >
                                    <DeleteForeverOutlined/>
                                </IconButton>
                            </Box>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <TextField
                                color={"secondary"}
                                fullWidth
                                variant={"outlined"}
                                name="optionName"
                                label="Name"
                                defaultValue={values.optionName || ""}
                                onChange={() => {
                                    setInputStates({
                                        ...inputStates,
                                        optionName: "pending"
                                    })
                                    handleChange("optionName")
                                }}
                                onBlur={async (values) => {
                                    if (!touched.optionName && !errors.optionName) {
                                        await updateInputOption(values);
                                    } else {
                                        setInputStates({
                                            ...inputStates,
                                            optionName: "current"
                                        })
                                    }
                                }}
                                InputProps={{endAdornment: endAdornment("optionName")}}
                            />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <TextField
                                color={"secondary"}
                                variant={"outlined"}
                                fullWidth
                                name="optionValue"
                                defaultValue={values.optionValue || ""}
                                label="Value"
                                onChange={() => {
                                    setInputStates({
                                        ...inputStates,
                                        optionValue: "pending"
                                    })
                                    handleChange("optionValue")
                                }}
                                onBlur={async (values) => {
                                    if (!touched.optionValue && !errors.optionValue) {
                                        await updateInputOption(values);
                                    } else {
                                        setInputStates({
                                            ...inputStates,
                                            optionValue: "current"
                                        })
                                    }
                                }}
                                InputProps={{endAdornment: endAdornment("optionValue")}}
                            />
                        </Grid>
                    </Grid>
                </form>
            )}
        </Formik>
    )
}