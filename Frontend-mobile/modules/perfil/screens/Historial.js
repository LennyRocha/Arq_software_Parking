import { View, ScrollView } from "react-native";
import React from "react";
import { Card, DataTable, TextInput, useTheme, ActivityIndicator } from "react-native-paper";
import useMiPension from "../../pension/hooks/useMiPension";
import LoadingView from "../../../components/LoadingView";
import EmptyListView from "../../errores/screens/EmptyListView";
import { historialPagosColumns } from "../../pension/config/columnasPension";
import ErrorAxios from "../../errores/screens/ErroresScreens";

export default function Historial() {
  const {
    historial,
    loadingHistorial,
    errorHistorial,
    cargarMiHistorial,
    page,
    rowsPerPage,
    totalElements,
    ordenarPor,
    ordenDireccion,
    buscarTexto,
    setOrdenarPor,
    setOrdenDireccion,
    setBuscarTexto,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useMiPension();

  const theme = useTheme();

  React.useEffect(() => {
    cargarMiHistorial();
  }, [page, rowsPerPage, ordenarPor, ordenDireccion, buscarTexto]);

  if (loadingHistorial) return <LoadingView />;

  if (errorHistorial) return <ErrorAxios callback={cargarMiHistorial} error={errorHistorial} />

  if (historial.length === 0) return <EmptyListView message={"No tienes pagos registrados"} icon={"cash-remove"} />;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 24, gap: 16 }}
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
    >
      {/* <TextInput
        label="Buscar por folio"
        mode="outlined"
        left={<TextInput.Icon icon="tag-search" />}
        value={buscarTexto}
        onChangeText={(text) => setBuscarTexto(text)}
      /> */}

      {/* TABLA */}
      <Card style={{ paddingBottom: 16 }}>
        <ScrollView horizontal nestedScrollEnabled keyboardShouldPersistTaps="handled">
          <DataTable>

            {/* ENCABEZADOS REALES */}
            <DataTable.Header>
              {historialPagosColumns.map((col) => (
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
            {historial?.map((row) => (
              <DataTable.Row key={row.id}>
                {historialPagosColumns.map((col) => (
                  <DataTable.Cell
                    key={col.field}
                    style={{ width: col.width, justifyContent: "flex-start" }}
                  >
                    {col.render ? col.render(row) : row[col.field]}
                  </DataTable.Cell>
                ))}
              </DataTable.Row>
            ))}

          </DataTable>
        </ScrollView>

        {/* PAGINACIÓN REAL */}
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(totalElements / rowsPerPage)}
          onPageChange={(newPage) => handleChangePage(newPage)}
          label={`${page * rowsPerPage + 1}-${Math.min(
            (page + 1) * rowsPerPage,
            totalElements
          )} de ${totalElements}`}
          numberOfItemsPerPage={rowsPerPage}
          onItemsPerPageChange={(newSize) => handleChangeRowsPerPage(newSize)}
          selectPageDropdownLabel={"Filas por página"}
        />
      </Card>
    </ScrollView>
  );
}