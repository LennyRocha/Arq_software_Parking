import React from "react";
import reactLogo from "../../../assets/react.svg";
import sweetAlert from "../../../utils/sweetAlert";
import { useDarkContext } from "../../../context/DarkContext";
import { TextField } from "@mui/material";
import viteLogo from "/vite.svg";

export default function Pages() {
  const { isDarkMode, toggleDarkMode } = useDarkContext();
  return (
    <>
      {" "}
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
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
        <TextField id="outlined-basic" label="Outlined" variant="outlined" helperText="puto" />
        <TextField id="filled-basic" label="Filled" variant="filled" />
        <TextField id="standard-basic" label="Standard" variant="standard" />
        <TextField id="standard-basic" label="Standard" variant="standard"  error helperText="Help"/>
        <div className="my_card bx">
          <h3>Hola card</h3>
        </div>
      </div>
    </>
  );
}
