import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function TopAlertsError(cod, msj) {
  const MySwal = withReactContent(Swal);

  if (cod === "00") {
    return MySwal.fire({
      title: "Operación exitosa",
      icon: "success",
      position: "top-right",
      timer: 1000,
      toast: true,
      showConfirmButton: false,
      timerProgressBar: true,
    }).then(function () {
      location.reload();
    });
  } else {
    return MySwal.fire({
      title: "Error " + cod,
      text: msj,
      icon: "error",
      showConfirmButton: true,
      confirmButtonText: '<i class="fa fa-thumbs-up"></i> Ok',
    });
  }
}
