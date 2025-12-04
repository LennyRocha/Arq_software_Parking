import { View, ScrollView } from "react-native";
import React from "react";
import { Card, DataTable, TextInput, useTheme } from "react-native-paper";
import LoadingView from "../../../components/LoadingView";
import ErrorAxios from "../../errores/screens/ErroresScreens";
import EmptyListView from "../../errores/screens/EmptyListView";
import { entradasSalidasPensionadoColumns } from "../config/tableColumns";
import { useEntradasSalidasPensionado } from "../hooks/useEntradasSalidasPensionado";
import useModalController from "../../../hooks/useModalController";
import CustomModal from "../../../components/CustomModal";
import DetalleMarcaje from "../components/DetalleMarcaje";

export default function HistorialMarcajes() {
    const {
        entradasSalidas,
        loading,
        error,
        page,
        rowsPerPage,
        totalElements,
        ordenarPor,
        ordenDireccion,
        buscarTexto,
        setPage,
        setRowsPerPage,
        setOrdenarPor,
        setOrdenDireccion,
        setBuscarTexto,
        cargarEntradasSalidasPaginado,
    } = useEntradasSalidasPensionado();

    const theme = useTheme();

    React.useEffect(() => {
        cargarEntradasSalidasPaginado();
    }, [page, rowsPerPage, ordenarPor, ordenDireccion, buscarTexto]);

    const { modalVisible, showModal, hideModal } = useModalController();

    const [isFocused, setIsFocused] = React.useState(false);

    const [entradaSeleccionada, setEntradaSeleccionada] = React.useState(null);

    const handleVerDetalle = (entrada) => {
        setEntradaSeleccionada(entrada);
        showModal();
    };

    const handleCloseDetalle = () => {
        setEntradaSeleccionada(null);
        hideModal();
    };

    if (loading) return <LoadingView />;

    if (error) return <ErrorAxios callback={cargarEntradasSalidasPaginado} error={error} />;

    if (entradasSalidas.length === 0)
        return (
            <EmptyListView
                message="No tienes entradas o salidas registradas"
                icon="history"
            />
        );

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 24, gap: 16 }}
            nestedScrollEnabled
        >
            {/* BUSCADOR */}
            <TextInput
                label="Buscar por folio"
                mode="outlined"
                left={<TextInput.Icon icon="tag-search" color={isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant} />}
                value={buscarTexto}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChangeText={(text) => setBuscarTexto(text)}
            />

            {/* TABLA */}
            <Card style={{ paddingBottom: 16 }}>
                <ScrollView horizontal nestedScrollEnabled>
                    <DataTable>

                        {/* ENCABEZADOS */}
                        <DataTable.Header>
                            {entradasSalidasPensionadoColumns({ onView: handleVerDetalle }).map((col) => (
                                <DataTable.Title
                                    key={col.field}
                                    numeric={false}
                                    style={{ width: col.width, justifyContent: "flex-start" }}
                                    sortDirection={ordenarPor === col.field ? ordenDireccion : null}
                                    onPress={() => {
                                        if (ordenarPor === col.field) {
                                            setOrdenDireccion(ordenDireccion === "asc" ? "desc" : "asc");
                                        } else {
                                            setOrdenarPor(col.field);
                                            setOrdenDireccion("asc");
                                        }
                                    }}
                                >
                                    {col.label}
                                </DataTable.Title>
                            ))}
                        </DataTable.Header>

                        {/* FILAS */}
                        {entradasSalidas?.map((row) => (
                            <DataTable.Row key={row.id}>
                                {entradasSalidasPensionadoColumns({ onView: handleVerDetalle }).map((col) => {
                                    const value = col.render ? col.render(row) : row[col.field];

                                    return (
                                        <DataTable.Cell
                                            key={col.field}
                                            style={{ width: col.width, justifyContent: "flex-start" }}
                                        >
                                            {/* Si es ícono */}
                                            {typeof value === "object" && value?.element
                                                ? value.element
                                                : value}
                                        </DataTable.Cell>
                                    );
                                })}
                            </DataTable.Row>
                        ))}

                    </DataTable>
                </ScrollView>

                {/* PAGINACIÓN */}
                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(totalElements / rowsPerPage)}
                    onPageChange={(p) => setPage(p)}
                    label={`${page * rowsPerPage + 1}-${Math.min(
                        (page + 1) * rowsPerPage,
                        totalElements
                    )} de ${totalElements}`}
                    numberOfItemsPerPage={rowsPerPage}
                    onItemsPerPageChange={(n) => setRowsPerPage(n)}
                    selectPageDropdownLabel="Filas por página"
                />
            </Card>
            <CustomModal visible={modalVisible} onClose={handleCloseDetalle}>
                <DetalleMarcaje entrada={entradaSeleccionada} />
            </CustomModal>
        </ScrollView>
    );
}