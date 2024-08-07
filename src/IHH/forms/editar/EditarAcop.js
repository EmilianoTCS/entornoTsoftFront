import React, { useState, useEffect } from "react";
import "./Editar.css";

import { NumericFormat } from "react-number-format";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EditarMesAcop from "./EditarMesAcop";

export default function EditarAcop({ isActive, cambiarEstado, Registro }) {
  const handleClose = () => cambiarEstado(false);
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [isActiveFormularioPresupuesto, setisActiveFormularioPresupuesto] =
    useState(false);
  const [acop, setAcop] = useState();
  const [datosMesesAcop, setDatosMesesAcop] = useState([""]);

  function SendData(e) {
    e.preventDefault();
    const url = "pages/editar/ihh_editarAcop.php";
    const operationUrl = "ihh_editarAcop";
    var data = {
      idAcop: acop.idAcop,
      nomAcop: acop.nomAcop,
      fechaIni: acop.fechaIni,
      fechaFin: acop.fechaFin,
      valorUSD: acop.valorUSD,
      presupuestoTotal: acop.presupuestoTotal,
      isActive: 1,
      usuarioModificacion: userData.usuario,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);

      if (datos.idacopmes && !isActiveFormularioPresupuesto) {
        setisActiveFormularioPresupuesto(true);
        setDatosMesesAcop(response);
        cambiarEstado(false);
      }
    });
  }

  function convertirFormatoFecha(dateStr) {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  }

  useEffect(
    function () {
      if (Registro) {
        Registro.fechaIni = convertirFormatoFecha(Registro.fechaIni);
        Registro.fechaFin = convertirFormatoFecha(Registro.fechaFin);
      }
      setAcop(Registro);
    },
    [Registro]
  );

  return acop ? (
    <>
      {isActiveFormularioPresupuesto ? (
        <EditarMesAcop
          cambiarEstado={setisActiveFormularioPresupuesto}
          mesesAcop={datosMesesAcop}
          isActiveFormulario={isActiveFormularioPresupuesto}
        />
      ) : null}

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar ACOP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreAcop">Nombre del ACOP:</label>
              <input
                style={{ textTransform: "uppercase" }}
                type="text"
                className="form-control"
                name="input_nombreAcop"
                id="input_nombreAcop"
                value={acop.nomAcop || ""}
                onChange={({ target }) => {
                  setAcop((prevDatos) => ({
                    ...prevDatos,
                    nomAcop: target.value,
                  }));
                }}
                required
              />
            </div>
            <div>
              <label htmlFor="input_fechaIniAcop">Fecha inicio del ACOP:</label>
              <input
                type="date"
                className="form-control"
                name="input_fechaIniAcop"
                id="input_fechaIniAcop"
                value={acop.fechaIni || ""}
                onChange={({ target }) => {
                  setAcop((prevDatos) => ({
                    ...prevDatos,
                    fechaIni: target.value,
                  }));
                }}
                required
              />
            </div>
            <div>
              <label htmlFor="input_fechaFinAcop">Fecha fin del ACOP:</label>
              <input
                type="date"
                className="form-control"
                name="input_fechaFinAcop"
                value={acop.fechaFin || ""}
                id="input_fechaFinAcop"
                onChange={({ target }) => {
                  setAcop((prevDatos) => ({
                    ...prevDatos,
                    fechaFin: target.value,
                  }));
                }}
                required
              />
            </div>
            <div>
              <label htmlFor="input_valorUSD">Valor USD (CLP)</label>
              <NumericFormat
                placeholder="Escriba el valor del dólar en CLP"
                className="form-control"
                name="input_valorUSD"
                value={acop.valorUSD || ""}
                id="input_valorUSD"
                thousandSeparator={"."}
                prefix={"$"}
                onValueChange={(values) => {
                  const { value } = values;
                  setAcop((prevDatos) => ({
                    ...prevDatos,
                    valorUSD: parseFloat(value),
                  }));
                }}
                decimalSeparator=","
                required
                decimalScale={2}
                fixedDecimalScale={true}
              />
            </div>
            <div>
              <label htmlFor="input_presupuestoTotal">
                Presupuesto total (USD)
              </label>
              <NumericFormat
                placeholder="Escriba el presupuesto total en USD"
                className="form-control"
                name="input_presupuestoTotal"
                id="input_presupuestoTotal"
                value={acop.presupuestoTotal || ""}
                thousandSeparator={"."}
                prefix={"$"}
                onValueChange={(values) => {
                  const { value } = values;
                  setAcop((prevDatos) => ({
                    ...prevDatos,
                    presupuestoTotal: parseFloat(value),
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
  ) : (
    <></>
  );
}
