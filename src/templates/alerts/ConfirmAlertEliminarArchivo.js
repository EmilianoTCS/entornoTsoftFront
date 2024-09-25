import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
export default function ConfirmAlertEliminarArchivo() {
  const MySwal = withReactContent(Swal);
  const promise1 = new Promise((resolve, reject) => {
    MySwal.fire({
      title: "¿Deseas eliminar este archivo?",
      html: "El archivo será eliminado y esta acción no se puede deshacer",
      icon: "warning",
      iconColor: "#e10b1c",
      showConfirmButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "red",
      showCancelButton: true,
      cancelButtonColor: "dark-gray",
      cancelButtonText: "Cancelar",
    }).then((response) => {
      if (response.isConfirmed) {
        resolve(true);
      }
    });
  });
  return promise1;
}
