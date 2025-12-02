import React from "react";
import useVehiculos from "../hooks/useVehículos";
import useTiposVehiculos from "../hooks/useTiposVehiculos";
import LoadingBackdrop from "../../../components/LoadingBackdrop";
import MainHeader from "../../../components/MainHeader";
import HeadingDescription from "../../../components/HeadingDescription";
import {
  Box,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import Icon from "@mdi/react";
import { Add } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import VehiculoCard from "../components/VehiculoCard";
import { useNavigate } from "react-router-dom";
import { mdiCarOff } from "@mdi/js";
import EmptyView from "../../errorPages/EmptyView";
import useUserIdByEmail from "../../../hooks/getIdByEmail";
import useVehiculosEstacionados from "../hooks/useVehiculosEstacionados";

export default function MisVehiculos() {
  const { id, loading, error } = useUserIdByEmail();
  const {
    getVehiculos,
    data,
    isLoading,
    errorData,
    restoreValues,
    restartCall,
    query,
    setQuery,
    idCar,
    setIdCar,
    active,
    setActive,
    conPlacas,
    setConPlacas,
  } = useVehiculos(id);
  const { data: list, error: errorTipos, load } = useTiposVehiculos();

  const { getVehiculosActive, activeData, isLoading: activeLoading, errorData: activeError, restartCall: recall } = useVehiculosEstacionados();

  const [criterio, setCriterio] = React.useState("none");

  const navigate = useNavigate();

  React.useEffect(() => {
    switch (criterio) {
      case "none":
        setConPlacas(null);
        setActive(null);
        break;
      case "con_placa":
        setConPlacas(true);
        setActive(null);
        break;
      case "activos":
        setConPlacas(null);
        setActive(true);
        break;
      case "ambos":
        setConPlacas(true);
        setActive(true);
        break;
      case "contrario":
        setConPlacas(false);
        setActive(false);
        break;
    }
  }, [criterio]);

  return (
    <Box sx={{ flex: 1, overflow: "auto" }}>
      <LoadingBackdrop isOpen={isLoading || load || loading || activeLoading } />
      <MainHeader
        titulo="Mis vehículos"
        breads={[
          {
            nombre: "Inicio",
            ruta: "/pensionados",
            disabled: false,
          },
          {
            nombre: "Mis vehículos",
            ruta: "/pensionados/mis_vehiculos",
            disabled: false,
          },
          {
            nombre: "Inicio",
            ruta: "/mis_vehiculos",
            disabled: true,
          },
        ]}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "25px",
          gap: 2,
        }}
      >
        <HeadingDescription
          title={isLoading ? "Cargando información..." : "GESTIÓN DE VEHÍCULOS"}
          description={
            isLoading
              ? "Por favor espera mientras verificamos tu información..."
              : "Apartado para consultar vehículos, registrar uno nuevo, cambiar el estado de alguno, que ya no se utilizará más."
          }
        />
        {data && (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row", width: "100%" },
                gap: 1,
                boxSizing: "border-box",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  height: "40px",
                }}
              >
                <FormControl
                  size="small"
                  sx={{ width: { xs: "50%", lg: "auto" } }}
                >
                  <InputLabel>Tipo de vehículo</InputLabel>
                  <Select
                    value={idCar}
                    label="Tipo de vehículo"
                    onChange={(e) => setIdCar(e.target.value)}
                    sx={{
                      "& .MuiSelect-select": {
                        textAlign: "left",
                      },
                    }}
                  >
                    <MenuItem value={0}>Todos</MenuItem>
                    {list.map((l) => (
                      <MenuItem key={l.id} value={l.id}>
                        {l.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  size="small"
                  sx={{ width: { xs: "50%", lg: "auto" } }}
                >
                  <InputLabel>Filtrar por:</InputLabel>
                  <Select
                    value={criterio}
                    label="Criterio de filtrado"
                    onChange={(e) => setCriterio(e.target.value)}
                    sx={{
                      "& .MuiSelect-select": {
                        textAlign: "left",
                      },
                    }}
                  >
                    <MenuItem value={"none"}>Sin filtros</MenuItem>
                    <MenuItem value={"con_placa"}>Con placa</MenuItem>
                    <MenuItem value={"activos"}>Activos</MenuItem>
                    <MenuItem value={"ambos"}>Ambos</MenuItem>
                    <MenuItem value={"contrario"}>
                      Sin placa, ni activos
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <FilterAltIcon color="gray" />
                <TextField
                  label={"Buscar por"}
                  placeholder="Modelo o descripción"
                  variant="outlined"
                  size="small"
                  sx={{ flex: 1 }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  height: "40px",
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ flex: { xs: 1, lg: 0 } }}
                  onClick={getVehiculos}
                >
                  Buscar
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ flex: { xs: 1, lg: 1 } }}
                  onClick={restoreValues}
                >
                  Limpiar filtros
                </Button>
              </Box>
              <Button
                onClick={() => navigate("/pensionados/nuevo_vehiculo")}
                size="large"
                variant="contained"
                startIcon={<Add />}
              >
                Nuevo
              </Button>
            </Box>
            {data.data.length !== 0 ? (
              <>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(auto-fill, minmax(200px, 1fr))",
                      xl: "repeat(auto-fill, minmax(250px, 1fr))",
                    },
                    display: "grid",
                  }}
                >
                  {data.data.map((c, index) => {
                    return (
                      <VehiculoCard
                        key={index}
                        current={activeData.data}
                        types={list}
                        vehic={c}
                        getVehiculos={getVehiculos}
                      />
                    );
                  })}
                </Grid>
              </>
            ) : (
              <EmptyView
                message={data.message}
                customIcon={<Icon path={mdiCarOff} size={3} color={"var(--gray)"} />}
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
