"use client"

import React, {useContext, useEffect, useCallback} from 'react';
import {Grid, Skeleton} from "@mui/material";
import Typography from "@mui/material/Typography";
import * as Yup from "yup";
import {FormInputWithRelations} from "@/services/FormInputs/models/formInput.model";
import Box from "@mui/material/Box";
import {Formik} from "formik";
import {DynamicFormInput} from "@/components/assets/inputs/dynamicFormInput";
import Image, {ImageLoaderProps} from "next/image";
import {LoadingButton} from "@mui/lab";
import {CreateFormResponseDto} from "@/services/FormResponses/models/formResponse.create";
import {CreateFormResponseInputDto} from "@/services/FormResponses/models/formResponseInput.create";
import {MainContext} from "@/app/context/contextProvider";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {InputTypes, InputTypeSpec} from "@/services/InputTypes";
import {defaultError} from "@/app/context/config/toastMessages";
import {Toaster} from "react-hot-toast";

type Props = {
    formId : string
}


export const FillForm = ({ formId }: Props) => {
    const [validationSchema, setValidationSchema] = React.useState<Yup.ObjectSchema<any> | null>(null);
    const [initialValues, setInitialValues] = React.useState<any>({});
    const [isLoading, setLoading] = React.useState(true);
    const [submitState, setSubmitState] = React.useState<"idle" | "loading" | "success" | "error">("idle");
    const { form } = useContext(MainContext);
    const toastedContext = useToastedContext();

    const callBackForm = useCallback(async (formId: string) => {
        await toastedContext("getForm", {formId}, defaultError);
    }, []);

    useEffect(() => {
        callBackForm(formId).then();
    }, [callBackForm, formId]);

    useEffect(() => {
        const initialValues: any = {};
        const responseValidationSchema = () => {
            const shape: any = {};
            if (form) {
                form.FormInputs.forEach((formInput: FormInputWithRelations) => {
                    const formInputName = `${formInput.name}_${formInput.order}`;

                    let type = formInput.type as keyof InputTypeSpec;
                    if (!InputTypes[type]) {
                        console.error("Unknown type: " + type);
                        type = "text";
                    }

                    const inputType = InputTypes[type];
                    shape[formInputName] = inputType.validationSchema();
                    initialValues[formInputName] = inputType.initializeValue(formInput.value, formInput.InputOptions);

                    if (formInput.isRequired) {
                        if (formInput.isConditional && formInput.ConditionalInput) {
                            shape[formInputName] = shape[formInputName].when(`${formInput.ConditionalInput.name}_${formInput.ConditionalInput.order}`, (conditionalInputValue: any, schema: any) => {
                                if (conditionalInputValue.includes(formInput.conditionalValue) || conditionalInputValue === formInput.conditionalValue) {
                                    return schema.required(`${formInput.name} est requis`);
                                }
                                return schema;
                            });
                        } else shape[formInputName] = shape[formInputName].required(`Le champ "${formInput.name}" est requis`);
                    }
                });
            }

            return Yup.object().shape(shape);
        }
        if (form !== undefined) {
            setLoading(false)
            setValidationSchema(responseValidationSchema);
            setInitialValues(initialValues);
        }
    }, [form]);

    const loaderProp = (test: ImageLoaderProps) => {
        return `${test.src}?w=${test.width}&q=75`;
    }

    const handleSubmit = async (values: any) => {
        setSubmitState("loading");
        const formResponse: CreateFormResponseDto = {
            formId: formId,
            formResponseInputs: []
        }
        Object.keys(values).forEach((key) => {
            const [name, order] = key.split("_");
            const formInput = form?.FormInputs.find((formInput: FormInputWithRelations) => formInput.name === name && formInput.order === parseInt(order));
            if (formInput && values[key] !== undefined && values[key] !== "" && values[key].length !== 0) {
                let type = formInput.type as keyof InputTypeSpec;
                if (!InputTypes[type]) {
                    console.error("Unknown type: " + type);
                    type = "text";
                }

                const inputType = InputTypes[type];

                const formResponseInput: CreateFormResponseInputDto = {
                    formInputId: formInput.id,
                    ...inputType.parseToSendForm(values[key])
                }
                formResponse.formResponseInputs.push(formResponseInput);
            }
        })

        const result = await toastedContext("sendFormResponse", {formId: formId, createFormResponse: formResponse}, defaultError);
        if (result) setSubmitState("success");
        else setSubmitState("error");
    }

    const parseDataFromField = (formInput: FormInputWithRelations, value: any, setFieldValue: (field: string, data: any) => void) => {
        const inputType = InputTypes[formInput.type as keyof InputTypeSpec];
        if (!inputType) return;

        const parsedValue = inputType.parseFromField(value);
        setFieldValue(`${formInput.name}_${formInput.order}`, parsedValue);
    }

    const handleCheckRender = (values: any, formInput: FormInputWithRelations): boolean => {
        if (formInput.isHidden) return false;
        if (formInput.isConditional && formInput.ConditionalInput) {
            const conditionalInputValue = values[`${formInput.ConditionalInput.name}_${formInput.ConditionalInput.order}`];
            const conditionalInput = InputTypes[formInput.ConditionalInput.type as keyof InputTypeSpec];
            if (!conditionalInput) return false;

            if (formInput.conditionalValue) {
                return conditionalInput.compareFromField(conditionalInputValue, formInput.conditionalValue);
            }
        }
        return true;
    }

    return (
        <Box>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
            }}>
                <Grid container spacing={2} justifyContent={"center"} alignItems={"center"}>
                    <Grid item xs={11} sm={9} md={6} lg={5} xl={4}>
                        <Typography
                            variant="h1"
                            color="initial"
                            sx={{
                                fontWeight: 600,
                                fontSize: "1.8rem",
                                mt: 3,
                                p: 1
                            }}
                        >
                            {isLoading ? <Skeleton variant="text" width={"100%"} height={50} /> : form && form.name}
                        </Typography>
                        <Typography variant={"body1"} sx={{
                            mb: 3,
                            p: 1
                        }}>
                            {isLoading ? <Skeleton variant="text" width={"100%"} height={50} /> : form && form.description}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                py: 3,
            }}>
                <Grid container spacing={2} justifyContent={"center"} alignItems={"center"}>
                    <Grid item xs={11} sm={9} md={6} lg={5} xl={4}>
                        {!isLoading && form && submitState !== "success" ? (
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize={true}
                            >
                                {({values, errors, setFieldValue, touched, handleBlur, handleSubmit}) => (
                                    <form onSubmit={handleSubmit}>
                                        {form?.FormInputs.map((formInput: FormInputWithRelations) =>
                                            handleCheckRender(values, formInput) && (
                                                    <Box
                                                        key={formInput.id}
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            justifyContent: "center",
                                                            alignItems: "flex-start",
                                                            borderRadius: "5px",
                                                            mb: 2,
                                                            p:1,
                                                            width: "100%",
                                                            minHeight: 120,
                                                        }}
                                                    >
                                                        <Typography variant={"h6"} sx={{
                                                            mb: 1,
                                                        }}>
                                                            {formInput.name}
                                                            {formInput.isRequired && (
                                                                <span style={{color: "red"}}> *</span>
                                                            )}
                                                        </Typography>
                                                        <DynamicFormInput
                                                            key={formInput.id}
                                                            formInput={formInput}
                                                            formProps={{
                                                                formType: "fillForm",
                                                                value: values[`${formInput.name}_${formInput.order}`] || "",
                                                                label: formInput.label,
                                                                name: `${formInput.name}_${formInput.order}`,
                                                                color: "secondary",
                                                                variant: "outlined",
                                                                onChange: (value: any) => parseDataFromField(formInput, value, setFieldValue),
                                                                onBlur: handleBlur,
                                                                error: Boolean(touched[`${formInput.name}_${formInput.order}`]) && Boolean(errors[`${formInput.name}_${formInput.order}`]),
                                                                helperText: (touched[`${formInput.name}_${formInput.order}`] && errors[`${formInput.name}_${formInput.order}`]) as string,
                                                                setFieldValue: setFieldValue,
                                                                disabled: submitState === "loading",
                                                            }}
                                                        />
                                                    </Box>
                                                )
                                            )
                                        }
                                        <Box sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}>
                                            <LoadingButton loading={submitState === "loading"} type="submit" variant="contained" color="primary">
                                                Envoyer
                                            </LoadingButton>
                                        </Box>
                                    </form>
                                )}
                            </Formik>
                            ) : isLoading ? (
                                <Box>
                                    <Skeleton variant="text" width={"100%"} height={50} />
                                    <Skeleton variant="rectangular" width={"100%"} height={120} />
                                    <Skeleton variant="text" width={"100%"} height={50} />
                                    <Skeleton variant="rectangular" width={"100%"} height={120} />
                                    <Skeleton variant="text" width={"100%"} height={50} />
                                    <Skeleton variant="rectangular" width={"100%"} height={120} />
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        mt: 2
                                    }}>
                                        <LoadingButton loading={isLoading} type="submit" variant="contained" color="primary">
                                            Envoyer
                                        </LoadingButton>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 300
                                }}>
                                    <Typography variant={"h6"} sx={{
                                        mb: 1,
                                    }}>
                                        Le formulaire a bien été envoyé !
                                    </Typography>
                                    <Typography variant={"body1"} sx={{
                                        mb: 1,
                                    }}>
                                        Vous pouvez fermer cette page.
                                    </Typography>
                                </Box>
                            )
                        }
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                my: 3,
            }}>
                <Image src={"/images/icon/favicon.png"} priority width={75} height={75} alt={"LOGO Cesi"} loader={loaderProp}/>
            </Box>
            <Toaster
                position="bottom-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 5000
                }}
            />
        </Box>
    )
}