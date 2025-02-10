import React, { useState, useEffect } from "react";
import "../ListadoDocColab.css";

import getDataService from "../../../../services/GetDataService";
import SendDataService from "../../../../services/SendDataService";
import TopAlertsError from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SendFilesService from "../../../../services/SendFilesService";

export default function InsertarDocColab({ isActive, cambiarEstado }) {
  const handleClose = () =>
    cambiarEstado((prevDatos) => ({
      ...prevDatos,
      isActiveInsertar: false,
    }));
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
    idEmpleado: "",
    archivo: "",
    isActive: 1,
    usuarioCreacion: userData.usuario,
  });

  const [auxList, setAuxList] = useState({
    listadoEmpleados: [""],
  });

  const obtenerEmpleados = () => {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";

    getDataService(url, operationUrl).then((data) => {
      setAuxList((prevDatos) => ({
        ...prevDatos,
        listadoEmpleados: data,
      }));
    });
  };

  function SendData(e) {
    e.preventDefault();
    var data = {
      idEmpleado: datos.idEmpleado,
      isActive: 1,
      usuarioCreacion: userData.usuario,
    };
    SendFilesService(
      "/pages/insertar/oi_insertarDocColaborador.php",
      datos.archivo,
      data
    ).then((response) => {
      console.log(response);
      const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
      TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
    });
  }

  useEffect(
    function () {
      obtenerEmpleados();
    },
    [isActive]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Insertar documento colaborador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="form-group">
              <label htmlFor="input_Proyecto">
                Seleccione un colaborador:{" "}
              </label>
              <select
                required
                className="form-control"
                placeholder="Seleccione un colaborador"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    idEmpleado: target.value,
                  }))
                }
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {auxList.listadoEmpleados.map((valor) => (
                  <option value={valor.idEmpleado}>{valor.nomEmpleado}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Archivo:</label>

              <input
                type="file"
                className="form-control"
                onChange={({ target }) =>
                  setDatos((prevDatos) => ({
                    ...prevDatos,
                    archivo: target.files[0],
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
