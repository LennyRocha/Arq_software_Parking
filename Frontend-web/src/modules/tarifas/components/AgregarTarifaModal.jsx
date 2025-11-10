import React, { useState } from "react";
import CustomDialog from "../../../components/CustomDialog";
import CustomInputLabel from "../../../components/inputs/CustomInputLabel";
import CustomInputSelect from "../../../components/inputs/CustomInputSelect";
import tarifaYup from "../../../models/yup/tarifaYup";
import sweetAlert from "../../../utils/sweetAlert";

export default function AgregarTarifaModal({
    showModal,
    tiposVehiculos,
    onClose,
    onAgregar
}) {
    const [tipoVehiculo, setTipoVehiculo] = useState("");
    const [tiempo, setTiempo] = useState("");
    const [costo, setCosto] = useState("");
    
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
        console.log("handleAgregar llamado");
        
        // Limpiar errores previos
        setErrors({
            tipoVehiculo: "",
            tiempo: "",
            costo: ""
        });

        // Crear objeto tarifa
        const nuevaTarifa = {
            tipoVehiculo: { id: tipoVehiculo ? parseInt(tipoVehiculo) : undefined },
            tiempo: tiempo ? parseInt(tiempo) : undefined,
            costo: costo ? parseFloat(costo) : undefined
        };

        console.log("Datos de tarifa:", nuevaTarifa);

        try {
            // Validar con Yup
            await tarifaYup.validate(nuevaTarifa, { abortEarly: false });
            
            console.log("Validación exitosa");
            
            // Si la validación pasa, llamar a la función de agregar
            const resultado = await onAgregar(nuevaTarifa);
            
            console.log("Resultado:", resultado);
            
            if (resultado.success) {
                // Cerrar modal primero
                handleCancelar();
                // Mostrar alert después de cerrar
                setTimeout(() => {
                    sweetAlert({
                        title: "¡Éxito!",
                        text: "La tarifa se ha agregado correctamente",
                        icon: "success",
                        confirmText: "Aceptar",
                    });
                }, 300);
            } else {
                // Cerrar modal primero también en error
                handleCancelar();
                setTimeout(() => {
                    sweetAlert({
                        title: "Error",
                        text: resultado.error || "No se pudo agregar la tarifa",
                        icon: "error"
                    });
                }, 300);
            }
        } catch (err) {
            console.log("Error capturado:", err);
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
                console.log("Errores de validación:", validationErrors);
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
            titulo="Registrar tarifa"
            isOpen={showModal}
            handleClose={handleCancelar}
            isForm={true}
            onSubmit={handleAgregar}
            textSubmit="Agregar"
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