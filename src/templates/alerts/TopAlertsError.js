import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function TopAlertsError(cod, msj) {
    const MySwal = withReactContent(Swal);

    if (cod === '00') {
        return MySwal.fire({
            // title: "Debes seleccionar al menos 2 clientes",
            text: "Success.",
            icon: "success",
            showConfirmButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Ok',
        });
    } else {
        return MySwal.fire({
            // title: "Debes seleccionar al menos 2 clientes",
            text: msj,
            icon: "warning",
            showConfirmButton: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Ok',
        });
    }


}
