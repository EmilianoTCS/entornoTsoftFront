import React, { useState } from "react";
import "./Insertar.css";
import { NumericFormat } from "react-number-format";

import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EditarMesAcop from "../editar/EditarMesAcop";

export default function InsertarAcop({ isActive, cambiarEstado }) {
  const handleClose = () => cambiarEstado(false);
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [datosMesesAcop, setDatosMesesAcop] = useState([""]);
  const [isActiveFormularioPresupuesto, setisActiveFormularioPresupuesto] =
    useState(false);

  const [datos, setDatos] = useState({
    nomAcop: "",
    fechaIni: "",
    fechaFin: "",
    valorUSD: "",
    presupuestoTotal: "",
    isActive: 1,
    usuarioCreacion: userData.usuario,
  });

  function SendData(e) {
    e.preventDefault();
    const url = "pages/insertar/ihh_insertarAcop.php";
    const operationUrl = "ihh_insertarAcop";
    var data = {
      nomAcop: datos.nomAcop,
      fechaIni: datos.fechaIni,
      fechaFin: datos.fechaFin,
      valorUSD: datos.valorUSD,
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
            <div>
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
                    presupuestoTotal: parseFloat(value),
                  }));
                }}
                decimalSeparator=","
                required
                decimalScale={2}
                fixedDecimalScale={true}
              />
              <label>
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
