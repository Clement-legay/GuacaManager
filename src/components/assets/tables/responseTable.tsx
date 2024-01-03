import React, {useContext, useEffect, useState} from 'react';
import {
    DataEditor,
    DataEditorProps,
    GridCell,
    GridCellKind,
    GridSelection,
    Item,
    TextCell
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import Box from "@mui/material/Box";
import {useExtraCells} from "@glideapps/glide-data-grid-cells";
import {Skeleton} from "@mui/material";
import {FormResponseInputWithRelations} from "@/services/FormResponses/models/formResponseInput.model";
import IconButton from "@mui/material/IconButton";
import {Search} from "@mui/icons-material";
import {MainContext} from "@/app/context/contextProvider";
import Button from "@mui/material/Button";
import UpdateResponseFileModal, {InputElement} from "@/components/assets/modals/update/updateResponseFileModal";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {InputTypeSpec, InputTypes, InputType} from "@/services/InputTypes";

export type responseColumns = {
    title: string,
    field: string | null,
    type: keyof InputTypeSpec,
    inputType: InputType,
    width: number,
    loading: number | null,
    options?: string[],
    multiple?: boolean,
    required?: boolean,
    conditional?: boolean,
}

const defaultProps: Partial<DataEditorProps> = {
    smoothScrollX: true,
    smoothScrollY: true,
    isDraggable: false,
    rowMarkers: "none",
    width: "100%",
    height: "80vh",
    rowHeight: 40,
    headerHeight: 40,
};

type Props = {
    isLoading: boolean,
}

export const ResponseTable = ({ isLoading }: Props) => {
    const cellProps = useExtraCells();
    const [columns, setColumns] = useState<responseColumns[]>([]);
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const { form } = useContext(MainContext);
    const [gridSelection, setGridSelection] = React.useState<GridSelection>();
    const [responsesSelected, setResponsesSelected] = useState<string[]>([]);
    const [fileInputSelected, setFileInputSelected] = useState<InputElement | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const toastedContext = useToastedContext();

    const handleSearchMove = () => {
        setShowSearch(showSearch => !showSearch);
    }

    const onRowAppended = (): void => {
        if (form) {
            toastedContext("addEmptyFormResponse", {formId: form.id}).then();
        }
    }

    const handleFileGeneration = async () => {
        if (responsesSelected?.length === 1 && form) {
            await toastedContext("generateResponseFiles", {formId: form.id, responseId: responsesSelected[0]})
        }
    }

    const handleResponseFileSelection = (formResponseId: string, formInputId: string, formResponseInput: FormResponseInputWithRelations | null) => {
        setFileInputSelected({
            formResponseId: formResponseId,
            formInputId: formInputId,
            formResponseInputId: formResponseInput?.id || null,
            value: formResponseInput?.value || null,
            FileSpecs: formResponseInput?.FileSpecs || null,
        });
        setOpen(true);
    }
    
    const handleResponseDeletion = async () => {
        if (responsesSelected?.length > 0 && form) {
            await toastedContext("deleteFormResponses", {formId: form.id, responseId: responsesSelected})
            setResponsesSelected([])
            setGridSelection(undefined)
        }
    }

    useEffect(() => {
        if (form) {
            const columns: responseColumns[] = [];
            for (const col of form.FormInputs) {
                let type = col.type as keyof InputTypeSpec;
                if (!InputTypes[type]) {
                    console.error("Unknown type: " + type);
                    type = "text";
                }

                columns.push({
                    title: col.name,
                    field: col.id,
                    type: type,
                    inputType: InputTypes[type],
                    width: col.name.length > 10 ? col.name.length * 12 : 120,
                    loading: null,
                    options: col.InputOptions ? col.InputOptions.map((opt) => opt.optionValue) : undefined,
                    multiple: col.isMultiple,
                    required: col.isRequired,
                    conditional: col.isConditional,
                })
            }
            setColumns([
                ...columns
            ]);
        }
    }, [form])

    const responseUpdate = async (cell: Item, value: any) => {
        const column = columns[cell[0]];
        const inputId = column.field;
        if (form && inputId) {
            const responseId = form.Responses[cell[1]].id;
            const formResponseInput: FormResponseInputWithRelations | undefined = form.Responses[cell[1]].FormResponseInputs.find((input) => input.formInputId === inputId);
            const valueParsed = column.inputType.parseToStringTable(value.data);
            if (!formResponseInput) {
                await toastedContext("addFormResponse", {formInputId: inputId, responseId: responseId, value: valueParsed, file: null})
            } else {
                await toastedContext("patchFormResponse", {inputId: inputId, responseId: responseId, value: valueParsed, file: null})
            }
        }
    }

    const getData = ([col, row]: Item): GridCell => {
        if (!form) return { kind: GridCellKind.Loading, allowOverlay: true };
        const column = columns[col];
        if (column.loading === row) {
            return {
                kind: GridCellKind.Custom,
                allowOverlay: true,
                copyData: "4",
                data: {
                    kind: "spinner-cell",
                }
            };
        }

        if (form.Responses[row]) {
            const responseInput = form.Responses[row].FormResponseInputs.find((responseInput) => responseInput.formInputId === columns[col].field);
            return column.inputType.responseTableDisplay(
                responseInput || null,
                column,
                () => handleResponseFileSelection(form.Responses[row].id, column.field || "", responseInput || null)
            );
        }
        return { kind: GridCellKind.Text, allowOverlay: true, data: "" } as TextCell;
    }

    return (
        <Box id={"portal"}>
            <UpdateResponseFileModal inputElement={fileInputSelected} setInputElement={setFileInputSelected} open={open} setOpen={setOpen} />
            <Button
                onClick={handleFileGeneration}
                variant={"contained"}
                disabled={responsesSelected?.length !== 1}
                sx={{m:1}}
            >
                Générer les fichiers
            </Button>
            <Button
                onClick={handleResponseDeletion}
                variant={"outlined"}
                disabled={responsesSelected?.length === 0}
                color={"warning"}
                sx={{m: 1}}
            >
                Supprimer
            </Button>
            {
                !isLoading && form?.Responses ?
                    (
                        <Box sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                        }}>
                            <DataEditor
                                {...cellProps}
                                {...defaultProps}
                                columns={columns}
                                rows={form.Responses.length}
                                getCellContent={getData}
                                getCellsForSelection={true}
                                theme={{
                                    accentColor: "rgb(161,153,192)",
                                    accentFg: "#AFA5D1",
                                    bgCellMedium: "#AFA5D1",
                                    accentLight: "rgba(175,165,209,0.3)",
                                }}
                                gridSelection={gridSelection}
                                onGridSelectionChange={(selection: GridSelection) => {
                                    if (form) {
                                        setGridSelection(selection)
                                        const rowsId = selection.rows.toArray();
                                        if (rowsId.length > 0) {
                                            setResponsesSelected(rowsId.map((id) => form.Responses[id].id))
                                        } else {
                                            setResponsesSelected([])
                                        }
                                    }
                                }}
                                rowSelect={"multi"}
                                rowMarkers={"both"}
                                onCellEdited={async (cell, newValue: any) => {
                                    columns[cell[0]].loading = cell[1]
                                    await responseUpdate(cell, newValue)
                                    columns[cell[0]].loading = null
                                }}
                                trailingRowOptions={{
                                    tint: true,
                                    hint: "Nouvelle entrée...",
                                }}
                                onRowAppended={onRowAppended}
                                showSearch={showSearch}
                                onSearchClose={handleSearchMove}
                            />
                            <Box id={"floatingSearch"} sx={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                width: 50,
                                height: 50,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 100,
                            }}>
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleSearchMove()
                                    }}
                                    color={"secondary"}
                                    sx={{
                                        backgroundColor: "#f5f5f5",
                                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                                        "&:hover": {
                                            backgroundColor: "#e0e0e0",
                                        },
                                    }}
                                >
                                    <Search />
                                </IconButton>
                            </Box>
                        </Box>
                    ) : (
                        <Box>
                            <Skeleton variant="rounded" width={"100%"} height={"80vh"} />
                        </Box>
                    )
            }
        </Box>
    )
}

