import React, {useEffect, useState} from 'react';
import {FormInputWithRelations} from "@/services/FormInputs/models/formInput.model";
import {
    TextField,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    FormControlLabel,
    Checkbox, FormGroup, Radio, RadioGroup, FormHelperText, Grid, Autocomplete, Chip, Rating,
} from "@mui/material";
import {MuiFileInput} from "mui-file-input";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import {InputOptionWithRelations} from "@/services/FormInputs/models/inputOption.model";
import {Star} from "@mui/icons-material";

type FileAnswer = {
    value: string | ArrayBuffer | null,
    fileName: string | undefined,
    type: string | undefined,
    size: number | undefined,
}

type Props = {
    formInput: FormInputWithRelations
    formProps: FormProps
}

type FormProps = {
    formType: "fillForm" | "inputCreation",
    name: string,
    value: any,
    label: string | null,
    onChange: (value: any, arg2?: any) => void,
    onBlur: (value: any) => void,
    setFieldValue?: (name: string, value: any) => void,
    error: boolean,
    helperText: string,
    disabled: boolean,
    color: "primary" | "secondary" | undefined,
    variant: "standard" | "filled" | "outlined" | undefined,
}

const TextInput = ({ formInput, formProps }: Props) => {
    const {setFieldValue, value, formType, ...rest} = formProps;

    return (
        <TextField
            {...rest}
            value={value || ""}
            fullWidth
            id={formInput.name + formInput.id}
        />
    )
}

const NumberInput = ({ formInput, formProps }: Props) => {
    const {setFieldValue, formType, ...rest} = formProps;

    return (
        <TextField
            id={formInput.name + formInput.id}
            {...rest}
            fullWidth
            type={"number"}
        />
    )
}

const DateInput = ({ formProps }: Props) => {
    const {onChange, setFieldValue, formType, onBlur, value, ...rest} = formProps;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                onChange={(date) => {
                    if (formProps.formType === "fillForm") onChange(date);
                    else {
                        onChange(date);
                        onBlur(date);
                    }
                }}
                value={dayjs(value || new Date())}
                slotProps={{
                    textField: {
                        ...rest,
                        fullWidth: true,
                        color: "secondary",
                    }
                }}
                format={"DD/MM/YYYY"}
            />
        </LocalizationProvider>
    )
}

const SelectInput = ({ formInput, formProps }: Props) => {
    const {error, setFieldValue, formType, helperText, onChange, onBlur, ...rest} = formProps;

    return (
        <FormControl
            color={"secondary"}
            fullWidth
            error={error || undefined}
        >
            <InputLabel>{formInput.label}</InputLabel>
            <Select
                id={formInput.name + formInput.id}
                fullWidth
                onChange={(event) => {
                    onChange(event);
                    if (formProps.formType !== "fillForm") onBlur(event);
                }}
                {...rest}
            >
                {formInput.InputOptions.sort(
                    (a: InputOptionWithRelations, b: InputOptionWithRelations) => (a.order > b.order) ? 1 : -1
                ).map((option: InputOptionWithRelations) => (
                    <MenuItem key={option.id} value={option.optionValue}>{option.optionName}</MenuItem>
                ))}
            </Select>
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    )
}

const FileInput = ({ formInput, formProps }: Props) => {
    const {onChange, setFieldValue, formType, value, ...rest} = formProps;
    const [file, setFile] = React.useState<File | null>(null);

    const handleChange = (file: File | null) => {
        if (!setFieldValue) return;
        setFile(file);
        if (!file) {
            setFieldValue(formProps.name, null);
            return;
        }
        const reader = new FileReader();
        const fileValues: FileAnswer = {
            value: null,
            fileName: file.name,
            type: file.type,
            size: file.size,
        }
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            fileValues.value = reader.result;
            setFieldValue(formProps.name, [
                fileValues
            ]);
        }
    }

    return (
        <MuiFileInput
            id={formInput.name + formInput.id}
            fullWidth
            onChange={handleChange}
            value={file}
            {...rest}
            inputProps={{
                accept: ".jpeg,jpg,.png,.pdf",
            }}
        />
    )
}

const CheckboxInput = ({ formInput, formProps }: Props) => {
    const {error, helperText, formType, setFieldValue, value, onChange, onBlur, ...rest} = formProps;

    return (
        <FormControl
            error={error || undefined}
            fullWidth
        >
            <FormGroup>
                <FormControlLabel control={
                    <Checkbox
                        id={formInput.name + formInput.id}
                        onChange={(event) => {
                            if (formType === "fillForm") onChange(event.target.checked || false);
                            else {
                                onChange(event.target.checked || false);
                                onBlur(event.target.checked || false);
                            }
                        }}
                        {...rest}
                        checked={value || false}
                    />
                } label={formInput.label}/>
            </FormGroup>
        </FormControl>
    )
}

const RadioInput = ({ formInput, formProps }: Props) => {
    const { error, helperText, formType, setFieldValue, onChange, onBlur, ...rest } = formProps;
    return (
        <FormControl
            error={error || undefined}
            fullWidth
            disabled={formProps.disabled}
        >
            <RadioGroup
                id={formInput.name + formInput.id}
                onChange={(event) => {
                    if (formType === "fillForm") onChange(event.target.value);
                    else {
                        onChange(event.target.value);
                        onBlur(event.target.value);
                    }
                }}
                {...rest}
            >
                <Grid container spacing={1} alignItems={"center"} justifyContent={"left"}>
                {formInput.InputOptions.length > 0
                    ? (
                        formInput.InputOptions.map((option: InputOptionWithRelations) => (
                            <Grid item xs={12} key={option.id}>
                                <FormControlLabel value={option.optionValue} control={<Radio />} label={option.optionName} />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <FormControlLabel value={""} control={<Radio />} label={"Aucune option disponible"} />
                        </Grid>
                    )
                }
                </Grid>
            </RadioGroup>
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    )
}

const AutocompleteInput = ({ formInput, formProps }: Props) => {
    const {setFieldValue, formType, onChange, onBlur, ...restProps} = formProps;
    const [autocompleteValue, setAutocompleteValue] = useState<InputOptionWithRelations | null>();

    useEffect(() => {
        if (!autocompleteValue) setAutocompleteValue(formProps.value)
    }, [formProps.value]);

    return (
        <Autocomplete
            id={formInput.name + formInput.id}
            value={autocompleteValue || null}
            options={formInput.InputOptions}
            isOptionEqualToValue={(option, value) => option.optionValue === value.optionValue}
            onChange={(event, value: InputOptionWithRelations | null) => {
                setAutocompleteValue(value);
                if (formType === "fillForm") onChange(value?.optionValue);
                else {
                    onChange(value?.optionValue);
                    onBlur(value?.optionValue);
                }
            }}
            fullWidth={true}
            color={"secondary"}
            filterSelectedOptions={true}
            disabled={formProps.disabled}
            renderInput={(params) => <TextField {...params} {...restProps}/>}
            renderOption={(optionProps: React.HTMLAttributes<HTMLLIElement>, option: InputOptionWithRelations) => {
                // @ts-ignore
                const {key, ...rest} = optionProps;

                return (
                    <li key={option.id} {...rest}>
                        <Typography variant={"body1"}>{option.optionName}</Typography>
                    </li>
                )
            }}
            getOptionLabel={(option) => option?.optionName}
        />
    )
}

const TagAutocompleteInput = ({ formInput, formProps }: Props) => {
    const {setFieldValue, formType, onChange, onBlur, value, ...restProps} = formProps;
    const [autocompleteValue, setAutocompleteValue] = useState<InputOptionWithRelations[]>();

    useEffect(() => {
        if (!autocompleteValue) setAutocompleteValue(formProps.value)
    }, [formProps.value]);

    return (
        <Autocomplete
            id={formInput.name + formInput.id}
            value={autocompleteValue || []}
            options={formInput.InputOptions}
            onChange={(event, value: InputOptionWithRelations[]) => {
                setAutocompleteValue(value);
                if (formType === "fillForm") {
                    onChange(value.map((option) => option.optionValue));
                } else {
                    onChange(value.map((option) => option.optionValue));
                    onBlur(value.map((option) => option.optionValue));
                }
            }}
            fullWidth={true}
            color={"secondary"}
            filterSelectedOptions={true}
            disabled={formProps.disabled}
            renderInput={(params) => <TextField {...params} {...restProps}/>}
            renderOption={(optionProps: React.HTMLAttributes<HTMLLIElement>, option) => {
                // @ts-ignore
                const {key, ...rest} = optionProps;

                return (
                    <li key={option.id} {...rest}>
                        <Typography variant={"body1"}>{option.optionName}</Typography>
                    </li>
                )
            }}
            renderTags={(value, getTagProps) => {
                return value.map((option, index) => {
                    const {key, ...rest} = getTagProps({index: index});

                    return (
                        <Chip
                            key={option.id}
                            variant="outlined"
                            label={option?.optionName}
                            {...rest}
                        />
                    )
                })
            }}
            multiple={true}
            onBlur={onBlur}
            getOptionLabel={(option) => option?.optionName}
            isOptionEqualToValue={(option, value) => option.optionValue === value.optionValue}
        />
    )
}

const TextAreaInput = ({ formInput, formProps }: Props) => {
    const {setFieldValue, formType, ...rest} = formProps;

    return (
        <TextField
            {...rest}
            fullWidth
            id={formInput.name + formInput.id}
            multiline
            rows={4}
        />
    )
}

const RatingInput = ({ formInput, formProps }: Props) => {
    const [ratingValue, setRatingValue] = useState<number | null>(null);
    const {
        setFieldValue,
        formType,
        value, helperText,
        label,
        onChange,
        onBlur,
        error,
        ...rest
    } = formProps;

    useEffect(() => {
        if (!ratingValue) setRatingValue(formProps.value)
    }, [formProps.value]);

    return (
        <FormControl
            fullWidth
        >
            <Rating
                {...rest}
                id={formInput.name + formInput.id}
                value={ratingValue || 0}
                onChange={(event, newValue) => {
                    setRatingValue(newValue);
                    if (formType === "fillForm") onChange(newValue);
                    else {
                        onChange(newValue);
                        onBlur(newValue);
                    }
                }}
                precision={0.5}
                emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
        </FormControl>
    )
}

export const DynamicFormInput = ({ formInput, formProps }: Props) => {
    switch (formInput.type) {
        case "text":
            return <TextInput formInput={formInput} formProps={formProps} />
        case "number":
            return <NumberInput formInput={formInput} formProps={formProps} />
        case "date":
            return <DateInput formInput={formInput} formProps={formProps} />
        case "select":
            return <SelectInput formInput={formInput} formProps={formProps} />
        case "file":
            return <FileInput formInput={formInput} formProps={formProps} />
        case "checkbox":
            return <CheckboxInput formInput={formInput} formProps={formProps} />
        case "radio":
            return <RadioInput formInput={formInput} formProps={formProps} />
        case "autocomplete":
            return <AutocompleteInput formInput={formInput} formProps={formProps} />
        case "tags":
            return <TagAutocompleteInput formInput={formInput} formProps={formProps} />
        case "textarea":
            return <TextAreaInput formInput={formInput} formProps={formProps} />
        case "rating":
            return <RatingInput formInput={formInput} formProps={formProps} />
        default:
            return <TextInput formInput={formInput} formProps={formProps} />
    }

}