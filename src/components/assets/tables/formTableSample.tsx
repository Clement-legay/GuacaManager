import React, {useCallback, useContext, useEffect} from 'react';
import {
    DataEditor,
    DataEditorProps,
    GridCell,
    GridCellKind,
    Item
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import { FormWithRelations } from "@/services/Forms/models/form.model";
import Box from "@mui/material/Box";
import {useExtraCells} from "@glideapps/glide-data-grid-cells";
import {Skeleton} from "@mui/material";
import {MainContext} from "@/app/context/contextProvider";
import {useRouter} from "next/navigation";
import {useToastedContext} from "@/app/context/config/toastedContext";
import {defaultError} from "@/app/context/config/toastMessages";

type columns = {
    title: string,
    field: string | null,
    width: number,
    loading: number | null,
}

const columns: columns[] = [
    { title: "Titre", field: "name", width: 230, loading: null },
    { title: "Description", field: "description", width: 250, loading: null },
    { title: "Champs", field: "FormInputs", width: 150, loading: null },
    { title: "Entrées", field: "Responses", width: 150, loading: null },
    { title: "Créateur", field: "CreatedBy", width: 150, loading: null },
    { title: "Statut", field: "status", width: 150, loading: null },
    { title: "Données", field: "Responses", width: 100, loading: null },
    { title: "Dèrnière Màj", field: null, width: 120, loading: null },
];

const defaultProps: Partial<DataEditorProps> = {
    smoothScrollX: true,
    smoothScrollY: true,
    isDraggable: false,
    width: "100%",
    height: "45vh",
    rowHeight: 50,
    headerHeight: 50,
};

export const FormTableSample = () => {
    const {forms} = useContext(MainContext);
    const toastedContext = useToastedContext();
    const cellProps = useExtraCells();
    const router = useRouter();

    const getForms = useCallback(async () => {
        await toastedContext("getForms", undefined, defaultError);
    }, []);

    useEffect(() => {
        getForms().then()
    }, []);

    const getData = ([col, row]: Item): GridCell => {
        if (!forms) return { kind: GridCellKind.Loading, allowOverlay: true };
        const value: FormWithRelations = forms[row];

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
                allowOverlay: false,
                displayData: value.name,
            }
        } else if (col === 1) {
            return {
                kind: GridCellKind.Text,
                data: value.description ?? "",
                allowOverlay: false,
                displayData: value.description ? value.description.length > 30
                    ? value.description.slice(0, 30) + "..."
                    : value.description.slice(0, 30)
                    : "",
            }
        } else if (col === 2) {
            return {
                kind: GridCellKind.Text,
                data: value.FormInputs?.length.toString(),
                readonly: true,
                allowOverlay: false,
                displayData: value.FormInputs
                    ? `${value.FormInputs?.length} champ(s)`
                    : "0 champ",
            }
        } else if (col === 3) {
            return {
                kind: GridCellKind.Text,
                data: value.Responses?.length.toString(),
                readonly: true,
                allowOverlay: false,
                displayData: value.Responses
                    ? `${value.Responses?.length} entrée(s)`
                    : "0 entrée",
            }
        }else if (col === 4) {
            return {
                kind: GridCellKind.Custom,
                allowOverlay: false,
                readonly: true,
                copyData: "4",
                data: {
                    kind: "user-profile-cell",
                    image: "https://i.redd.it/aqc1hwhalsz71.jpg",
                    initial: "B",
                    tint: "#F1D86E",
                    name: "Jhon Doe",
                },
            }
        } else if (col === 5) {
            return {
                kind: GridCellKind.Text,
                allowOverlay: false,
                data: value.status,
                readonly: true,
                displayData: value.status === "published" ? "Publié" : "Brouillon",
            }
        } else if (col === 6) {
            return {
                kind: GridCellKind.Custom,
                allowOverlay: false,
                copyData: "4",
                data: {
                    kind: "button-cell",
                    backgroundColor: ["transparent", "#AFA5D1"],
                    color: ["#637381", "#000"],
                    borderColor: "#AFA5D1",
                    borderRadius: 9,
                    title: "Voir",
                    onClick: () => {
                        router.push(`/formulaires/${value.id}/donnees`)
                    }
                }
            }
        } else if (col === 7) {
            return {
                kind: GridCellKind.Text,
                allowOverlay: false,
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
                forms ?
                    (
                        <DataEditor
                            {...cellProps}
                            {...defaultProps}
                            columns={columns}
                            rows={forms.length}
                            theme={{
                                accentColor: "rgb(161,153,192)",
                                accentFg: "#AFA5D1",
                                bgCellMedium: "#AFA5D1",
                                accentLight: "rgba(175,165,209,0.3)",
                            }}
                            getCellContent={getData}
                            rowMarkers={"number"}
                        />
                    ) : (
                        <Box>
                            <Skeleton variant="rounded" width={"100%"} height={"45vh"} />
                        </Box>
                    )
            }
        </Box>
    )
}