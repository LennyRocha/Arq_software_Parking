import React from "react";
import sweetAlert from "../../../utils/sweetAlert";
import { useDarkContext } from "../../../context/DarkContext";
import { TextField } from "@mui/material";
import MainHeader from "../../../components/MainHeader";

const links = [
  { nombre: "Inicio", ruta: "/admin", disabled: false },
  { nombre: "Usuarios", ruta: "/admin/usuarios", disabled: false },
  { nombre: "Configuración", ruta: "/admin/configuracion", disabled: true },
];

export default function Pages() {
  const { isDarkMode, toggleDarkMode } = useDarkContext();
  return (
    <>
      <MainHeader titulo="Panel de administración"  breads={links}/>
      <h1 className="custom-font">Vite + React + Exo 2</h1>
      <div className="card">
        <button
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
          className="error"
        >
          show sweet alert
        </button>
        <button
          className="surface bukon"
          onClick={() => toggleDarkMode()}
          style={{ marginLeft: "10px" }}
        >
          Cambiar a {isDarkMode ? "modo claro" : "modo oscuro"}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          helperText="puto"
        />
        <TextField id="filled-basic" label="Filled" variant="filled" />
        <TextField id="standard-basic" label="Standard" variant="standard" />
        <TextField
          id="standard-basic"
          label="Standard"
          variant="standard"
          error
          helperText="Help"
        />
        <div className="my_card bx">
          <h3>Hola card</h3>
        </div>
      </div>
    </>
  );
}
