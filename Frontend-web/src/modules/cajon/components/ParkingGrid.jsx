import {
  Box,
  ButtonGroup,
  Button,
  Grid,
  Chip,
  Skeleton,
  Typography,
  IconButton,
} from "@mui/material";
import useCajones from "../hooks/useCajones";
import React from "react";
import Cajoncito from "./Cajoncito";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import useDialogController from "../../../hooks/useDialogController";
import CustomDialog from "../../../components/CustomDialog";

const ParkingGrid = ({ columnsConfig = {} }) => {
  const {
    data,
    loading,
    sendParams,
    restartValues,
    setPiso,
    setIdCar,
    piso,
    idCar,
    availableCount,
  } = useCajones();
  const defaultConfig = {
    xs: {
      columns: "1fr 1fr 0.25fr 1fr 1fr",
      positions: [1, 2, 4, 5],
      itemsPerRow: 4,
      roadColumns: [3],
    },
    sm: {
      columns: "0.5fr 1fr 1fr 0.5fr 1fr 1fr 0.5fr",
      positions: [2, 3, 5, 6],
      itemsPerRow: 4,
      roadColumns: [1, 4, 7],
    },
    md: {
      columns: "1fr .25fr 1fr 1fr .25fr 1fr 1fr .25fr 1fr",
      positions: [1, 3, 4, 6, 7, 9],
      itemsPerRow: 6,
      roadColumns: [2, 5, 8],
    },
    lg: {
      columns: "repeat(9, 1fr)",
      positions: [1, 3, 4, 6, 7, 9],
      itemsPerRow: 6,
      roadColumns: [2, 5, 8],
    },
  };

  const config = { ...defaultConfig, ...columnsConfig };

  const { open, openDialog, closeDialog } = useDialogController();

  const getRoadRows = (breakpoint) => {
    const itemsPerRow = config[breakpoint].itemsPerRow;
    return Math.ceil(data.length / itemsPerRow);
  };

  if (loading || !data)
    return (
      <Box
        component={"div"}
        sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { sm: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Skeleton variant="rounded" width={"25%"} height={50} />
          <Skeleton variant="rounded" width={"25%"} height={50} />
        </Box>
        <Skeleton variant="rounded" width={"35%"} height={50} />
        <Skeleton variant="rounded" width={"100%"} height={30} />
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Skeleton variant="rounded" sx={{ flex: 2 }} height={150} />
          <Skeleton variant="rounded" sx={{ flex: 1 }} height={150} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Skeleton variant="rounded" sx={{ flex: 1 }} height={150} />
          <Skeleton variant="rounded" sx={{ flex: 2 }} height={150} />
        </Box>
        <Skeleton variant="rounded" width={"100%"} height={30} />
      </Box>
    );

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        my: 2,
        gap: 1,
        display: "flex",
        flex: 1,
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { sm: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ width: "100%", textAlign: { sm: "center", md: "left" } }}
          >
            Tipo de vehículo
          </Typography>
          <ButtonGroup
            variant="contained"
            color="tertiary"
            aria-label="Basic button group"
          >
            <Button
              variant={idCar === 0 ? "contained" : "outlined"}
              onClick={() => setIdCar(0)}
            >
              Todos
            </Button>
            <Button
              variant={idCar === 1 ? "contained" : "outlined"}
              onClick={() => setIdCar(1)}
            >
              Coche
            </Button>
            <Button
              variant={idCar === 2 ? "contained" : "outlined"}
              onClick={() => setIdCar(2)}
            >
              Camioneta
            </Button>
            <Button
              variant={idCar === 3 ? "contained" : "outlined"}
              onClick={() => setIdCar(3)}
            >
              Moto
            </Button>
          </ButtonGroup>
        </Box>

        <Box>
          <Typography
            variant="subtitle2"
            sx={{ width: "100%", textAlign: { sm: "center", md: "right" } }}
          >
            Piso
          </Typography>
          <ButtonGroup
            variant="contained"
            color="tertiary"
            aria-label="Basic button group"
          >
            <Button
              variant={piso === 0 ? "contained" : "outlined"}
              onClick={() => setPiso(0)}
            >
              Todos
            </Button>
            <Button
              variant={piso === 1 ? "contained" : "outlined"}
              onClick={() => setPiso(1)}
            >
              Primer piso
            </Button>
            <Button
              variant={piso === 2 ? "contained" : "outlined"}
              onClick={() => setPiso(2)}
            >
              Segundo piso
            </Button>
            <Button
              variant={piso === 3 ? "contained" : "outlined"}
              onClick={() => setPiso(3)}
            >
              Tercer piso
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: { sm: "center", md: "flex-start" },
          marginTop: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            textAlign: { sm: "center", md: "left" },
          }}
        >
          Cajones disponibles: {availableCount}
        </Typography>
        <IconButton aria-label="ver_simbología" onClick={openDialog}>
          <HelpOutlineIcon fontSize="24" color="primary" />
        </IconButton>
      </Box>
      <Box
        sx={{
          height: "1rem",
          borderRadius: 1,
          mb: 3,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <div style={{ width: "100%", border: "1px dashed var(--gray)" }} />
        <Chip label="Entrada" variant="outlined" color="secondary" />
        <div style={{ width: "100%", border: "1px dashed var(--gray)" }} />
      </Box>

      <Grid
        container
        spacing={2}
        sx={{
          gridTemplateColumns: {
            xs: config.xs.columns,
            sm: config.sm.columns,
            md: config.md.columns,
            lg: config.lg.columns,
          },
          display: "grid",
        }}
      >
        {data.map((cajon, index) => {
          const xsRow = Math.floor(index / config.xs.itemsPerRow) + 1;
          const smRow = Math.floor(index / config.sm.itemsPerRow) + 1;
          const mdRow = Math.floor(index / config.md.itemsPerRow) + 1;
          const lgRow = Math.floor(index / config.lg.itemsPerRow) + 1;

          const setBackground = () => {
            if (!cajon.disponible) {
              return "transparent";
            } else if (cajon.paraPensionados && cajon.estatus) {
              return "var(--other)";
            } else if (
              cajon.disponible &&
              !cajon.paraPensionados &&
              !cajon.estatus
            ) {
              return "var(--card)";
            } else if (!cajon.estatus) {
              return "var(--gray)";
            }
            return "var(--card)";
          };

          const setBorder = () => {
            if (!cajon.disponible) {
              return "transparent";
            } else if (cajon.paraPensionados && cajon.estatus) {
              return "var(--other)";
            } else if (
              cajon.disponible &&
              !cajon.paraPensionados &&
              !cajon.estatus
            ) {
              return "var(--card-text)";
            } else if (!cajon.estatus) {
              return "var(--dark)";
            }
            return "var(--card-text)";
          };

          const positions = {
            xs: config.xs.positions[index % config.xs.positions.length],
            sm: config.sm.positions[index % config.sm.positions.length],
            md: config.md.positions[index % config.md.positions.length],
            lg: config.lg.positions[index % config.lg.positions.length],
          };

          return (
            <Cajoncito
              positions={positions}
              key={index}
              cajon={cajon}
              sx={{
                gridColumn: {
                  xs: config.xs.positions[index % config.xs.positions.length],
                  sm: config.sm.positions[index % config.sm.positions.length],
                  md: config.md.positions[index % config.md.positions.length],
                  lg: config.lg.positions[index % config.lg.positions.length],
                },
                gridRow: {
                  xs: xsRow,
                  sm: smRow,
                  md: mdRow,
                  lg: lgRow,
                },
                aspectRatio: "16/9",
                backgroundColor: setBackground(),
                border: `1px solid  ${setBorder()}`,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  borderColor: "var(--primary)",
                  boxShadow: 3,
                  transform: "scale(1.02)",
                },
              }}
            />
          );
        })}

        {/* Carreteras XS */}
        {Array.from({ length: getRoadRows("xs") }).map((_, rowIndex) =>
          config.xs.roadColumns.map((col) => (
            <Box
              key={`road-xs-${rowIndex}-${col}`}
              sx={{
                gridColumn: { xs: col, sm: "unset" },
                gridRow: { xs: rowIndex + 1, sm: "unset" },
                backgroundColor: "transparent",
                display: { xs: "flex", sm: "none" },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "1px",
                  border: "1px dashed var(--gray)",
                }}
              />
            </Box>
          ))
        )}

        {/* Carreteras SM */}
        {Array.from({ length: getRoadRows("sm") }).map((_, rowIndex) =>
          config.sm.roadColumns.map((col) => (
            <Box
              key={`road-sm-${rowIndex}-${col}`}
              sx={{
                gridColumn: { xs: "unset", sm: col, md: "unset" },
                gridRow: { xs: "unset", sm: rowIndex + 1, md: "unset" },
                backgroundColor: "transparent",
                display: { xs: "none", sm: "flex", md: "none" },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "1px",
                  border: "1px dashed var(--gray)",
                }}
              />
            </Box>
          ))
        )}

        {/* Carreteras MD */}
        {Array.from({ length: getRoadRows("md") }).map((_, rowIndex) =>
          config.md.roadColumns.map((col) => (
            <Box
              key={`road-md-${rowIndex}-${col}`}
              sx={{
                gridColumn: { xs: "unset", sm: "unset", md: col, lg: "unset" },
                gridRow: {
                  xs: "unset",
                  sm: "unset",
                  md: rowIndex + 1,
                  lg: "unset",
                },
                backgroundColor: "transparent",
                display: { xs: "none", sm: "none", md: "flex", lg: "none" },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "1px",
                  border: "1px dashed var(--gray)",
                }}
              />
            </Box>
          ))
        )}

        {/* Carreteras LG */}
        {Array.from({ length: getRoadRows("lg") }).map((_, rowIndex) =>
          config.lg.roadColumns.map((col) => (
            <Box
              key={`road-lg-${rowIndex}-${col}`}
              sx={{
                gridColumn: { xs: "unset", sm: "unset", md: "unset", lg: col },
                gridRow: {
                  xs: "unset",
                  sm: "unset",
                  md: "unset",
                  lg: rowIndex + 1,
                },
                backgroundColor: "transparent",
                display: { xs: "none", sm: "none", md: "none", lg: "flex" },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "1px",
                  border: "1px dashed var(--gray)",
                }}
              />
            </Box>
          ))
        )}
      </Grid>

      <Box
        sx={{
          height: "1rem",
          borderRadius: 1,
          mb: 3,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <div style={{ width: "100%", border: "1px dashed var(--gray)" }} />
      </Box>

      <Typography
        color="error"
        variant="subtitle1"
        sx={{ width: "100%", textAlign: { sm: "center", md: "left" } }}
      >
        <b>NOTA:</b> No representa el orden real de los cajones
      </Typography>
      <CustomDialog
        titulo={"Simbología"}
        tituloLeft
        isOpen={open}
        handleClose={closeDialog}
        textConfirm="Cerrar"
        showCancel={false}
        fullWidth={false}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Cajoncito
              sx={{
                width: "5rem",
                height: "2.5rem",
                border: "1px solid var(--card)",
                backgroundColor: "var(--card)",
              }}
              cajon={{ disponible: false, tipoVehiculo: { id: 1 } }}
            />
            <Typography variant="body1">Ocupado</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Cajoncito
              sx={{
                width: "5rem",
                height: "2.5rem",
                border: "1px solid var(--card-text)",
                backgroundColor: "var(--card)",
              }}
              cajon={{ disponible: true, tipoVehiculo: { id: 1 } }}
            />
            <Typography variant="body1">Disponible</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Cajoncito
              sx={{
                width: "5rem",
                height: "2.5rem",
                border: "1px solid var(--other)",
                backgroundColor: "var(--other)",
              }}
              cajon={{ disponible: true, tipoVehiculo: { id: 1 } }}
            />
            <Typography variant="body1">Para pensionados</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Cajoncito
              sx={{
                width: "5rem",
                height: "2.5rem",
                border: "1px solid var(--card-text)",
                border: "1px solid var(--dark)",
                backgroundColor: "var(--gray)",
              }}
              cajon={{ disponible: true, tipoVehiculo: { id: 1 } }}
            />
            <Typography variant="body1">No disponible</Typography>
          </Box>
        </Box>
      </CustomDialog>
    </Box>
  );
};

/* titulo,
  isOpen,
  children,
  isForm = false,
  onSubmit,
  onCancel,
  onConfirm,
  textSubmit = "Submit",
  textCancel = "Cancel",
  textConfirm = "Confirm",
  showActions = true,
  fullWidth = true, // changed default to true
  maxWidth = "sm",  // changed default to "sm"
  containerStyle = {},
  handleClose,
  keyForClose = true,
  allowOutsideClick = true */

export default ParkingGrid;
