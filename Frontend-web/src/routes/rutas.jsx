import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AdminRouter from "./AdminRouter";
import LandingPage from "../modules/LandingPage";
import Login from "../modules/Login";
import RegistroPension from "../modules/RegistroPension";
import EmpleadoRouter from "./EmpleadoRouter";
import PensionadoRouter from "./PensionadoRouter";
import Pages from "../modules/cajon/pages/Pages";
import AdminGestionarEntradasSalidas from "../modules/entradas_salidas/pages/AdminGestionarEntradasSalidas";
import AdminGestionarReportesGanancias from "../modules/entradas_salidas/pages/AdminGestionarReportesGanancias";
import PensionadoEstacionamiento from "../modules/entradas_salidas/pages/PensionadoEstacionamiento";
import AdminGestionTarifas from "../modules/tarifas/pages/AdminGestionTarifas";
import GestionTiposPension from "../modules/tipo_pension/pages/GestionTiposPension";
import PensionesUsuario from "../modules/usuario_pension/pages/PensionesUsuarios";
import UsuarioTablaAdmin from "../modules/usuarios/pages/UsuarioTablaAdmin";
import CajonesPage from "../modules/cajon/pages/CajonesPage";
import MiPension from "../modules/usuario_pension/pages/MiPension";
import RecuperacionContraseña from "../modules/RecuperacionContraseña";
import ActualizacionContra from "../modules/ActualizacionContra";

const Err = () => <h1>404 - Not Found!</h1>;

export default function Rutas() {
  return (
    <Router>
      <Routes>
        <Route index element={<LandingPage />} />
        
        {/* Autenticación y registro */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro-pension" element={<RegistroPension />} />
        <Route path="/registro-pension/:id" element={<RegistroPension />} />
        <Route path="/recuperacion-contraseña" element={<RecuperacionContraseña />} />
        <Route path="/actualizacion-contra" element={<ActualizacionContra />} />
        
        {/* Autenticación legacy */}
        <Route path="/auth">
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Pages />} />
          <Route path="forgot_password" element={<Pages />} />
        </Route>

        {/* Rutas del admin */}
        <Route path="/admin" element={<AdminRouter />}>
          <Route index element={<AdminGestionarEntradasSalidas />} />
          <Route path="reportes" element={<AdminGestionarReportesGanancias />} />
          <Route path="tipos_de_pension" element={<GestionTiposPension/>} />
          <Route path="pensiones_de_usuarios" element={<PensionesUsuario />} />
          <Route path="tarifas" element={<AdminGestionTarifas />} />
          <Route path="cajones" element={<CajonesPage isPensionado={false} />} />
          <Route path="gestion_usuarios" element={<UsuarioTablaAdmin/>} />
            <Route path="gestion_usuarios_nuevoempleado" element={<UsuarioTablaAdmin/>} />
          <Route path="gestion_vehiculos" element={<Pages />} />
        </Route>
        {/* Rutas del empleado */}
        <Route path="/empleado" element={<EmpleadoRouter />}>
          <Route index element={<AdminGestionarEntradasSalidas />} />
          <Route path="pensiones" element={<PensionesUsuario />} />
          <Route path="cajones" element={<CajonesPage isPensionado={false} />} />
          <Route path="nuevo_pensionado" element={<Pages />} />
        </Route>
        {/* Rutas del pensionado */}
        <Route path="/pensionados" element={<PensionadoRouter />}>
          <Route index element={<CajonesPage isPensionado />} />
          <Route path="entradas" element={<PensionadoEstacionamiento />} />
          <Route path="historial" element={<PensionadoEstacionamiento />} />
          <Route path="mi_pension" element={<MiPension/>} />
          <Route path="mis_vehiculos" element={<Pages />} />
        </Route>
        {/* Perfil y otros */}
        <Route path="/private/perfil/:id" element={<Pages />} />
        <Route path="*" element={<Err />} />
      </Routes>
    </Router>
  );
}
