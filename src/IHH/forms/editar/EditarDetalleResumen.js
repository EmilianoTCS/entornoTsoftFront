import React, { useState, useEffect } from "react";
import "./Editar.css";

import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EditarDetalleResumen({
  isActive,
  cambiarEstado,
  mes,
  presupuestoMensual,
  idResumenPerProy,
}) {
  const handleClose = () => cambiarEstado(false);
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  // Convertir el presupuestoMensual a un número flotante
  let parsePresupuestoMensual = parseFloat(presupuestoMensual);

  const [nuevoPresupuestoMensual, setPresupuestoMensual] = useState({
    presupuestoMensual: parsePresupuestoMensual,
    idResumenPerProy: idResumenPerProy,
  });

  const formatCurrency = (value) => {
    // Convertir la cadena en un número flotante
    const number = parseFloat(value);
    if (isNaN(number)) return "";
    
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const handlePresupuestoTotalChange = (e) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9.]/g, ""); // Remover caracteres no numéricos excepto el punto decimal
    const formattedValue = formatCurrency(numericValue); // Formatear el valor a moneda
    setPresupuestoMensual((prevState) => ({
      ...prevState,
      presupuestoMensual: parseFloat(numericValue),
    }));
    e.target.value = formattedValue; // Actualizar el valor del input con el formato de moneda
  };

  function convertirFecha(fechaString) {
    if (fechaString) {
      // Extraer el año y el mes del string
      const anio = fechaString.slice(0, 4);
      const mesNumero = fechaString.slice(4);

      // Convertir el mes a nombre
      const meses = [
        "ENERO",
        "FEBRERO",
        "MARZO",
        "ABRIL",
        "MAYO",
        "JUNIO",
        "JULIO",
        "AGOSTO",
        "SEPTIEMBRE",
        "OCTUBRE",
        "NOVIEMBRE",
        "DICIEMBRE",
      ];
      const mesNombre = meses[parseInt(mesNumero) - 1];

      // Formatear la fecha en el formato deseado
      const fechaFormateada = mesNombre + " " + anio;

      return fechaFormateada;
    }
  }

  function SendData(e) {
    e.preventDefault();
    const url = "pages/editar/ihh_editarResumenPeriodo.php";
    const operationUrl = "ihh_editarResumenPeriodo";
    const data = {
      presupuestosCambiados: [nuevoPresupuestoMensual],
      usuarioModificacion: userData.usuario, // filtra los elementos vacíos
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
      cambiarEstado(false);
    });
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>
            Editar presupuesto mensual - {convertirFecha(mes)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_presupuestoTotal">
                Nuevo presupuesto mensual:
              </label>
              <input
                placeholder="Presupuesto mensual"
                type="text"
                className="form-control"
                id="input_presupuestoMensual"
                defaultValue={formatCurrency(
                  parsePresupuestoMensual.toString()
                )}
                onChange={handlePresupuestoTotalChange}
                required
              />
            </div>
            <Button
              variant="secondary"
              type="submit"
              id="btn_registrar"
              value="Registrar"
            >
              Registrar
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
