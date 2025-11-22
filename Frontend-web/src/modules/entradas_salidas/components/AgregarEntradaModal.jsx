import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import CustomInputLabel from "../../../components/inputs/CustomInputLabel";
import CustomInputSelect from "../../../components/inputs/CustomInputSelect";
import CustomTextArea from "../../../components/inputs/CustomTextArea";
import CustomSwitch from "../../../components/CustomSwitch";
import entradaVisitanteYup from "../../../models/yup/entradaVisitanteYup";
import sweetAlert from "../../../utils/sweetAlert";

export default function AgregarEntradaModal({
    showModal,
    tiposVehiculos,
    onClose,
    onAgregar
}) {
    const [tipoVehiculo, setTipoVehiculo] = useState("");
    const [agregarDatosAdicionales, setAgregarDatosAdicionales] = useState(false);
    
    // Datos adicionales del vehículo
    const [placa, setPlaca] = useState("");
    const [modelo, setModelo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    
    // Estados para errores de validación
    const [errors, setErrors] = useState({
        tipoVehiculo: "",
        placa: "",
        modelo: "",
        descripcion: ""
    });

    const handleCancelar = () => {
        // Limpiar campos
        setTipoVehiculo("");
        setAgregarDatosAdicionales(false);
        setPlaca("");
        setModelo("");
        setDescripcion("");
        setErrors({
            tipoVehiculo: "",
            placa: "",
            modelo: "",
            descripcion: ""
        });
        onClose();
    };

    const handleAgregar = async (e) => {
        e.preventDefault();
        
        // Limpiar errores previos
        setErrors({
            tipoVehiculo: "",
            placa: "",
            modelo: "",
            descripcion: ""
        });

        // Crear objeto entrada
        const nuevaEntrada = {
            tipoVehiculo: { id: tipoVehiculo ? parseInt(tipoVehiculo) : undefined }
        };

        // Si se agregan datos adicionales, incluir el objeto vehiculo
        if (agregarDatosAdicionales) {
            nuevaEntrada.vehiculo = {
                tipoVehiculo: { id: tipoVehiculo ? parseInt(tipoVehiculo) : undefined },
                placa: placa.trim() || undefined,
                modelo: modelo.trim() || undefined,
                descripcion: descripcion.trim() || undefined
            };
        }

        try {
            // Validar con Yup
            await entradaVisitanteYup.validate(nuevaEntrada, { 
                abortEarly: false,
                context: { agregarDatosAdicionales }
            });
            
            // Cerrar modal temporalmente
            onClose();
            
            // Esperar un momento y mostrar confirmación
            setTimeout(async () => {
                const confirmResult = await sweetAlert({
                    title: "Confirmar registro",
                    text: "¿Está seguro de agregar esta nueva entrada?",
                    icon: "question",
                    showDenyButton: true,
                    denyText: "Cancelar",
                    confirmText: "Sí, agregar",
                    showCloseButton: true,
                    reverseButtons: true,
                });

                if (!confirmResult.isConfirmed) {
                    // Si cancela, reabrir el modal con los datos mantenidos
                    // No llamamos a handleCancelar para mantener los datos
                    // El padre debe controlar la reapertura del modal
                    return;
                }
                
                // Si la validación pasa y confirmó, llamar a la función de agregar
                const resultado = await onAgregar(nuevaEntrada);
                
                if (resultado.success) {
                    // Limpiar campos después del éxito
                    setTipoVehiculo("");
                    setAgregarDatosAdicionales(false);
                    setPlaca("");
                    setModelo("");
                    setDescripcion("");
                    setErrors({
                        tipoVehiculo: "",
                        placa: "",
                        modelo: "",
                        descripcion: ""
                    });
                    
                    // Mostrar alert de éxito
                    sweetAlert({
                        title: "¡Éxito!",
                        text: "La entrada se ha registrado correctamente",
                        icon: "success",
                        confirmText: "Aceptar",
                    });
                } else {
                    // Mostrar error
                    sweetAlert({
                        title: "Error",
                        text: resultado.error || "No se pudo registrar la entrada",
                        icon: "error"
                    });
                }
            }, 300);
            
        } catch (err) {
            // Si hay errores de validación de Yup
            if (err.name === "ValidationError") {
                const validationErrors = {};
                err.inner.forEach((error) => {
                    const path = error.path;
                    if (path === "tipoVehiculo.id" || path === "tipoVehiculo") {
                        validationErrors.tipoVehiculo = error.message;
                    } else if (path.startsWith("vehiculo.")) {
                        const field = path.replace("vehiculo.", "");
                        validationErrors[field] = error.message;
                    } else {
                        validationErrors[path] = error.message;
                    }
                });
                setErrors(validationErrors);
            } else {
                // Cerrar modal antes de mostrar error inesperado
                handleCancelar();
                setTimeout(() => {
                    sweetAlert({
                        title: "Error",
                        text: err.message || "Ocurrió un error inesperado",
                        icon: "error"
                    });
                }, 300);
            }
        }
    };

    return (
        <CustomDialog
            titulo="Agregar nueva entrada"
            isOpen={showModal}
            handleClose={handleCancelar}
            isForm={true}
            onSubmit={handleAgregar}
            textSubmit="Agregar"
            textCancel="Cancelar"
            maxWidth="sm"
            size="medium"
        >
            {/* Tipo de vehículo */}
            <CustomInputSelect
                labelText="Tipo de vehículo"
                value={tipoVehiculo}
                onChange={(e) => setTipoVehiculo(e.target.value)}
                options={tiposVehiculos}
                isObligatory={true}
                placeholder="Seleccione un tipo de vehículo"
                isWrong={!!errors.tipoVehiculo}
                errorMessage={errors.tipoVehiculo}
            />

            {/* Switch para agregar datos adicionales */}
            <CustomSwitch
                label="Agregar datos adicionales"
                checked={agregarDatosAdicionales}
                onChange={(e) => setAgregarDatosAdicionales(e.target.checked)}
            />

            {/* Campos adicionales (solo si el switch está activado) */}
            {agregarDatosAdicionales && (
                <Box>
                    {/* Modelo y Placa en la misma fila */}
                    <Grid container spacing={2} sx={{ mb: 0 }}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ mb: 2 }}>
                                <CustomInputLabel
                                    labelText="Modelo"
                                    value={modelo}
                                    onChange={(e) => setModelo(e.target.value)}
                                    isObligatory={true}
                                    type="text"
                                    placeholder="Mustang"
                                    isWrong={!!errors.modelo}
                                    errorMessage={errors.modelo}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ mb: 2 }}>
                                <CustomInputLabel
                                    labelText="Placa"
                                    value={placa}
                                    onChange={(e) => setPlaca(e.target.value)}
                                    isObligatory={true}
                                    type="text"
                                    placeholder="30"
                                    isWrong={!!errors.placa}
                                    errorMessage={errors.placa}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Descripción en fila completa */}
                    <CustomTextArea
                        labelText="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        isObligatory={true}
                        placeholder="Entró en un carrazo último modelo"
                        rows={3}
                        isWrong={!!errors.descripcion}
                        errorMessage={errors.descripcion}
                    />
                </Box>
            )}
        </CustomDialog>
    );
}
