//Interfaz de endpoints de tipos de pensión
const prefix = "/api/vehiculos";

const vehiculoInterface = {
    getAllByUser(id, query, carid, active = null, placas = null) {

        const params = new URLSearchParams();

        if (query.trim() !== "") params.append("query", query);
        if (carid) params.append("carid", carid);

        if (active !== null) {
            params.append("active", active);
        }
        if (placas !== null) {
            params.append("placas", placas);
        }

        return `${prefix}/usuario/${id}?${params.toString()}`;
    },

    byId: function (id) {
        return `${prefix}/${id}`;
    },

    postIt: function () {
        return prefix;
    },

    myVehics: function () {
        return `${prefix}/mis-vehiculos`
    },

    check: function () {
        return `${prefix}/estacionado/verificar`;
    },
};

export default vehiculoInterface;