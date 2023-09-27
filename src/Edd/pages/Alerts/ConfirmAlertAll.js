import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
export default function ConfirmAlertAll(title, text, icon) {
  const MySwal = withReactContent(Swal);
  const promise1 = new Promise((resolve, reject) => {
    
    MySwal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Continuar",
    }).then((response) => {
      if (response.isConfirmed) {
        resolve(true);
      }
    });
  });
  return promise1;
}
  //   if (loadedData) {
  //     Swal.fire({
  //       html: `
  //       <p>Gracias por llenar el formulario.</p>
  //       `,
  //       icon: "success",
  //       showCancelButton: false,
  //       confirmButtonColor: "#3085d6",
  //       confirmButtonText: "Continuar",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         window.history.back()
  //       }
  //     });
  //   }