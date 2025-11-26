import MainHeader from "../../../components/MainHeader";
import LoadingBackdrop from "../../../components/LoadingBackdrop";

const links = [
  { nombre: "Pensiones", ruta: "/admin/tipos_de_pension", disabled: false },
  {
    nombre: "Tipos de pensión",
    ruta: "/admin/tipos_de_pension",
    disabled: true,
  },
];

export default function UsuarioTablaAdmin() {


  return (
    <>
      <MainHeader titulo="USUARIOS" breads={links} />

    
    </>
    
  );
}
