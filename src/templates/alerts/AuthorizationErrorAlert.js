import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./sweetAlerts.css";
export default function AuthorizationError() {
  const MySwal = withReactContent(Swal);

  MySwal.fire({
    title: "Acceso no autorizado.",
    text: "No tienes los permisos para acceder a este sitio. \n Serás redireccionado a la página anterior.",
    icon: "error",
    timer: 8000,
    timerProgressBar: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    confirmButtonColor: "red",
    showConfirmButton: false,
    timerProgressBar: true,
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      // history.back();
    }
  });
}
