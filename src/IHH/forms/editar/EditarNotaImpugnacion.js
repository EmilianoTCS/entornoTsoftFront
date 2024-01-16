import React, { useState, useEffect } from "react";
import "./Editar.css";

import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EditarNotaImpugnacion({
  isActive,
  cambiarEstado,
  idRegistro,
  nombreTabla,
}) {
  const handleClose = () => cambiarEstado(false);
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
    idImpugnacionEmp: "",
    nota: "",
    isActive: 1,
    usuarioCreacion: userData.usuario,
  });

  const [auxList, setAuxList] = useState({
    impugnacionEmp: [""],
  });

  const obtenerImpugnacionEmp = () => {
    const url = "pages/auxiliares/ihh_listadoImpugnacionEmpForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((data) => {
      setAuxList({ impugnacionEmp: data });
    });
  };

  const obtenerDatos = () => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idRegistro, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      setDatos((prevDatos) => ({
        ...prevDatos,
        idImpugnacionEmp: response[0].idImpugnacionEmp,
        nota: response[0].nota,
      }));
    });
  };

  function SendData(e) {
    e.preventDefault();
    const url = "pages/editar/ihh_editarNotaImpugnacion.php";
    const operationUrl = "ihh_editarNotaImpugnacion";
    var data = {
      idNotaImpugnacion: idRegistro,
      idImpugnacionEmp: datos.idImpugnacionEmp,
      nota: datos.nota,
      isActive: datos.isActive,
      usuarioCreacion: datos.usuarioCreacion,
    };
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
    });
  }

  useEffect(
    function () {
      obtenerImpugnacionEmp();
      obtenerDatos();
    },
    [isActive, idRegistro]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar nota de impugnación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="form-group">
              <label htmlFor="input_Impugnacion">
                Seleccione la impugnación:{" "}
              </label>
              <select
                required
                className="form-control"
                name="input_Impugnacion"
                id="input_Impugnacion"
                placeholder="Impugnación"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    idImpugnacionEmp: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.impugnacionEmp.map((valor) => (
                  <option value={valor.idImpugnacionEmp}>
                    {valor.nomImpugnacionEmp}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_nomElemento">Nota:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Nota"
                type="text"
                className="form-control"
                value={datos.nota || ""}
                name="input_nota"
                id="input_nota"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    nota: target.value,
                  }))
                }
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
