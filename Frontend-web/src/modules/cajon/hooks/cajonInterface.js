//Interfaz de endpoints de tipos de pensión
const prefix = "/api/cajones";

const cajonInterface = {
    getAll(sort, query, page, size) {

        const params = new URLSearchParams();

        if (query.trim() !== "") params.append("query", query);
        if (sort.trim() !== "") params.append("sort", sort);
        params.append("page", page);
        params.append("pageSize", size);
        return `${prefix}?${params.toString()}`;
    },

    byId: function (id) {
        return `${prefix}/${id}`;
    },

    postIt: function () {
        return prefix;
    },

    postMany: function () {
        return `${prefix}/varios`
    },

    contar: function () {
        return `${prefix}/contar`
    },

    reservar: function () {
        return `${prefix}/reservar`
    }
};

export default cajonInterface;