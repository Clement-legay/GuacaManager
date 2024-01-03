'use client';

import React, {createContext, useEffect, useState} from "react";
import {theme} from "@/styles/theme";
import {ThemeProvider} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import {FormEntity} from "@/app/context/entity/FormEntity";
import {FormWithRelations} from "@/services/Forms/models/form.model";
import {TemplateFileEntity} from "@/app/context/entity/TemplateFileEntity";
import {TemplateFileWithRelations} from "@/services/TemplateFile/models/templateFile.model";
import { useCookies } from "react-cookie";
import {CreateFormResponseDto} from "@/services/FormResponses/models/formResponse.create";
import {CreateFormDto} from "@/services/Forms/models/form.create";
import {UpdateFormDto} from "@/services/Forms/models/form.update";

const ThemeContext = createContext({})

export const MainContext = createContext({
    form: undefined as FormWithRelations | null | undefined,
    forms: undefined as FormWithRelations[] | null | undefined,

    templateFiles: undefined as TemplateFileWithRelations[] | null | undefined,

    getTemplateFiles: async (): Promise<any> => {},
    addTemplateFile: async (parameters: {values: any, file: File}): Promise<any> => {},
    updateTemplateFile: async (parameters: {templateFileId: string, templateFile: string, file: File}): Promise<any> => {},
    patchTemplateFile: async (parameters: {templateFileId: string, field: string, value: string}): Promise<any> => {},
    deleteTemplateFile: async (parameters: {templateFileId: string}): Promise<any> => {},

    getForms: async (): Promise<any> => {},
    getForm: async (parameters: {formId: string}): Promise<any> => {},
    publishForm: async (parameters: {formId: string}): Promise<any> => {},
    addForm: async (parameters: {values: CreateFormDto}): Promise<any> => {},
    duplicateForm: async (parameters: {formId: string}): Promise<any> => {},
    updateForm: async (parameters: {formId: string, values: UpdateFormDto}): Promise<any> => {},
    patchForm: async (parameters: {formId: string, field: string, value: any}): Promise<any> => {},
    deleteForm: async (parameters: {formId: string}): Promise<any> => {},

    addInput: async (parameters: {formId: string, option: "default" | null}): Promise<any> => {},
    patchInput: async (parameters: {inputId: string, field: string, value: any}): Promise<any> => {},
    deleteInput: async (parameters: {inputId: string}): Promise<any> => {},
    moveInput: async (parameters: {inputId: string, direction: "up" | "down"}): Promise<any> => {},

    addFileAssociation: async (parameters: {inputId: string, option: "default" | null}): Promise<any> => {},
    patchFileAssociation: async (parameters: {formInputId: string, fileAssociationId: string, field: string, value: string}): Promise<any> => {},
    deleteFileAssociation: async (parameters: {formInputId: string, fileAssociationId: string}): Promise<any> => {},

    addInputOption: async (parameters: {inputId: string, option: "default" | null}): Promise<any> => {},
    patchInputOption: async (parameters: {formInputId: string, inputOptionId: string, field: string, value: string}): Promise<any> => {},
    deleteInputOption: async (parameters: {formInputId: string, inputOptionId: string}): Promise<any> => {},

    sendFormResponse: async (parameters: {formId: string, createFormResponse: CreateFormResponseDto}): Promise<any> => {},
    generateResponseFiles: async (parameters: {formId: string, responseId: string}): Promise<any> => {},

    getFormWithResponses: async (parameters: {formId: string}): Promise<any> => {},
    getIntOfFormResponses: async (parameters: {formId: string}): Promise<any> => {},
    addFormResponse: async (parameters: {formInputId: string, responseId: string, value: string, file: File | null}): Promise<any> => {},
    addEmptyFormResponse: async (parameters: {formId: string}): Promise<any> => {},
    patchFormResponse: async (parameters: {inputId: string, responseId: string, value: string, file: File | null}): Promise<any> => {},
    deleteFormResponses: async (parameters: {formId: string, responseId: string[]}): Promise<any> => {},

    darkMode: false,
    setDarkMode: (darkMode: boolean) => {},
    sideBarOpen: undefined as boolean | undefined,
    setSideBarOpen: (sideBarOpen: boolean | undefined) => {},
    setSideBarState: (sideBarOpen: boolean) => {},
});

export const ContextProvider = ({ children }: { children: React.ReactNode}) => {
    const [darkMode, setDarkMode] = useState(false);
    const [sideBarOpen, setSideBarOpen] = useState<boolean | undefined>();
    const [themeColors, setThemeColors] = useState(theme(darkMode));
    const [cookies, setCookie] = useCookies(["sideBarState"]);

    useEffect(() => {
        setThemeColors(theme(darkMode));
    }, [darkMode]);

    useEffect(() => {
        if (sideBarOpen === undefined) {
            setSideBarOpen(cookies.sideBarState === "true");
        }
    }, []);

    const setSideBarState = (sideBarOpen: boolean) => {
        setCookie("sideBarState", sideBarOpen.toString(), { path: "/" });
        setSideBarOpen(sideBarOpen);
    }

    const state = {
        ...TemplateFileEntity(),
        ...FormEntity(),
        setSideBarState,
        darkMode, setDarkMode,
        sideBarOpen, setSideBarOpen,
    };


    return (
        <MainContext.Provider value={state}>
            <ThemeProvider theme={themeColors}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </MainContext.Provider>
    )
};