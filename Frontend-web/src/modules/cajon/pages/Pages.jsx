import React from "react";
import sweetAlert from "../../../utils/sweetAlert";
import { useDarkContext } from "../../../context/DarkContext";
import { Button, TextField, Typography } from "@mui/material";
import MainHeader from "../../../components/MainHeader";
import useDialogController from "../../../hooks/useDialogController";
import CustomDialog from "../../../components/CustomDialog";

const links = [
  { nombre: "Inicio", ruta: "/admin", disabled: false },
  { nombre: "Usuarios", ruta: "/admin/usuarios", disabled: false },
  { nombre: "Configuración", ruta: "/admin/configuracion", disabled: true },
];

export default function Pages() {
  const { open, openDialog, closeDialog } = useDialogController();
  const { toggleDarkMode } = useDarkContext();
  return (
    <>
      <MainHeader titulo="Panel de administración" breads={links} />
      <h1 className="custom-font">Vite + React + Exo 2</h1>
      <div className="card">
        <Button
          onClick={() =>
            sweetAlert({
              title: "Hello!",
              text: "This is a sweet alert.",
              icon: "success",
              showCancelButton: true,
              showDenyButton: true,
              showCloseButton: true,
              reverseButtons: true,
            })
          }
          style={{ marginLeft: "10px" }}
          color="error"
          variant="contained"
        >
          Error
        </Button>
        <Button
          color="success"
          variant="contained"
          onClick={() => toggleDarkMode()}
          style={{ marginLeft: "10px" }}
        >
          Success
        </Button>
        <Button
          color="info"
          variant="contained"
          style={{ marginLeft: "10px" }}
          onClick={() => openDialog()}
        >
          Info
        </Button>
        <Button
          color="warning"
          variant="contained"
          style={{ marginLeft: "10px" }}
        >
          Warning
        </Button>
        <Button
          color="inherit"
          variant="contained"
          style={{ marginLeft: "10px" }}
        >
          Inerhit
        </Button>
        <Button
          color="black"
          variant="contained"
          style={{ marginLeft: "10px" }}
        >
          Black
        </Button>
        <Button color="gray" variant="contained" style={{ marginLeft: "10px" }}>
          Gray
        </Button>
        <br />
        <Button
          color="primary"
          variant="contained"
          style={{ marginLeft: "10px" }}
        >
          MUI Primario
        </Button>
        <Button color="secondary" variant="contained">
          MUI Secundario
        </Button>
        <Button color="tertiary" variant="contained">
          MUI Terciario
        </Button>
        <br />
        <Button color="primary" variant="outlined">
          MUI Primario
        </Button>
        <Button color="secondary" variant="outlined">
          MUI Secundario
        </Button>
        <Button color="tertiary" variant="outlined">
          MUI Terciario
        </Button>
        <br />
        <Button color="primary" variant="text">
          MUI Primario
        </Button>
        <Button color="secondary" variant="text">
          MUI Secundario
        </Button>
        <Button color="tertiary" variant="text">
          MUI Terciario
        </Button>
        <br />
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          helperText="puto"
          placeholder="Placeholder"
        />
        <TextField
          id="filled-basic"
          label="Filled"
          variant="filled"
          placeholder="Placeholder"
        />
        <TextField
          id="standard-basic"
          label="Standard"
          variant="standard"
          placeholder="Placeholder"
        />
        <TextField
          id="standard-basic"
          label="Standard"
          variant="standard"
          error
          helperText="Help"
          placeholder="Placeholder"
        />
        <div className="my_card bx">
          <h3>Hola card</h3>
        </div>
      </div>
      <CustomDialog
        titulo={"Hola desde un dialog"}
        isOpen={open}
        handleClose={closeDialog}
        maxWidth="md"
      >
        <Typography gutterBottom>contenido perron del dialog</Typography>
      </CustomDialog>
    </>
  );
}
