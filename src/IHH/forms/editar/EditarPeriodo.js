import React, { useState, useEffect } from "react";
import "./Editar.css";

import getDataService from "../../../services/GetDataService";
import SendDataService from "../../../services/SendDataService";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EditarPeriodo({
  isActive,
  cambiarEstado,
  idRegistro,
  nombreTabla,
}) {
  const handleClose = () => cambiarEstado(false);
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
    idTipoPeriodo: "",
    nomPeriodo: "",
    descripcion: "",
    isActive: 1,
    usuarioCreacion: userData.usuario,
  });

  const [auxList, setAuxList] = useState({
    tipoPeriodo: [""],
  });

  const obtenerTipoPeriodos = () => {
    var url = "pages/auxiliares/ihh_listadoTipoPeriodoForms.php";
    var operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      console.log(data);
      setAuxList({ tipoPeriodo: data });
    });
  };

  const obtenerDatos = () => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idRegistro, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      setDatos((prevDatos) => ({
        ...prevDatos,
        idTipoPeriodo: response[0].idTipoPeriodo,
        nomPeriodo: response[0].nomPeriodo,
        descripcion: response[0].descripcion,
      }));
    });
  };

  function SendData(e) {
    e.preventDefault();
    const url = "pages/editar/ihh_editarPeriodo.php";
    const operationUrl = "ihh_editarPeriodo";
    var data = {
      idPeriodo: idRegistro,
      idTipoPeriodo: datos.idTipoPeriodo,
      nomPeriodo: datos.nomPeriodo,
      descripcion: datos.descripcion,
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
      obtenerTipoPeriodos();
      obtenerDatos();
    },
    [isActive, idRegistro]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar período</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="form-group">
              <label htmlFor="input_Proyecto">Tipo de período: </label>
              <select
                required
                className="form-control"
                name="input_Proyecto"
                id="input_Proyecto"
                placeholder="Seleccione el tipo de período"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    idTipoPeriodo: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.tipoPeriodo.map((valor) => (
                  <option 
                  selected ={valor.idTipoPeriodo === datos.idTipoPeriodo ? "selected" : ""}
                  value={valor.idTipoPeriodo}>
                    {valor.nomTipoPeriodo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_nomPeriodo">Nombre del período:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Nombre del periodo"
                type="text"
                className="form-control"
                name="input_nomPeriodo"
                value={datos.nomPeriodo || ""}
                id="input_nomPeriodo"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    nomPeriodo: target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <label htmlFor="input_descripcion">Descripción (opcional):</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Descripción del período"
                type="text"
                className="form-control"
                name="input_descripcion"
                id="input_descripcion"
                value={datos.descripcion || ""}
d
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    descripcion: target.value,
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
