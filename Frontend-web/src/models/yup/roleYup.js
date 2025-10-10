import * as yup from "yup";

const roleYup = yup.object({
  id: yup.number(),
  name: yup.string(),
});

export default roleYup;