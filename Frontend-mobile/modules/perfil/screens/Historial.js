import { View } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Card, DataTable, TextInput, useTheme } from "react-native-paper";

export default function Historial() {
  const paper = useTheme();
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const [items] = React.useState([
    {
      key: 1,
      name: 'Cupcake',
      calories: 356,
      fat: 16,
      campo: "valor",
      campo2: "valor",
      campo3: "valor",
      campo4: "valor",
    },
    {
      key: 2,
      name: 'Eclair',
      calories: 262,
      fat: 16,
      campo: "valor",
      campo2: "valor",
      campo3: "valor",
      campo4: "valor",
    },
    {
      key: 3,
      name: 'Frozen yogurt',
      calories: 159,
      fat: 6,
      campo: "valor",
      campo2: "valor",
      campo3: "valor",
      campo4: "valor",
    },
    {
      key: 4,
      name: 'Gingerbread',
      calories: 305,
      fat: 3.7,
      campo: "valor",
      campo2: "valor",
      campo3: "valor",
      campo4: "valor",
    },
  ]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, gap: 12 }} nestedScrollEnabled keyboardShouldPersistTaps="handled" >
      <TextInput
        label="Bucar por folio"
        mode="outlined"
        left={<TextInput.Icon icon="tag-search" />}
      />
      <Card>
        <ScrollView horizontal style={{ flex: 1 }} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={{ width: 80, justifyContent: "center" }}>Dessert</DataTable.Title>
              <DataTable.Title numeric style={{ width: 80, justifyContent: "center" }}>Calories</DataTable.Title>
              <DataTable.Title numeric style={{ width: 80, justifyContent: "center" }}>Fat</DataTable.Title>
              <DataTable.Title numeric style={{ width: 100, justifyContent: "center" }}>Campo 1</DataTable.Title>
              <DataTable.Title numeric style={{ width: 100, justifyContent: "center" }}>Campo 2</DataTable.Title>
              <DataTable.Title numeric style={{ width: 100, justifyContent: "center" }}>Campo 3</DataTable.Title>
              <DataTable.Title numeric style={{ width: 100, justifyContent: "center" }}>Campo 4</DataTable.Title>
            </DataTable.Header>

            {items.slice(from, to).map((item) => (
              <DataTable.Row key={item.key} >
                <DataTable.Cell style={{ width: 80, justifyContent: "center" }}>{item.name}</DataTable.Cell>
                <DataTable.Cell numeric style={{ width: 80, justifyContent: "center" }}>{item.calories}</DataTable.Cell>
                <DataTable.Cell numeric style={{ width: 80, justifyContent: "center" }}>{item.fat}</DataTable.Cell>
                <DataTable.Cell style={{ width: 100, justifyContent: "center" }}>{item.campo}</DataTable.Cell>
                <DataTable.Cell style={{ width: 100, justifyContent: "center" }}>{item.campo2}</DataTable.Cell>
                <DataTable.Cell style={{ width: 100, justifyContent: "center" }}>{item.campo3}</DataTable.Cell>
                <DataTable.Cell style={{ width: 100, justifyContent: "center" }}>{item.campo4}</DataTable.Cell>
              </DataTable.Row>

            ))}
          </DataTable>
        </ScrollView>
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(items.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${items.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={(newItemsPerPage) => {
            onItemsPerPageChange(newItemsPerPage); // actualiza el valor
            setPage(0); // resetea la página
          }}
          showFastPaginationControls
          selectPageDropdownLabel={'Rows per page'}
        />
      </Card>
    </ScrollView>
  );
}
