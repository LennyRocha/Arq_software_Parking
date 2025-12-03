import React, { useState } from "react";
import CustomDialog from "../../../components/CustomDialog";
import CustomInputLabel from "../../../components/inputs/CustomInputLabel";
import CustomInputSelect from "../../../components/inputs/CustomInputSelect";
import tarifaYup from "../../../models/yup/tarifaYup";
import sweetAlert from "../../../utils/sweetAlert";

export default function AgregarTarifaModal({
    data,
    showModal,
    tiposVehiculos,
    onClose,
    onAgregar,
    onActualizar
}) {
    const esEdicion = data && data.id; // Detectar si es modo edición
    const [tipoVehiculo, setTipoVehiculo] = useState(data?.tipoVehiculo?.id || data?.tipoVehiculo || "");
    const [tiempo, setTiempo] = useState(data?.tiempo || "");
    const [costo, setCosto] = useState(data?.costo || "");
    
    // Estados para errores de validación
    const [errors, setErrors] = useState({
        tipoVehiculo: "",
        tiempo: "",
        costo: ""
    });

    const handleCancelar = () => {
        // Limpiar campos
        setTipoVehiculo("");
        setTiempo("");
        setCosto("");
        setErrors({
            tipoVehiculo: "",
            tiempo: "",
            costo: ""
        });
        onClose();
    };

    const handleAgregar = async (e) => {
        e.preventDefault();
        
        // Limpiar errores previos
        setErrors({
            tipoVehiculo: "",
            tiempo: "",
            costo: ""
        });

        // Crear objeto tarifa
        const tarifaData = {
            tipoVehiculo: { id: tipoVehiculo ? parseInt(tipoVehiculo) : undefined },
            tiempo: tiempo ? parseInt(tiempo) : undefined,
            costo: costo ? parseFloat(costo) : undefined
        };

        // Si es edición, agregar el id
        if (esEdicion) {
            tarifaData.id = data.id;
        }

        try {
            // Validar con Yup
            await tarifaYup.validate(tarifaData, { abortEarly: false });
            
            // Cerrar modal temporalmente
            onClose();
            
            // Esperar un momento y mostrar confirmación
            setTimeout(async () => {
                const confirmResult = await sweetAlert({
                    title: "Confirmar " + (esEdicion ? "actualización" : "registro"),
                    text: esEdicion 
                        ? "¿Está seguro de actualizar esta tarifa?"
                        : "¿Está seguro de agregar esta nueva tarifa?",
                    icon: "question",
                    showDenyButton: true,
                    denyText: "Cancelar",
                    confirmText: esEdicion ? "Sí, actualizar" : "Sí, agregar",
                    showCloseButton: true,
                    reverseButtons: true,
                });

                if (!confirmResult.isConfirmed) {
                    // Si cancela, no hacer nada (el modal ya está cerrado)
                    return;
                }
                
                // Si confirmó, llamar a la función correspondiente
                const resultado = esEdicion 
                    ? await onActualizar(tarifaData)
                    : await onAgregar(tarifaData);
                
                if (resultado.success) {
                    // Limpiar campos después del éxito
                    setTipoVehiculo("");
                    setTiempo("");
                    setCosto("");
                    setErrors({
                        tipoVehiculo: "",
                        tiempo: "",
                        costo: ""
                    });
                    
                    // Mostrar alert de éxito
                    sweetAlert({
                        title: "¡Éxito!",
                        text: esEdicion 
                            ? "La tarifa se ha actualizado correctamente"
                            : "La tarifa se ha agregado correctamente",
                        icon: "success",
                        confirmText: "Aceptar",
                    });
                } else {
                    // Mostrar error
                    sweetAlert({
                        title: "Error",
                        text: resultado.error || (esEdicion 
                            ? "No se pudo actualizar la tarifa"
                            : "No se pudo agregar la tarifa"),
                        icon: "error"
                    });
                }
            }, 300);
            
        } catch (err) {
            // Si hay errores de validación de Yup
            if (err.name === "ValidationError") {
                const validationErrors = {};
                err.inner.forEach((error) => {
                    if (error.path === "tipoVehiculo.id" || error.path === "tipoVehiculo") {
                        validationErrors.tipoVehiculo = error.message;
                    } else {
                        validationErrors[error.path] = error.message;
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
            titulo={esEdicion ? "Editar tarifa" : "Registrar tarifa"}
            isOpen={showModal}
            handleClose={handleCancelar}
            isForm={true}
            onSubmit={handleAgregar}
            textSubmit={esEdicion ? "Actualizar" : "Agregar"}
            textCancel="Cancelar"
            maxWidth="xs"
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

            {/* Tiempo */}
            <CustomInputLabel
                labelText="Tiempo (minutos)"
                value={tiempo}
                onChange={(e) => setTiempo(e.target.value)}
                isObligatory={true}
                type="number"
                placeholder="30"
                min={15}
                max={1440}
                isWrong={!!errors.tiempo}
                errorMessage={errors.tiempo}
            />

            {/* Costo */}
            <CustomInputLabel
                labelText="Costo"
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
                isObligatory={true}
                type="number"
                placeholder="200"
                min={1}
                isWrong={!!errors.costo}
                errorMessage={errors.costo}
            />
        </CustomDialog>
    );
}