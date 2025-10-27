import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminRouter from "./AdminRouter";
import LandingPage from "../modules/cajon/pages/LandingPage";
import EmpleadoRouter from "./EmpleadoRouter";
import PensionadoRouter from "./PensionadoRouter";
import Pages from "../modules/cajon/pages/Pages";

const Err = () => <h1>404 - Not Found!</h1>;

export default function Rutas() {
  return (
    <Router>
      <Routes>
        <Route index element={<LandingPage />} />
        {/* Autenticación */}
        <Route path="/auth">
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Pages />} />
          <Route path="signup" element={<Pages />} />
          <Route path="forgot_password" element={<Pages />} />
        </Route>

        {/* Rutas del admin */}
        <Route path="/admin" element={<AdminRouter />}>
          <Route index element={<Pages />} />
          <Route path="reportes" element={<Pages />} />
          <Route path="tipos_de_pension" element={<Pages />} />
          <Route path="ver_pensiones" element={<Pages />} />
          <Route path="tarifas" element={<Pages />} />
          <Route path="cajones" element={<Pages />} />
          <Route path="gestion_empleados" element={<Pages />} />
          <Route path="gestion_pensionados" element={<Pages />} />
          <Route path="gestion_vehiculos" element={<Pages />} />
        </Route>
        {/* Rutas del empleado */}
        <Route path="/empleado" element={<EmpleadoRouter />}>
          <Route index element={<Pages />} />
          <Route path="pensiones" element={<Pages />} />
          <Route path="cajones" element={<Pages />} />
          <Route path="nuevo_pensionado" element={<Pages />} />
        </Route>
        {/* Rutas del pensionado */}
        <Route path="/pensionados" element={<PensionadoRouter />}>
          <Route index element={<Pages />} />
          <Route path="entradas" element={<Pages />} />
          <Route path="historial" element={<Pages />} />
          <Route path="mi_pension" element={<Pages />} />
          <Route path="mis_vehiculos" element={<Pages />} />
        </Route>
        {/* Perfil y otros */}
        <Route path="/private/perfil/:id" element={<Pages />} />
        <Route path="*" element={<Err />} />
      </Routes>
    </Router>
  );
}
