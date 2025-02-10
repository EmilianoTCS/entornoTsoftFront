import React, { useState, useEffect } from "react";
import "../ListadoDocColab.css";

import getDataService from "../../../../services/GetDataService";
import TopAlertsError from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SendFilesService from "../../../../services/SendFilesService";

export default function EditarDocColab({ isActive, cambiarEstado, datosFila }) {
  const handleClose = () =>
    cambiarEstado((prevDatos) => ({
      ...prevDatos,
      isActiveEditar: false,
    }));
  const show = isActive;
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [datos, setDatos] = useState({
    idDocumento: "",
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
      idDocumento: datos.idDocumento,
      idEmpleado: datos.idEmpleado,
      isActive: 1,
      usuarioCreacion: userData.usuario,
    };
    SendFilesService(
      "/pages/editar/oi_editarDocColaborador.php",
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
      if (datosFila) {
        setDatos({
          idDocumento: datosFila.idDocColaborador,
          idEmpleado: datosFila.idEmpleado,
          archivo: datosFila.archivo,
          isActive: datosFila.isActive,
          usuarioCreacion: userData.usuario,
        });
      }
    },
    [isActive, datosFila]
  );

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar documento colaborador</Modal.Title>
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
                value={datos.idEmpleado}
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
                  <option key={valor.idEmpleado} value={valor.idEmpleado}>
                    {valor.nomEmpleado}
                  </option>
                ))}
              </select>
            </div>
            <br></br>
            <div className="form-group">
              <label>Archivo actual:</label>
              <div className="border rounded p-2 mb-2 bg-light">
                <span>{datosFila.nombreArchivo}</span>
              </div>
            </div>
            <div>
              <label>Subir nuevo archivo (opcional)</label>
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
            <br></br>
            <label style={{ fontSize: "11pt", opacity: "0.7" }}>
              Si no se han realizado cambios, cierre este formulario con el
              botón "X" o apretar la tecla "ESC"
            </label>

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
