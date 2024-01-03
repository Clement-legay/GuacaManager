import React, {useContext, Fragment} from "react";
import {Grid, Box, Skeleton, Button} from "@mui/material";
import { FormInputWithRelations } from "@/services/FormInputs/models/formInput.model";
import Typography from "@mui/material/Typography";
import {InputCreationForm} from "@/components/assets/inputCreationForm";
import {DynamicFormInput} from "@/components/assets/inputs/dynamicFormInput";
import {MainContext} from "@/app/context/contextProvider";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {InputTypeSpec, InputTypes} from "@/services/InputTypes";

type Props = {
    isLoading: boolean;
}

export const FormManageInputs = ({ isLoading }: Props) => {
    const [focus, setFocus] = React.useState<string | null>(null);
    const {form} = useContext(MainContext);
    const toastedContext = useToastedContext();

    const handleAddInput = async () => {
        if (form) {
            const newInput = await toastedContext("addInput", {formId: form.id, option: "default"});
            if (newInput) setFocus(newInput);
        }
    }

    const parseDefaultValue = (formInput: FormInputWithRelations) => {
        const fieldType = formInput.type as keyof InputTypeSpec;
        const inputType = InputTypes[fieldType];
        if (inputType) {
            if (inputType) {
                return inputType.initializeValue(formInput.value, formInput?.InputOptions);
            }
        }
    }

    return (
        <Grid container spacing={2} justifyContent={"center"}>
            <Grid item xs={10} sm={10} md={8} lg={6} xl={5}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    {form &&
                        !isLoading ?
                            form.status === "published" ? (
                                <Fragment>
                                    <Typography variant={"h5"} >{form?.name ?? ""}</Typography>
                                    <Typography variant={"subtitle1"} sx={{mb:3}}>
                                        Ce formulaire a été publié, vous ne pouvez donc plus le modifier intégralement
                                    </Typography>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <Typography variant={"h5"} >{form?.name ?? ""}</Typography>
                                    <Typography variant={"subtitle1"} sx={{mb:3}}>
                                        {form.FormInputs.length !== 0 ? "Cliquez sur un champ pour le modifier" : "Aucun champ pour le moment"}
                                    </Typography>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <Skeleton variant={"text"} width={"60%"} height={50}/>
                                    <Skeleton variant={"text"} width={"80%"} height={50} />
                                </Fragment>
                            )
                    }
                    {(!isLoading && form) ? form.FormInputs.length !== 0 ? form.FormInputs.sort(
                        (a: FormInputWithRelations, b: FormInputWithRelations) => a.order - b.order
                    ).map((formInput: FormInputWithRelations) =>
                        focus === formInput.id ? (
                            <InputCreationForm
                                key={formInput.id}
                                input={formInput}
                                setFocus={setFocus}
                            />
                        ) : (
                            <Box
                                key={formInput.id}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "flex-start",
                                    borderRadius: "5px",
                                    px: 5,
                                    my: 1,
                                    width: "100%",
                                    py: 2,
                                    ":hover": {
                                        cursor: "pointer",
                                        outline: '1px solid #AFA5D1',
                                    }
                                }}
                                onClick={() => setFocus(formInput.id)}
                            >
                                <Typography variant={"h6"} sx={{mb: 1}}>
                                    {formInput.name}
                                    {formInput.isRequired && (
                                        <span style={{color: "red"}}> *</span>
                                    )}
                                </Typography>
                                <DynamicFormInput
                                    formInput={formInput}
                                    formProps={{
                                        formType: "inputCreation",
                                        disabled: true,
                                        value: parseDefaultValue(formInput),
                                        name: formInput.name,
                                        label: formInput.label,
                                        onChange: () => {},
                                        onBlur: () => {},
                                        error: false,
                                        helperText: "",
                                        color: "primary",
                                        variant: "outlined",
                                    }}
                                />
                            </Box>
                        )) : (
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                outline: '1px solid rgba(75,85,94,0.1)',
                                borderRadius: "5px",
                                width: "100%",
                                height: 200,
                                mt: 4,
                            }}>
                                <Typography variant={"h6"}>Aucun champ existant</Typography>
                                <Typography variant={"body1"}>Créez le premier champ de votre formulaire</Typography>
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    sx={{mt: 2}}
                                    onClick={handleAddInput}
                                >Créer</Button>
                            </Box>
                        ) : (
                            <div style={{width: "100%"}}>
                                <Skeleton width={"100%"} height={120} variant={"rectangular"} sx={{mb: 2}}/>
                                <Skeleton width={"100%"} height={120} variant={"rectangular"} sx={{mb: 2}}/>
                                <Skeleton width={"100%"} height={120} variant={"rectangular"} sx={{mb: 2}}/>
                            </div>
                        )
                    }
                </Box>
            </Grid>
            {(form && form.FormInputs.length !== 0 && form.status !== "published") && (
                <Grid item xs={12}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            sx={{mt: 2, mb:8}}
                            onClick={handleAddInput}
                        >Ajouter</Button>
                    </Box>
                </Grid>
            )}
        </Grid>
    )
}