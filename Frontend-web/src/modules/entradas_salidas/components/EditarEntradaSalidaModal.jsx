import React, { useState, useEffect } from "react";
import { Grid, Button, Box, Typography } from "@mui/material";
import CustomDialog from "../../../components/CustomDialog";
import CustomInputLabel from "../../../components/inputs/CustomInputLabel";
import CustomInputSelect from "../../../components/inputs/CustomInputSelect";
import CustomTextArea from "../../../components/inputs/CustomTextArea";
import { entradaSalidaEditarSchema } from "../../../models/yup/entradaSalidaYup.js";
import sweetAlert from "../../../utils/sweetAlert";

// Función para formatear hora en formato legible (HH:MM am/pm)
const formatearHora = (horaString) => {
    if (!horaString) return "";

    const [horas, minutos] = horaString.split(':');
    let hora = parseInt(horas);
    const min = minutos;
    const periodo = hora >= 12 ? 'pm' : 'am';

    if (hora > 12) hora -= 12;
    if (hora === 0) hora = 12;

    return `${hora}:${min} ${periodo}`;
};

const EditarEntradaSalidaModal = ({
    open,
    onClose,
    entrada,
    onActualizar,
    onMarcarSalida,
    tiposVehiculos = [],
}) => {
    const [formData, setFormData] = useState({
        id: 0,
        modelo: "",
        placa: "",
        horaEntrada: "",
        horaSalida: "",
        descripcion: "",
    });

    const [tipoVehiculo, setTipoVehiculo] = useState("");

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (entrada) {
            setFormData({
                id: entrada.vehiculo?.id || "",
                modelo: entrada.vehiculo?.modelo || "",
                placa: entrada.vehiculo?.placa || "",
                horaEntrada: formatearHora(entrada.horaEntrada) || "",
                horaSalida: formatearHora(entrada.horaSalida) || "",
                descripcion: entrada.vehiculo?.descripcion || "",
            });
            setTipoVehiculo(entrada.tipoVehiculo?.id?.toString() || "");
        }
    }, [entrada]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Limpiar error del campo
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleActualizar = async (e) => {
        e.preventDefault();

        try {
            // Validar datos
            await entradaSalidaEditarSchema.validate(formData, { abortEarly: false });

            // Cerrar modal antes de mostrar confirmación
            onClose();

            // Mostrar confirmación
            setTimeout(async () => {
                const result = await sweetAlert({
                    title: "¿Confirmar actualización?",
                    text: "¿Estás seguro de actualizar los datos de esta entrada?",
                    icon: "question",
                    showCancelButton: true,
                    reverseButtons: true
                });

                if (result.isConfirmed) {
                    // Preparar datos para enviar (solo datos del vehículo)
                    const datosActualizar = {
                        vehiculo: {
                            id: formData.id || null,
                            modelo: formData.modelo || null,
                            placa: formData.placa || null,
                            descripcion: formData.descripcion || null,
                            tipoVehiculo: { id: tipoVehiculo ? parseInt(tipoVehiculo) : undefined }
                        },
                        tipoVehiculo: { id: tipoVehiculo ? parseInt(tipoVehiculo) : undefined },
                    };

                    await onActualizar(entrada.id, datosActualizar);
                }
            }, 300);
        } catch (error) {
            if (error.name === "ValidationError") {
                const validationErrors = {};
                error.inner.forEach((err) => {
                    validationErrors[err.path] = err.message;
                });
                setErrors(validationErrors);
            } else {
                console.error("Error al actualizar entrada:", error);
                onClose();
                setTimeout(() => {
                    sweetAlert({
                        title: "Error",
                        text: "Ocurrió un error al actualizar la entrada",
                        icon: "error",
                    });
                }, 300);
            }
        }
    };

    const handleMarcarSalida = () => {
        // Cerrar modal y llamar función para abrir modal de confirmación
        onClose();
        onMarcarSalida(entrada);
    };

    const handleCancel = () => {
        setFormData({
            modelo: "",
            placa: "",
            horaEntrada: "",
            horaSalida: "",
            descripcion: "",
        });
        setTipoVehiculo("");
        setErrors({});
        onClose();
    };

    return (
        <CustomDialog
            isOpen={open}
            handleClose={handleCancel}
            titulo="Editar entrada/salida"
            maxWidth="sm"
            isForm={true}
            onSubmit={handleActualizar}
            textSubmit="Actualizar"
            textCancel="Cancelar"
        >
            {/* Folio de reconocimiento - Solo lectura */}
            <Box sx={{ mb: 2 }}>
                <CustomInputLabel
                    labelText="Folio de reconocimiento"
                    name="folioTicket"
                    value={entrada?.folioTicket || ""}
                    isDisabled={true}
                />
            </Box>

            {/* Tipo de vehículo - Select editable */}
            <Box sx={{ mb: 2 }}>
                <CustomInputSelect
                    labelText="Tipo de vehículo"
                    name="tipoVehiculo"
                    value={tipoVehiculo}
                    onChange={(e) => setTipoVehiculo(e.target.value)}
                    isObligatory={true}
                    options={tiposVehiculos}
                    setPlaceholder={false}
                />
            </Box>


            {/* Modelo y Placa en la misma fila */}
            <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                    <CustomInputLabel
                        labelText="Modelo"
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleChange}
                        isWrong={!!errors.modelo}
                        errorMessage={errors.modelo}
                    />
                </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                    <CustomInputLabel
                        labelText="Placa"
                        name="placa"
                        value={formData.placa}
                        onChange={handleChange}
                        isWrong={!!errors.placa}
                        errorMessage={errors.placa}
                    />
                </Box>
            </Grid>

            {/* Hora de entrada y salida en la misma fila */}
            <Grid container spacing={2} sx={{ mb: 0 }} columns={2}>
                <Grid>
                    <Box sx={{ mb: 2 }}>
                        <CustomInputLabel
                            labelText="Hora de entrada"
                            name="horaEntrada"
                            value={formData.horaEntrada}
                            isDisabled={true}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                        <CustomInputLabel
                            labelText="Hora de salida"
                            name="horaSalida"
                            value={formData.horaSalida}
                            isDisabled={true}
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* Botón marcar salida - Solo si no hay hora de salida */}
            {!entrada?.horaSalida && (
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleMarcarSalida}
                    sx={{
                        backgroundColor: "#5FB4A2",
                        color: "#fff",
                        mb: 2,
                        "&:hover": {
                            backgroundColor: "#4A9080",
                        },
                    }}
                >
                    Marcar salida
                </Button>
            )}

            {/* Descripción */}
            <CustomTextArea
                labelText="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                isWrong={!!errors.descripcion}
                errorMessage={errors.descripcion}
                rows={3}
            />
        </CustomDialog>
    );
};

export default EditarEntradaSalidaModal;
