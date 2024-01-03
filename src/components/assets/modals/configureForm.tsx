import React, {Fragment, useContext} from 'react';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from "@mui/material/Typography";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {BootstrapDialog, BootstrapDialogTitle} from "@/styles/components/bootstrapDialog";
import {Autocomplete, Box, Checkbox, Chip, FormControl, FormControlLabel, FormGroup, TextField, Tooltip} from "@mui/material";
import {Formik} from "formik";
import {MainContext} from "@/app/context/contextProvider";
import * as Yup from "yup";
import {useRouter} from "next/navigation";
import {ContentCopy, Settings, Share} from "@mui/icons-material";
import {UpdateFormDto} from "@/services/Forms/models/form.update";
import IconButton from "@mui/material/IconButton";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Le titre est requis"),
    description: Yup.string(),
    alias: Yup.string().nullable().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "L'alias ne doit contenir que des lettres minuscules et des tirets"),
    isNotifying: Yup.boolean(),
    notificationEmails: Yup.array().of(Yup.string().email(({value}) => `${value} n'est pas un email valide`)),
    currentEmail: Yup.string().nullable().email("L'email n'est pas valide")
})

export default function ConfigureForm() {
    const [open, setOpen] = React.useState(false);
    const [tooltipState, setTooltipState] = React.useState(false);
    const { form } = useContext(MainContext)
    const toastedContext = useToastedContext();
    const router = useRouter();

    const handleButtonClick = () => {
        const submitButton = document.getElementById("sendConfigureForm");
        if (submitButton) submitButton.click();
    }

    const handleDuplication = async () => {
        if (!form) return;
        const result = await toastedContext("duplicateForm", {formId: form.id});
        if (result) {
            router.push("/formulaires/" + result);
        }
    }

    const handleSubmission = async (values: any) => {
        if (!form) return;
        const parsedValues: UpdateFormDto = {
            name: values.name,
            description: values.description !== "" ? values.description : null,
            alias: values.alias !== "" ? values.alias : null,
            isNotifying: values.isNotifying,
            notificationEmails: values.notificationEmails.join(";") !== "" ? values.notificationEmails.join(";") : null
        }
        const result = await toastedContext("updateForm", {formId: form.id, values: parsedValues});
        if (result) setOpen(false);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <Tooltip
                arrow
                title={"Paramètres le formulaire"}
            >
                <Button color={"secondary"} variant={"outlined"} sx={{mr: 1}} onClick={handleClickOpen}>
                    <Settings />
                </Button>
            </Tooltip>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="configure-form-dialog"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Configuration du formulaire
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    {form && (
                        <Formik
                            initialValues={{
                                name: form.name,
                                description: form.description ?? "",
                                alias: form.alias ?? "",
                                isNotifying: form.isNotifying,
                                notificationEmails: form.notificationEmails ? form.notificationEmails.split(";") : [],
                                currentEmail: ""
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmission}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                setFieldValue,
                                handleSubmit
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "left",
                                        px:2,
                                        py:1
                                    }}>
                                        <TextField
                                            label={"Titre"}
                                            fullWidth
                                            name={"name"}
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            color={"primary"}
                                            variant={"outlined"}
                                            error={!!errors.name && touched.name}
                                            helperText={errors.name && touched.name ? errors.name : ""}
                                        />
                                        <TextField
                                            sx={{mt: 2}}
                                            label={"Description"}
                                            multiline={true}
                                            rows={3}
                                            fullWidth
                                            name={"description"}
                                            value={values.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            color={"primary"}
                                            variant={"outlined"}
                                            error={!!errors.description && touched.description}
                                            helperText={errors.description && touched.description ? errors.description : ""}
                                        />
                                        <TextField
                                            sx={{mt: 2}}
                                            label={"Alias du formulaire"}
                                            fullWidth
                                            name={"alias"}
                                            value={values.alias}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            color={"primary"}
                                            variant={"outlined"}
                                            error={!!errors.alias && touched.alias}
                                            helperText={errors.alias && touched.alias ? errors.alias : ""}
                                        />
                                        <Typography variant={"caption"}>
                                            Remplir le champs ci-dessus pour personnaliser l'URL de votre formulaire
                                        </Typography>

                                        <Typography variant={"h6"} sx={{mt: 2}}>Notifications</Typography>
                                        <FormControl
                                            fullWidth
                                            size={"small"}
                                            variant={"filled"}
                                        >
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            name={"isNotifying"}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            checked={values.isNotifying}
                                                        />
                                                    } label={"Envoyer des notifications pour chaque soumission du formulaire"}/>
                                            </FormGroup>
                                        </FormControl>
                                        {values.isNotifying && (
                                            <Fragment>
                                                <Autocomplete
                                                    multiple
                                                    fullWidth
                                                    options={[]}
                                                    onChange={async (event, value) => {
                                                        if (!errors.currentEmail) {
                                                            await setFieldValue("notificationEmails", value)
                                                        }
                                                    }}
                                                    freeSolo={true}
                                                    value={values.notificationEmails}
                                                    renderTags={(value, getTagProps) => {
                                                        return value.map((option, index) => {
                                                            const {key, ...rest} = getTagProps({index: index});

                                                            return (
                                                                <Chip
                                                                    key={index}
                                                                    variant="outlined"
                                                                    label={option}
                                                                    {...rest}
                                                                />
                                                            )
                                                        })
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            name={"currentEmail"}
                                                            value={values.currentEmail}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            disabled={!values.isNotifying}
                                                            error={!!errors.currentEmail && touched.currentEmail}
                                                            helperText={errors.currentEmail && touched.currentEmail ? errors.currentEmail : ""}
                                                            label="Emails (appuyer sur entrée pour ajouter)"
                                                            placeholder="Emails"
                                                            variant={"outlined"}
                                                            sx={{mt: 1}}
                                                        />
                                                    )}
                                                />
                                                <Typography sx={{mb: 2}} variant={"caption"}>
                                                    Remplir le champs ci-dessus avec les emails des personnes à notifier
                                                </Typography>
                                            </Fragment>
                                        )}
                                        <Button id={"sendConfigureForm"} type={"submit"} style={{display: "none"}}/>
                                    </Box>
                                </form>
                            )}
                        </Formik>
                    )}
                </DialogContent>
                <DialogActions sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                        }}
                    >
                        <Tooltip
                            arrow
                            title={"Dupliquer le formulaire"}
                        >
                            <IconButton onClick={handleDuplication} color={"secondary"} >
                                <ContentCopy/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Button color={"secondary"} onClick={handleButtonClick}>
                        Enregistrer
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </Fragment>
    );
}