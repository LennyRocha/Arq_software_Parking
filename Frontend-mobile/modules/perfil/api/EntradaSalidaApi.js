import api from "../../../utils/api";
export const searchEntradasSalidasPensionadoPaginated = ({
    search = null,
    sortBy = "fecha",
    sortOrder = "asc",
    page = 0,
    size = 10
}) => {
    const params = {
        search,
        sortBy,
        sortOrder,
        page,
        size
    };

    return api.get("/entrada-salida/pensionado/search/paginated", { params });
};