import React, { useState, useEffect } from "react";
import "./Editar.css";

import { NumericFormat } from "react-number-format";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EditarMesAcopIndividual({
  isActive,
  cambiarEstado,
  Registro,
}) {
  const handleClose = () => cambiarEstado(false);
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [mesAcop, setMesAcop] = useState();

  function SendData(e) {
    e.preventDefault();
    const url = "pages/editar/ihh_editarMesesAcopIndividual.php";
    const operationUrl = "ihh_editarMesesAcopIndividual";
    var data = {
      idAcopMes: mesAcop.idAcopMes,
      presupuestoMensual: mesAcop.presupuestoMensualUSD,
      presupuestoMensualMiscelaneo: mesAcop.presupuestoMensualMiscelaneoUSD,
      observaciones: mesAcop.observaciones,
      isActive: 1,
      usuarioModificacion: userData.usuario,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
      cambiarEstado(false);
    });
  }

  useEffect(
    function () {
      setMesAcop(Registro);
    },
    [Registro]
  );

  return mesAcop ? (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar mes ACOP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_presupuestoMensual">
                Presupuesto mensual (USD)
              </label>
              <NumericFormat
                placeholder="Escriba el presupuesto mensual en USD"
                className="form-control"
                name="input_presupuestoMensual"
                id="input_presupuestoMensual"
                value={mesAcop.presupuestoMensualUSD || ""}
                thousandSeparator={"."}
                prefix={"$"}
                onValueChange={(values) => {
                  const { value } = values;
                  setMesAcop((prevDatos) => ({
                    ...prevDatos,
                    presupuestoMensualUSD: parseFloat(value),
                  }));
                }}
                decimalSeparator=","
                required
                decimalScale={2}
                fixedDecimalScale={true}
              />
            </div>
            <div>
              <label htmlFor="input_presupuestoMensual">
                Presupuesto mensual misceláneo (USD)
              </label>
              <NumericFormat
                placeholder="Escriba el presupuesto mensual de misceláneo en USD"
                className="form-control"
                name="input_presupuestoMensual"
                id="input_presupuestoMensual"
                value={mesAcop.presupuestoMensualMiscelaneoUSD || ""}
                thousandSeparator={"."}
                prefix={"$"}
                onValueChange={(values) => {
                  const { value } = values;
                  setMesAcop((prevDatos) => ({
                    ...prevDatos,
                    presupuestoMensualMiscelaneoUSD: parseFloat(value),
                  }));
                }}
                decimalSeparator=","
                required
                decimalScale={2}
                fixedDecimalScale={true}
              />
            </div>
            <div>
              <label htmlFor="input_observaciones">
                Observaciones (opcional)
              </label>
              <textarea
                className="form-control"
                value={mesAcop.observaciones || ""}
              ></textarea>
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
  ) : (
    <></>
  );
}
