import React, { useState } from "react";
import "./Insertar.css";
import { NumericFormat } from "react-number-format";

import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EditarMesAcop from "../editar/EditarMesAcop";
import { useEffect } from "react";

export default function InsertarAcop({ isActive, cambiarEstado }) {
  const handleClose = () => cambiarEstado(false);
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [datosMesesAcop, setDatosMesesAcop] = useState([]);
  const [porcMiscelaneo, setPorcMiscelaneo] = useState([]);
  const [isActiveFormularioPresupuesto, setisActiveFormularioPresupuesto] =
    useState(false);
  const hoy = new Date();

  const [datos, setDatos] = useState({
    nomAcop: "",
    numAcop: "",
    fechaIni: "",
    fechaFin: "",
    valorUSD: "",
    fechaValorUSD: "",
    presupuestoTotal: "",
    presupuestoGeneral: "",
    isActive: 1,
    usuarioCreacion: userData.usuario,
  });

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

  function validaciones() {
    if (datos.numAcop <= 0) {
      TopAlertsError("01", "El número del ACOP debe ser mayor a cero");
      return true;
    } else if (datos.nomAcop.trim() === "") {
      TopAlertsError("02", "El nombre del ACOP no debe estar vacío");
      return true;
    } else if (new Date(datos.fechaIni) > new Date(datos.fechaFin)) {
      TopAlertsError(
        "03",
        "La fecha inicio no puede ser mayor a la fecha término"
      );
      return true;
    } else if (datos.valorUSD <= 0) {
      TopAlertsError("04", "El valor de USD debe ser mayor a cero");
      return true;
    } else if (new Date(datos.fechaValorUSD) > hoy) {
      TopAlertsError(
        "05",
        "La fecha del valor USD no puede ser mayor a la actual"
      );
      return true;
    } else if (datos.presupuestoGeneral <= 0) {
      TopAlertsError("06", "El presupuesto total debe ser mayor a cero");
      return true;
    } else if (datos.presupuestoTotal <= 0) {
      TopAlertsError("07", "El presupuesto operacional debe ser mayor a cero");
      return true;
    } else if (
      parseFloat(datos.presupuestoTotal) > parseFloat(datos.presupuestoGeneral)
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
      const url = "pages/insertar/ihh_insertarAcop.php";
      const operationUrl = "ihh_insertarAcop";
      var data = {
        numAcop: datos.numAcop,
        nomAcop: datos.nomAcop,
        fechaIni: datos.fechaIni,
        fechaFin: datos.fechaFin,
        valorUSD: datos.valorUSD,
        fechaValorUSD: datos.fechaValorUSD,
        presupuestoGeneral: datos.presupuestoGeneral,
        presupuestoTotal: datos.presupuestoTotal,
        isActive: datos.isActive,
        usuarioCreacion: datos.usuarioCreacion,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);

        if (datos.idacopmes && !isActiveFormularioPresupuesto) {
          console.log("response", response);
          setisActiveFormularioPresupuesto(true);
          setDatosMesesAcop(response);
          cambiarEstado(false);
        }
      });
    }
  }

  useEffect(() => {
    getPorcMiscelaneo();
  }, []);

  return (
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
          <Modal.Title>Insertar ACOP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreAcop">Número del ACOP:</label>
              <input
                type="number"
                className="form-control"
                name="input_numeroAcop"
                id="input_numeroAcop"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    numAcop: target.value,
                  }))
                }
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
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    nomAcop: target.value,
                  }))
                }
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
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    fechaIni: target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <label htmlFor="input_fechaFinAcop">Fecha fin del ACOP:</label>
              <input
                type="date"
                className="form-control"
                name="input_fechaFinAcop"
                id="input_fechaFinAcop"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    fechaFin: target.value,
                  }))
                }
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
                  id="input_valorUSD"
                  thousandSeparator={"."}
                  prefix={"$"}
                  onValueChange={(values) => {
                    const { value } = values;
                    setDatos((prevDatos) => ({
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
                  id="input_fechaValorUSD"
                  onChange={({ target }) =>
                    setDatos((prevDatos) => ({
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
                onValueChange={(values) => {
                  const { value } = values;
                  setDatos((prevDatos) => ({
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
                {!isNaN(
                  parseFloat(datos.presupuestoGeneral * datos.valorUSD)
                ) ? (
                  <>
                    (En CLP: &nbsp;
                    {parseFloat(
                      datos.presupuestoGeneral * datos.valorUSD
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
                onValueChange={(values) => {
                  const { value } = values;
                  setDatos((prevDatos) => ({
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
                {!isNaN(parseFloat(datos.presupuestoTotal * datos.valorUSD)) ? (
                  <>
                    (En CLP: &nbsp;
                    {parseFloat(
                      datos.presupuestoTotal * datos.valorUSD
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
            <br></br>
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
                  parseFloat(datos.presupuestoGeneral - datos.presupuestoTotal)
                ) ? (
                  <>
                    (Margen en USD: &nbsp;
                    {parseFloat(
                      datos.presupuestoGeneral - datos.presupuestoTotal
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
                    ((datos.presupuestoGeneral - datos.presupuestoTotal) *
                      100) /
                      datos.presupuestoGeneral
                  )
                ) ? (
                  <>
                    (Rentab esperada: &nbsp;
                    {parseFloat(
                      ((datos.presupuestoGeneral - datos.presupuestoTotal) *
                        100) /
                        datos.presupuestoGeneral
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
                    datos.presupuestoTotal -
                      datos.presupuestoTotal * porcMiscelaneo
                  )
                ) ? (
                  <>
                    (Ppto. HH en USD: &nbsp;
                    {parseFloat(
                      datos.presupuestoTotal -
                        datos.presupuestoTotal * porcMiscelaneo
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
                    datos.presupuestoTotal -
                      datos.presupuestoTotal * porcMiscelaneo
                  )
                ) ? (
                  <>
                    (Ppto. HH en CLP: &nbsp;
                    {parseFloat(
                      (datos.presupuestoTotal -
                        datos.presupuestoTotal * porcMiscelaneo) *
                        datos.valorUSD
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
                {!isNaN(parseFloat(datos.presupuestoTotal * porcMiscelaneo)) ? (
                  <>
                    (Ppto. Misc en USD: &nbsp;
                    {parseFloat(
                      datos.presupuestoTotal * porcMiscelaneo
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
                {!isNaN(parseFloat(datos.presupuestoTotal * porcMiscelaneo)) ? (
                  <>
                    (Ppto. Misc en CLP: &nbsp;
                    {parseFloat(
                      datos.presupuestoTotal * porcMiscelaneo * datos.valorUSD
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
  );
}
