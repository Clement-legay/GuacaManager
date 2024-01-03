import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField, Tooltip
} from "@mui/material";
import { FormInputWithRelations } from "@/services/FormInputs/models/formInput.model";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {ArrowCircleDownOutlined, ArrowCircleUpOutlined, DeleteForeverOutlined} from "@mui/icons-material";
import {Formik} from "formik";
import React, {Dispatch, Fragment, SetStateAction, useContext, useEffect, useState} from "react";
import * as Yup from "yup";
import CreateInputOptions from "@/components/assets/modals/create/createInputOptions";
import CreateFileAssociations from "@/components/assets/modals/create/createFileAssociations";
import {MainContext} from "@/app/context/contextProvider";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {InputType, InputTypes, InputTypeSpec} from "@/services/InputTypes";
import {DynamicFormInput} from "@/components/assets/inputs/dynamicFormInput";
import {LoadingDataInput} from "@/components/assets/inputs/LoadingDataInput";

type Props = {
    input: FormInputWithRelations,
    setFocus: Dispatch<SetStateAction<string | null>>
}

const inputOptionValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    value: Yup.string().required("Value is required"),
    order: Yup.number().required("Order is required"),
});

const fileAssociationValidationSchema = Yup.object().shape({
    templateFileId: Yup.string().required("Template file is required"),
    value: Yup.string().required("Value is required"),
});

const formInputValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    label: Yup.string().required("Label is required"),
    type: Yup.string().required("Type is required"),
    order: Yup.number().required("Order is required"),
    isRequired: Yup.boolean().required("Required is required"),
    isMultiple: Yup.boolean().required("Multiple is required"),
    isHidden: Yup.boolean().required("Hidden is required"),
    inputOptions: Yup.array().of(inputOptionValidationSchema),
    fileAssociations: Yup.array().of(fileAssociationValidationSchema),
    isConditional: Yup.boolean().required("Conditional is required"),
    conditionalInputId: Yup.string().when("isConditional", (isConditional: any, schema: any) => {
        return isConditional ? schema.required("Conditional Input Id is required") : schema;
    }),
});

export const InputCreationForm = ({ input, setFocus }: Props) => {
    const {form} = useContext(MainContext);
    const [inputType, setInputType] = useState<InputType>();
    const [conditionalInputType, setConditionalInputType] = useState<InputType>();
    const [defaultValue, setDefaultValue] = useState<any | null>(undefined);
    const [conditionalValue, setConditionalValue] = useState<any | null>(undefined);
    const toastedContext = useToastedContext();

    useEffect(() => {
        let type = input.type as keyof InputTypeSpec;
        if (!InputTypes[type]) {
            console.error("Unknown type: " + type);
            type = "text";
        }
        setInputType(InputTypes[type]);
    }, [input.type]);

    useEffect(() => {
        if (!input.ConditionalInput) return;
        let type = input.ConditionalInput.type as keyof InputTypeSpec;
        if (!InputTypes[type]) {
            console.error("Unknown type: " + type);
            type = "text";
        }
        setConditionalInputType(InputTypes[type]);
    }, [input.ConditionalInput]);

    useEffect(() => {
        if (inputType?.props.canHaveDefault) {
            setDefaultValue(inputType.initializeValue(input.value, input.InputOptions));
        } else setDefaultValue(null)
    }, [inputType]);

    useEffect(() => {
        if (conditionalInputType?.props.canHaveDefault) {
            setConditionalValue(conditionalInputType.initializeValue(input.conditionalValue, input.ConditionalInput?.InputOptions));
        } else setConditionalValue(null);
    }, [conditionalInputType]);

    const handleUpdate = async (values: any) => {
        const inputName = values.target.name as keyof FormInputWithRelations;
        const value = values.target.type === "checkbox" ? values.target.checked : values.target.value;
        if (input[inputName] !== value) {
            if (inputName === "type") {
                setDefaultValue(null)
            }
            await toastedContext("patchInput", {inputId: input.id, field: inputName as string, value: value});
        }
    }

    const handleDynamicUpdate = async (value: any, inputName: keyof FormInputWithRelations)=> {
        let valueParsed;
        if (inputName === "conditionalValue") {
            if (!conditionalInputType) return;
            valueParsed = conditionalInputType.parseToSendForm(value);
        } else {
            if (!inputType) return;
            valueParsed = inputType.parseToSendForm(value);
        }

        if (input[inputName] !== value) {
            await toastedContext("patchInput", {inputId: input.id, field: inputName as string, value: valueParsed?.value});
        }
    }

    const handleDelete = async () => {
        await toastedContext("deleteInput", {inputId: input.id});
    }

    const handleMove = async (direction: "up" | "down") => {
        await toastedContext("moveInput", {inputId: input.id, direction: direction})
    }

    return (
        <Box sx={{
            width: "100%",
            outline: "1px solid rgba(75,85,94,0.1)",
            borderRadius: "5px",
            px: 4,
            py: 2,
            position: "relative",
        }}>
            <Formik
                initialValues={input}
                validationSchema={formInputValidationSchema}
                onSubmit={() => {}}
            >
                {({values, handleChange}) => (
                    <form>
                        <Grid container spacing={2} justifyContent={"left"} py={1} alignContent={"center"} alignItems={"center"}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label={"Titre"}
                                    name={"name"}
                                    color={"secondary"}
                                    value={values.name || ""}
                                    variant={"outlined"}
                                    onChange={handleChange}
                                    onBlur={handleUpdate}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label={"Placeholder"}
                                    name={"label"}
                                    color={"secondary"}
                                    value={values.label || ""}
                                    variant={"outlined"}
                                    onChange={handleChange}
                                    disabled={!inputType?.props.canHaveLabel}
                                    onBlur={handleUpdate}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl
                                    color={"secondary"}
                                    fullWidth
                                >
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        fullWidth
                                        label={"Type"}
                                        name={"type"}
                                        value={values.type || ""}
                                        disabled={form?.status === "published"}
                                        variant={"outlined"}
                                        onChange={async (values) => {
                                            handleChange(values);
                                            await handleUpdate(values);
                                        }}
                                    >
                                        {Object.entries(InputTypes).map(([key, inputType], index) => (
                                            <MenuItem key={index} value={key}>{inputType.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {defaultValue !== undefined ? (
                                    <DynamicFormInput formInput={input} formProps={{
                                        formType: "inputCreation",
                                        label: `Valeur ${!inputType?.props.canHaveDefault ? `(Pas de valeur par défaut pour les champs de type: ${inputType?.name})` : ""}`,
                                        name: "value",
                                        color: "secondary",
                                        value: defaultValue || "",
                                        variant: "outlined",
                                        onChange: (valuesGiven: any) => {
                                            if (inputType) {
                                                console.log(valuesGiven)
                                                setDefaultValue(inputType.parseFromField(valuesGiven));
                                            }
                                        },
                                        disabled: !inputType?.props.canHaveDefault,
                                        onBlur: async (valuesGiven: any) => {
                                            if (inputType) {
                                                await handleDynamicUpdate(inputType.parseFromField(valuesGiven), "value");
                                            }
                                        },
                                        error: false,
                                        helperText: "",
                                    }}/>
                                ) : (
                                    <LoadingDataInput props={{
                                        fullWidth: true,
                                        label: "Valeur",
                                        value: "",
                                        color: "secondary",
                                        variant: "outlined",
                                        disabled: true,
                                    }}/>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormGroup>
                                    <FormControlLabel control={
                                        <Checkbox
                                            checked={values.isRequired}
                                            onChange={async (values) => {
                                                handleChange(values);
                                                await handleUpdate(values);
                                            }}
                                            name={"isRequired"}
                                            disabled={values.isHidden}
                                        />
                                    } label="Requis"/>
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormGroup>
                                    <FormControlLabel control={
                                        <Checkbox checked={values.isConditional}
                                                  onChange={async (values) => {
                                                      handleChange(values);
                                                      await handleUpdate(values);
                                                  }}
                                                  name={"isConditional"}
                                                  disabled={form?.FormInputs.length === 1}
                                        />
                                    } label="Conditionné"/>
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormGroup>
                                    <FormControlLabel control={
                                        <Checkbox checked={values.isHidden}
                                                  onChange={async (values) => {
                                                      handleChange(values);
                                                      await handleUpdate(values);
                                                  }}
                                                  name={"isHidden"}
                                                  disabled={values.isRequired}
                                        />
                                    } label="Caché"/>
                                </FormGroup>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justifyContent={"center"} pt={1} alignContent={"center"} alignItems={"center"}>
                            {values.isConditional && (
                                <Grid item xs={12} md={6}>
                                    <FormControl
                                        color={"secondary"}
                                        fullWidth
                                    >
                                        <InputLabel>Champ conditionnel</InputLabel>
                                        <Select
                                            name={"conditionalInputId"}
                                            label={"Champ conditionnel"}
                                            value={values.conditionalInputId || ""}
                                            onChange={async (values) => {
                                                handleChange(values);
                                                await handleUpdate(values);
                                            }}
                                        >
                                            {form?.FormInputs.filter((formInput: FormInputWithRelations) => {
                                                return formInput.id !== input.id;
                                            }).map((formInput: FormInputWithRelations) => (
                                                <MenuItem key={formInput.id}
                                                          value={formInput.id}>{formInput.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}
                            {values.isConditional && (
                                <Grid item xs={12} md={6}>
                                    {(conditionalValue !== undefined && conditionalInputType && input.ConditionalInput) ? (
                                        <DynamicFormInput formInput={input.ConditionalInput} formProps={{
                                            formType: "inputCreation",
                                            label: `Valeur conditionnelle ${!conditionalInputType?.props.canHaveDefault ? `(Aucune condition sur les champs de type: ${conditionalInputType?.name})` : ""}`,
                                            name: "conditionalValue",
                                            color: "secondary",
                                            value: conditionalValue || "",
                                            variant: "outlined",
                                            disabled: !conditionalInputType?.props.canHaveDefault,
                                            onChange: (valuesGiven: any) => {
                                                if (conditionalInputType) {
                                                    setConditionalValue(conditionalInputType.parseFromField(valuesGiven));
                                                }
                                            },
                                            onBlur: async (valuesGiven: any) => {
                                                if (conditionalInputType) {
                                                    await handleDynamicUpdate(conditionalInputType.parseFromField(valuesGiven), "conditionalValue");
                                                }
                                            },
                                            error: false,
                                            helperText: "",
                                        }}/>
                                    ) : (
                                        <LoadingDataInput props={{
                                            fullWidth: true,
                                            label: "Valeur",
                                            value: "",
                                            color: "secondary",
                                            variant: "outlined",
                                            disabled: true,
                                        }}/>
                                    )}
                                </Grid>
                            )}
                        </Grid>
                    </form>
                )}
            </Formik>
            <Box sx={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                height: "100%",
                top: 0,
                right: -50,
                width: 50,
            }}>
                <Tooltip
                    arrow
                    title={"Fermer la fenêtre de modification"}
                >
                    <IconButton
                        onClick={() => setFocus("")}
                        sx={{outline: "1px solid rgba(75,85,94,0.1)", mb: 1}}
                    >
                        <CloseIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip
                    arrow
                    title={"Supprimer le champ"}
                >
                    <Fragment>
                        <IconButton
                            disabled={form?.status === "published"}
                            onClick={handleDelete}
                            sx={{outline: "1px solid rgba(75,85,94,0.1)", mb: 1}}
                        >
                            <DeleteForeverOutlined/>
                        </IconButton>
                    </Fragment>
                </Tooltip>
                <CreateFileAssociations formInput={input}/>
                <CreateInputOptions disabled={!inputType?.props.canHaveOptions || form?.status === "published"} formInput={input}/>
                <Tooltip
                    arrow
                    title={"Déplacer vers le haut"}
                >
                    <Box>
                        <IconButton
                            onClick={() => handleMove("up")}
                            sx={{outline: "1px solid rgba(75,85,94,0.1)", mb: 1}}
                            disabled={input.order === 1}
                        >
                            <ArrowCircleUpOutlined/>
                        </IconButton>
                    </Box>
                </Tooltip>
                <Tooltip
                    arrow
                    title={"Déplacer vers le bas"}
                >
                    <Box>
                        <IconButton
                            onClick={() => handleMove("down")}
                            sx={{outline: "1px solid rgba(75,85,94,0.1)", mb: 1}}
                            disabled={input.order === form?.FormInputs.length}
                        >
                            <ArrowCircleDownOutlined/>
                        </IconButton>
                    </Box>
                </Tooltip>
            </Box>
        </Box>
    )
}