import React, { useState, useEffect } from "react";
import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";
import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

const EditarEmpSubsist = ({
  isActiveEditEmpSubsist,
  cambiarEstado,
  idEmpSubsist,
  EmpSubsist,
  setEmpSubsist,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [idEmpleado, setidEmpleado] = useState("");
  const [idSubsistema, setidSubsistema] = useState("");

  const [listEmpleado, setlistEmpleado] = useState([""]);
  const [listSubsistema, setlistSubsistema] = useState([""]);

  const [responseID, setResponseID] = useState([""]);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const listEmpSubsist = EmpSubsist;

  const show = isActiveEditEmpSubsist;

  const handleClose = () => {
    cambiarEstado(false);
    setidEmpleado(responseID[0].idEmpleado);
    setidSubsistema(responseID[0].idSubsistema);
  };

  // ----------------------FUNCIONES----------------------------
  function obtenerEmpleado() {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEmpleado(response)
    );
  }

  function obtenerSubsist() {
    const url = "pages/auxiliares/listadoSubsistemaForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistSubsistema(response)
    );
  }

  const getData = useCallback(() => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idEmpSubsist, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      setResponseID(response);
      setidEmpleado(response[0].idEmpleado);
      setidSubsistema(response[0].idSubsistema);
    });
  }, [idEmpSubsist]);

  function SendData(e) {
    e.preventDefault();
    var url = "pages/editar/editarEmpSubsist.php";
    var operationUrl = "editarEmpSubsist";
    var data = {
      usuarioModificacion: userData.usuario,
      idEmpSubsist: idEmpSubsist,
      idEmpleado: idEmpleado === "" ? responseID[0].idEmpleado : idEmpleado,
      idSubsistema:
        idSubsistema === "" ? responseID[0].idSubsistema : idSubsistema,
      isActive: true,
    };
  
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
      TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
      actualizarEmpSubsist(datos);
    });

    function actualizarEmpSubsist(EmpSubsist) {
      const nuevosEmpSubsist = listEmpSubsist.map((c) =>
        c.idEmpSubsist === EmpSubsist.idEmpSubsist ? EmpSubsist : c
      );
      setEmpSubsist(nuevosEmpSubsist);
    }
  }

  useEffect(
    function () {
      if (idEmpSubsist !== null) {
        getData();
        obtenerEmpleado();
        obtenerSubsist();
      }
    },
    [idEmpSubsist]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar empleado a subsistema</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="form-group">
              <label htmlFor="input_Empleado">Empleado: </label>
              <select
                required
                className="form-control"
                name="input_Empleado"
                id="input_Empleado"
                placeholder="Seleccione el empleado"
                onChange={({ target }) => setidEmpleado(target.value)}
              >
                {listEmpleado.map((valor) => (
                  <option
                    selected={valor.idEmpleado === idEmpleado ? "selected" : ""}
                    value={valor.idEmpleado}
                  >
                    {valor.nomEmpleado}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input_SubSistema">SubSistema: </label>
              <select
                required
                className="form-control"
                name="input_SubSistema"
                id="input_SubSistema"
                placeholder="Seleccione el subsistema"
                onChange={({ target }) => setidSubsistema(target.value)}
              >
                {listSubsistema.map((valor) => (
                  <option
                    selected={
                      valor.idSubsistema === idSubsistema ? "selected" : ""
                    }
                    value={valor.idSubsistema}
                  >
                    {valor.nomSubsistema}
                  </option>
                ))}
              </select>
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
};

export default EditarEmpSubsist;
