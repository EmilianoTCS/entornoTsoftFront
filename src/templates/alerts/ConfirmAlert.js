import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
export default function ConfirmAlert(text) {
  const MySwal = withReactContent(Swal);
  const promise1 = new Promise((resolve, reject) => {
    MySwal.fire({
      title: "¿Deseas desactivar este registro?",
      html: 'El archivo será desactivado permanentemente, para restablecer el archivo deberá contactar a un administrador',
      icon: "warning",
      iconColor: "#e10b1c",
      showConfirmButton: true,
      confirmButtonText: "Desactivar",
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
