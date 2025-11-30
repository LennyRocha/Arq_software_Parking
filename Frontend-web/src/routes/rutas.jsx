import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AdminRouter from "./AdminRouter";
import ProtectedRoute from "../components/ProtectedRoute";
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
import GestionUsuarios from "../modules/usuarios/pages/GestionUsuarios";
import RegistroPensionadoAdmin from "../modules/usuarios/components/RegistroPensionadoAdmin";
import RegistroPensionadoEmpleado from "../modules/usuarios/components/RegistroPensionadoEmpleado";
import RegistroEmpleado from "../modules/usuarios/components/RegistroEmpleado";
import CajonesPage from "../modules/cajon/pages/CajonesPage";
import MiPension from "../modules/usuario_pension/pages/MiPension";
import RecuperacionContraseña from "../modules/RecuperacionContraseña";
import ActualizacionContra from "../modules/ActualizacionContra";
import Perfil from "../modules/Perfil";

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
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMINISTRADOR']}><AdminRouter /></ProtectedRoute>}>
          <Route index element={<AdminGestionarEntradasSalidas />} />
          <Route path="reportes" element={<AdminGestionarReportesGanancias />} />
          <Route path="tipos_de_pension" element={<GestionTiposPension/>} />
          <Route path="pensiones_de_usuarios" element={<PensionesUsuario />} />
          <Route path="tarifas" element={<AdminGestionTarifas />} />
          <Route path="cajones" element={<CajonesPage isPensionado={false} />} />
          <Route path="gestion_usuarios" element={<GestionUsuarios/>} />
          <Route path="usuarios/registrar" element={<RegistroPensionadoAdmin/>} />
          <Route path="usuarios/registrar-empleado" element={<RegistroEmpleado/>} />
          <Route path="gestion_vehiculos" element={<Pages />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
        {/* Rutas del empleado */}
        <Route path="/empleado" element={<ProtectedRoute allowedRoles={['EMPLEADO']}><EmpleadoRouter /></ProtectedRoute>}>
          <Route index element={<AdminGestionarEntradasSalidas />} />
          <Route path="pensiones" element={<PensionesUsuario />} />
          <Route path="cajones" element={<Pages />} />
          <Route path="nuevo_pensionado" element={<RegistroPensionadoEmpleado />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
        {/* Rutas del pensionado */}
        <Route path="/pensionados" element={<ProtectedRoute allowedRoles={['CLIENTE_PENSIONADO']}><PensionadoRouter /></ProtectedRoute>}>
          <Route index element={<CajonesPage isPensionado />} />
          <Route path="entradas" element={<PensionadoEstacionamiento />} />
          <Route path="historial" element={<PensionadoEstacionamiento />} />
          <Route path="mi_pension" element={<MiPension/>} />
          <Route path="mis_vehiculos" element={<Pages />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
        {/* Perfil y otros */}
        <Route path="*" element={<Err />} />
      </Routes>
    </Router>
  );
}
