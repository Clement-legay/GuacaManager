import React, {Dispatch, SetStateAction, useContext} from 'react';
import {DataEditor, DataEditorProps, GridCell, GridCellKind, GridSelection, Item} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import { TemplateFileWithRelations } from "@/services/TemplateFile/models/templateFile.model";
import Box from "@mui/material/Box";
import {useExtraCells} from "@glideapps/glide-data-grid-cells";
import {Skeleton} from "@mui/material";
import * as mime from "mime-types";
import {MainContext} from "@/app/context/contextProvider";
import { useToastedContext } from "@/app/context/config/toastedContext";

type columns = {
    title: string,
    field: string | null,
    width: number,
    loading: number | null,
}

const columns: columns[] = [
    { title: "Titre", field: "name", width: 200, loading: null },
    { title: "Description", field: "description", width: 250, loading: null },
    { title: "Taille", field: "size", width: 150, loading: null },
    { title: "Fichier", field: null, width: 120, loading: null },
    { title: "Type", field: "fileType", width: 70, loading: null },
    { title: "Associations", field: null, width: 150, loading: null },
    { title: "Dernière Màj", field: null, width: 120, loading: null },
];

const defaultProps: Partial<DataEditorProps> = {
    smoothScrollX: true,
    smoothScrollY: true,
    isDraggable: false,
    rowMarkers: "none",
    width: "100%",
    height: "80vh",
    rowHeight: 50,
    headerHeight: 50,
};

type Props = {
    isLoading: boolean,
    setFileSelected: Dispatch<SetStateAction<TemplateFileWithRelations | null>>
    gridSelection: {
        gridSelection: GridSelection | undefined,
        setGridSelection: Dispatch<SetStateAction<GridSelection | undefined>>
    }
}

export const TemplateFileTable = ({ setFileSelected, isLoading, gridSelection }: Props) => {
    const cellProps = useExtraCells();
    const {templateFiles} = useContext(MainContext);
    const toastedContext = useToastedContext();

    const templateFileUpdate = async (cell: Item, value: any) => {
        if (templateFiles) {
            const colName = columns[cell[0]].field;
            if (!colName) return;
            const templateFile = templateFiles[cell[1]];
            await toastedContext("patchTemplateFile", {templateFileId: templateFile.id, field: colName, value: value})
        }
    }

    const getData = ([col, row]: Item): GridCell => {
        if (!templateFiles) return { kind: GridCellKind.Loading, allowOverlay: true };
        const value: TemplateFileWithRelations = templateFiles[row];

        if (columns[col].loading === row) {
            return {
                kind: GridCellKind.Custom,
                allowOverlay: true,
                copyData: "4",
                data: {
                    kind: "spinner-cell",
                }
            };
        }

        if (col === 0) {
            return {
                kind: GridCellKind.Text,
                data: value.name,
                allowOverlay: true,
                displayData: value.name,
            }
        } else if (col === 1) {
            return {
                kind: GridCellKind.Text,
                data: value.description,
                allowOverlay: true,
                displayData: value.description.length > 30
                    ? value.description.slice(0, 30) + "..."
                    : value.description.slice(0, 30),
            }
        } else if (col === 2) {
            return {
                kind: GridCellKind.Text,
                data: value.size.toString(),
                readonly: true,
                allowOverlay: false,
                displayData: `${(value.size / 1000).toFixed(2)} ko`,
            }
        } else if (col === 3) {
            return {
                kind: GridCellKind.Custom,
                allowOverlay: true,
                copyData: "4",
                data: {
                    kind: "button-cell",
                    backgroundColor: ["transparent", "#AFA5D1"],
                    color: ["#637381", "#000"],
                    borderColor: "#AFA5D1",
                    borderRadius: 9,
                    title: "Voir",
                    onClick: () => {
                        window.open(value.path, "_blank");
                    }
                }
            }
        } else if (col === 4) {
            return {
                kind: GridCellKind.Image,
                data: [
                    mime.extension(value.fileType)
                        ? mime.extensions[value.fileType][0] === "docx" ? "/images/fileTypesIcons/file-word.svg" : "/images/fileTypesIcons/file-excel.svg"
                        : "/images/fileTypesIcons/file-excel.svg"
                ],
                contentAlign: "center",
                allowOverlay: false,
                allowAdd: false,
            }
        } else if (col === 5) {
            return {
                kind: GridCellKind.Text,
                data: value.FileAssociations?.length.toString(),
                readonly: true,
                allowOverlay: false,
                displayData: value.FileAssociations
                    ? `${value.FileAssociations?.length} association(s)`
                    : "0 association",
            }
        } else if (col === 6) {
            return {
                kind: GridCellKind.Text,
                allowOverlay: true,
                data: value.updatedAt.toString(),
                readonly: true,
                displayData: new Date(value.updatedAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            }
        } else {
            throw new Error("Unknown column");
        }
    }

    return (
        <Box id={"portal"}>
            {
                !isLoading && templateFiles ?
                    (
                        <DataEditor
                            {...cellProps}
                            {...defaultProps}
                            columns={columns}
                            theme={{
                                accentColor: "rgb(161,153,192)",
                                accentFg: "#AFA5D1",
                                bgCellMedium: "#AFA5D1",
                                accentLight: "rgba(175,165,209,0.3)",
                            }}
                            rowSelect={"single"}
                            gridSelection={gridSelection.gridSelection}
                            onGridSelectionChange={(selection: GridSelection) => {
                                gridSelection.setGridSelection(selection)
                                const rowId = selection.rows.first()
                                setFileSelected(rowId !== undefined ? templateFiles[rowId] : null)
                            }}
                            rowMarkers={"both"}
                            rows={templateFiles.length}
                            getCellContent={getData}
                            getCellsForSelection={true}
                            onCellEdited={async (cell, newValue: any) => {
                                columns[cell[0]].loading = cell[1]
                                await templateFileUpdate(cell, typeof newValue.data === "string" ? newValue.data : newValue.data.value)
                                columns[cell[0]].loading = null
                            }}
                        />
                    ) : (
                        <Box>
                            <Skeleton variant="rounded" width={"100%"} height={"80vh"} />
                        </Box>
                    )
            }
        </Box>
    )
}