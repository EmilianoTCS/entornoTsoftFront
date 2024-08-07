import React, { useState, useEffect } from "react";
import "./Editar.css";

import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { NumericFormat } from "react-number-format";

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
  let idResumen = idResumenPerProy;

  const [nuevoPresupuestoMensual, setPresupuestoMensual] = useState({
    presupuestoMensualUSD: parsePresupuestoMensual,
    idresumenperproy: idResumen,
  });

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
      usuarioModificacion: userData.usuario,
    };
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
            Editar presupuesto mensual <br></br> {convertirFecha(mes)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_presupuestoTotal">
                Presupuesto total (USD)
              </label>
              <NumericFormat
                placeholder="Escriba el presupuesto total en USD"
                className="form-control"
                name="input_presupuestoTotal"
                id="input_presupuestoTotal"
                value={parsePresupuestoMensual || ""}
                thousandSeparator={"."}
                prefix={"$"}
                onValueChange={(values) => {
                  const { value } = values;
                  setPresupuestoMensual((prevDatos) => ({
                    ...prevDatos,
                    presupuestoMensual: parseFloat(value),
                  }));
                }}
                decimalSeparator=","
                required
                decimalScale={2}
                fixedDecimalScale={true}
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
