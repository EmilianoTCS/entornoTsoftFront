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
  const [porcMiscelaneo, setPorcMiscelaneo] = useState([]);
  const hoy = new Date();

  function validaciones() {
    if (acop.numAcop <= 0) {
      TopAlertsError("01", "El número del ACOP debe ser mayor a cero");
      return true;
    } else if (acop.nomAcop.trim() === "") {
      TopAlertsError("02", "El nombre del ACOP no debe estar vacío");
      return true;
    } else if (new Date(acop.fechaIni) > new Date(acop.fechaFin)) {
      TopAlertsError(
        "03",
        "La fecha inicio no puede ser mayor a la fecha término"
      );
      return true;
    } else if (acop.valorUSD <= 0) {
      TopAlertsError("04", "El valor de USD debe ser mayor a cero");
      return true;
    } else if (new Date(acop.fechaValorUSD) > hoy) {
      TopAlertsError(
        "05",
        "La fecha del valor USD no puede ser mayor a la actual"
      );
      return true;
    } else if (acop.presupuestoGeneral <= 0) {
      TopAlertsError("06", "El presupuesto total debe ser mayor a cero");
      return true;
    } else if (acop.presupuestoTotal <= 0) {
      TopAlertsError("07", "El presupuesto operacional debe ser mayor a cero");
      return true;
    } else if (
      parseFloat(acop.presupuestoTotal) > parseFloat(acop.presupuestoGeneral)
    ) {
      TopAlertsError(
        "08",
        "El presupuesto operacional no debe ser mayor al presupuesto general"
      );
      return true;
    } else {
      return false;
    }
  }

  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/editar/ihh_editarAcop.php";
      const operationUrl = "ihh_editarAcop";
      var data = {
        idAcop: acop.idAcop,
        numAcop: acop.numAcop,
        nomAcop: acop.nomAcop,
        fechaIni: acop.fechaIni,
        fechaFin: acop.fechaFin,
        valorUSD: acop.valorUSD,
        fechaValorUSD: acop.fechaValorUSD,
        presupuestoTotal: acop.presupuestoTotal,
        presupuestoGeneral: acop.presupuestoGeneral,
        isActive: 1,
        usuarioModificacion: userData.usuario,
      };
      console.log(data);

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
  }

  function convertirFormatoFecha(dateStr) {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  }

  function getPorcMiscelaneo() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "ACOPS",
      subTipoConfDato: "PORC_MISCELANEO",
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setPorcMiscelaneo(parseFloat(response[0].datoVisible));
    });
  }
  useEffect(
    function () {
      if (Registro) {
        Registro.fechaIni = convertirFormatoFecha(Registro.fechaIni);
        Registro.fechaFin = convertirFormatoFecha(Registro.fechaFin);
        Registro.fechaValorUSD = convertirFormatoFecha(Registro.fechaValorUSD);
      }
      setAcop(Registro);
      getPorcMiscelaneo();
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
              <label htmlFor="input_nombreAcop">Número del ACOP:</label>
              <input
                type="number"
                className="form-control"
                name="input_nombreAcop"
                id="input_nombreAcop"
                value={acop.numAcop || ""}
                onChange={({ target }) => {
                  setAcop((prevDatos) => ({
                    ...prevDatos,
                    numAcop: target.value,
                  }));
                }}
                required
              />
            </div>
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "65%" }}>
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
              <div style={{ width: "34%" }}>
                <label htmlFor="input_fechaValorUSD">Fecha Valor USD</label>
                <input
                  type="date"
                  className="form-control"
                  name="input_fechaValorUSD"
                  value={acop.fechaValorUSD || ""}
                  id="input_fechaValorUSD"
                  onChange={({ target }) =>
                    setAcop((prevDatos) => ({
                      ...prevDatos,
                      fechaValorUSD: target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            {/* ppto total */}
            <div>
              <label htmlFor="input_presupuestoTotal">
                Presupuesto total (USD)
              </label>
              <NumericFormat
                placeholder="Escriba el presupuesto total en USD"
                className="form-control"
                name="input_presupuestoTotal"
                id="input_presupuestoTotal"
                thousandSeparator={"."}
                prefix={"$"}
                value={acop.presupuestoGeneral || ""}
                onValueChange={(values) => {
                  const { value } = values;
                  setAcop((prevDatos) => ({
                    ...prevDatos,
                    presupuestoGeneral: parseFloat(value),
                  }));
                }}
                decimalSeparator=","
                required
                decimalScale={2}
                fixedDecimalScale={true}
              />
              <label style={{ opacity: "0.6" }}>
                {!isNaN(parseFloat(acop.presupuestoGeneral * acop.valorUSD)) ? (
                  <>
                    (En CLP: &nbsp;
                    {parseFloat(
                      acop.presupuestoGeneral * acop.valorUSD
                    ).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    )
                  </>
                ) : null}
              </label>
            </div>
            {/* ppto operacional  */}
            <div>
              <label htmlFor="input_presupuestoTotal">
                Presupuesto operacional (USD)
              </label>
              <NumericFormat
                placeholder="Escriba el presupuesto operacional en USD"
                className="form-control"
                name="input_presupuestoOperacional"
                id="input_presupuestoOperacional"
                thousandSeparator={"."}
                prefix={"$"}
                value={acop.presupuestoTotal || ""}
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
              <label style={{ opacity: "0.6" }}>
                {!isNaN(parseFloat(acop.presupuestoTotal * acop.valorUSD)) ? (
                  <>
                    (En CLP: &nbsp;
                    {parseFloat(
                      acop.presupuestoTotal * acop.valorUSD
                    ).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    )
                  </>
                ) : null}
              </label>
            </div>
            <br />
                        {/* margen y rentab */}
                        <div
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "11pt",
                gap: "15px",
              }}
            >
              <label style={{ opacity: "0.8" }}>
                {!isNaN(
                  parseFloat(acop.presupuestoGeneral - acop.presupuestoTotal)
                ) ? (
                  <>
                    (Margen en USD: &nbsp;
                    {parseFloat(
                      acop.presupuestoGeneral - acop.presupuestoTotal
                    ).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    )
                  </>
                ) : null}
              </label>
              <label style={{ opacity: "0.8" }}>
                {!isNaN(
                  parseFloat(
                    ((acop.presupuestoGeneral - acop.presupuestoTotal) *
                      100) /
                      acop.presupuestoGeneral
                  )
                ) ? (
                  <>
                    (Rentab esperada: &nbsp;
                    {parseFloat(
                      ((acop.presupuestoGeneral - acop.presupuestoTotal) *
                        100) /
                        acop.presupuestoGeneral
                    )}
                    % )
                  </>
                ) : null}
              </label>
            </div>
            {/* ppto hh */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "11pt",
                gap: "15px",
              }}
            >
              <label style={{ opacity: "0.8" }}>
                {!isNaN(
                  parseFloat(
                    acop.presupuestoTotal -
                      acop.presupuestoTotal * porcMiscelaneo
                  )
                ) ? (
                  <>
                    (Ppto. HH en USD: &nbsp;
                    {parseFloat(
                      acop.presupuestoTotal -
                        acop.presupuestoTotal * porcMiscelaneo
                    ).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    )
                  </>
                ) : null}
              </label>
              <label style={{ opacity: "0.8" }}>
                {!isNaN(
                  parseFloat(
                    acop.presupuestoTotal -
                      acop.presupuestoTotal * porcMiscelaneo
                  )
                ) ? (
                  <>
                    (Ppto. HH en CLP: &nbsp;
                    {parseFloat(
                      (acop.presupuestoTotal -
                        acop.presupuestoTotal * porcMiscelaneo) *
                        acop.valorUSD
                    ).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    )
                  </>
                ) : null}
              </label>
            </div>
            {/* ppto misc */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "11pt",
                gap: "10px",
              }}
            >
              <label style={{ opacity: "0.8" }}>
                {!isNaN(parseFloat(acop.presupuestoTotal * porcMiscelaneo)) ? (
                  <>
                    (Ppto. Misc en USD: &nbsp;
                    {parseFloat(
                      acop.presupuestoTotal * porcMiscelaneo
                    ).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    )
                  </>
                ) : null}
              </label>
              <label style={{ opacity: "0.8" }}>
                {!isNaN(parseFloat(acop.presupuestoTotal * porcMiscelaneo)) ? (
                  <>
                    (Ppto. Misc en CLP: &nbsp;
                    {parseFloat(
                      acop.presupuestoTotal * porcMiscelaneo * acop.valorUSD
                    ).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    )
                  </>
                ) : null}
              </label>
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
