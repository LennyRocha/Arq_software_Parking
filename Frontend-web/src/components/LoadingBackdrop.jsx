/**
 * LoadingBackdrop - Componente de indicador de carga con overlay
 * 
 * @description
 * Componente que muestra un indicador de carga circular sobre un fondo oscuro semitransparente.
 * Se usa para indicar al usuario que hay una operación en proceso.
 * 
 * @example
 * // Uso básico
 * <LoadingBackdrop 
 *   isOpen={loading} 
 *   onClose={() => setLoading(false)} 
 * />
 * 
 * @example
 * // En un componente con llamada a API
 * const [loading, setLoading] = useState(false);
 * 
 * const fetchData = async () => {
 *   setLoading(true);
 *   try {
 *     const response = await api.get('/data');
 *     // ... procesar datos
 *   } finally {
 *     setLoading(false);
 *   }
 * };
 * 
 * return (
 *   <>
 *     <LoadingBackdrop isOpen={loading} onClose={() => setLoading(false)} />
 *     <Button onClick={fetchData}>Cargar Datos</Button>
 *   </>
 * );
 * 
 * @param {boolean} isOpen - Estado de visibilidad del backdrop
 * @param {Function} [onClose] - Callback opcional al hacer clic en el backdrop
 */
import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

export default function LoadingBackdrop({ isOpen, onClose }) {
  return (
    <Backdrop sx={{ position: "absolute", top: 0, left: 0, flex: 1, zIndex: 1 }} open={isOpen} onClick={onClose}>
      <CircularProgress color="secondary" />
    </Backdrop>
  );
}
