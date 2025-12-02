export const historialPagosColumns = [
    {
        field: "cantidadPago",
        label: "Costo pagado ($ MXN)",
        width: 150,
        render: (row) => {
            if (row.cantidadPago === null || row.cantidadPago === undefined) return "N/A";
            return `$${parseFloat(row.cantidadPago).toFixed(2)}`;
        },
    },
    {
        field: "fechaPago",
        label: "Fecha realización del pago",
        width: 200,
        render: (row) => {
            if (!row.fechaPago) return "N/A";
            const date = new Date(row.fechaPago + 'T00:00:00');
            return date.toLocaleDateString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit" });
        },
    },
    {
        field: "fechaInicio",
        label: "Fecha de inicio",
        width: 100,
        render: (row) => {
            if (!row.fechaInicio) return "N/A";
            const date = new Date(row.fechaInicio + 'T00:00:00');
            return date.toLocaleDateString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit" });
        },
    },
    {
        field: "fechaFin",
        label: "Fecha finalización",
        width: 100,
        render: (row) => {
            if (!row.fechaFin) return "N/A";
            const date = new Date(row.fechaFin + 'T00:00:00');
            return date.toLocaleDateString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit" });
        },
    },
];