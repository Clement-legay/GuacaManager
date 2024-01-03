"use client";

import React from 'react';
import {CircularProgress, TextField, TextFieldProps} from "@mui/material";

type Props = {
    props: TextFieldProps
}

export const LoadingDataInput = ({ props }: Props) => {
    return (
        <TextField
            {...props}
            disabled={true}
            InputProps={{
                endAdornment: <CircularProgress sx={{color: "black"}} size={20}/>
            }}
        />
    )
}