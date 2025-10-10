import * as yup from "yup";

const vehicleYup = yup.object({
  id: yup.number(),
  id_user: yup.number(),
  id_type: yup.number(),
  placa: yup.string(),
  desc: yup.string(),
  status: yup.boolean()
});

export default vehicleYup;
