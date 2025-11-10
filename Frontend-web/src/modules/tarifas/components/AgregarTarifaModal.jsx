import React, { useState } from "react";
import CustomDialog from "../../../components/CustomDialog";
import CustomInputLabel from "../../../components/inputs/CustomInputLabel";
import CustomInputSelect from "../../../components/inputs/CustomInputSelect";

export default function AgregarTarifaModal({
    showModal,
    tiposVehiculos,
    onClose
}) {
    const [tipoVehiculo, setTipoVehiculo] = useState("");
    const [tiempo, setTiempo] = useState("");
    const [costo, setCosto] = useState("");

    const handleCancelar = () => {
        // Limpiar campos
        setTipoVehiculo("");
        setTiempo("");
        setCosto("");
        onClose();
    };

    const handleAgregar = (e) => {
        e.preventDefault();
        // Aquí iría la lógica de agregar
        console.log({ tipoVehiculo, tiempo, costo });
        handleCancelar();
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
            />

            {/* Tiempo */}
            <CustomInputLabel
                labelText="Tiempo (minutos)"
                value={tiempo}
                onChange={(e) => setTiempo(e.target.value)}
                isObligatory={true}
                type="number"
                placeholder="30"
                min={0}
            />

            {/* Costo */}
            <CustomInputLabel
                labelText="Costo"
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
                isObligatory={true}
                type="number"
                placeholder="200"
                min={0}
            />
        </CustomDialog>
    );
}