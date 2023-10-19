import React, { useState, useEffect } from "react";
import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";
import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

const EditarEDDProyEmp = ({
  isActiveEditEDDProyEmp,
  cambiarEstado,
  idEDDProyEmp,
  EDDProyEmp,
  setEDDProyEmp,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [cargoEnProy, setcargoEnProy] = useState("");

  const [idProyecto, setidProyecto] = useState("");
  const [idEmpleado, setidEmpleado] = useState("");

  const [listProyecto, setlistProyecto] = useState([""]);
  const [listEmpleado, setlistEmpleado] = useState([""]);

  const [responseID, setResponseID] = useState([""]);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const [reset, setReset] = useState(false);

  const listEDDProyEmp = EDDProyEmp;

  const show = isActiveEditEDDProyEmp;

  const handleClose = () => {
    cambiarEstado(false);
    setcargoEnProy(responseID[0].cargoEnProy);
    setidProyecto(responseID[0].idProyecto);
    setidEmpleado(responseID[0].idEmpleado);
    setReset(true)
  };

  // ----------------------FUNCIONES----------------------------
  function obtenerProyecto() {
    const url = "pages/auxiliares/listadoProyectoForms.php";
    const operationUrl = "listados";
    var data = {
      idServicio: '',
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setlistProyecto(data);
    });
  }
  function obtenerEmpleado() {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEmpleado(response)
    );
  }

  const getData = useCallback(() => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idEDDProyEmp, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      setResponseID(response);
      setcargoEnProy(response[0].cargoEnProy);
      setidProyecto(response[0].idProyecto);
      setidEmpleado(response[0].idEmpleado);
      setReset(true)
    });
  }, [idEDDProyEmp]);

  function SendData(e) {
    e.preventDefault();
    var url = "pages/editar/editarEddProyEmp.php";
    var operationUrl = "editarEddProyEmp";
    var data = {
      usuarioModificacion: userData.usuario,
      idEDDProyEmp: idEDDProyEmp,
      cargoEnProy: cargoEnProy === "" ? responseID[0].cargoEnProy : cargoEnProy,
      idProyecto: idProyecto === "" ? responseID[0].idProyecto : idProyecto,
      idEmpleado: idEmpleado === "" ? responseID[0].idEmpleado : idEmpleado,
      isActive: true,
    };
    console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
      TopAlerts("successEdited");
      actualizarEDDProyEmp(EDDProyEmp);
    });

    function actualizarEDDProyEmp(EDDProyEmp) {
      const nuevosEDDProyEmp = listEDDProyEmp.map((c) =>
        c.idEDDProyEmp === EDDProyEmp.idEDDProyEmp ? EDDProyEmp : c
      );
      setEDDProyEmp(nuevosEDDProyEmp);
    }
  }

  useEffect(
    function () {
      if (idEDDProyEmp !== null) {
        getData();
        obtenerEmpleado();
        obtenerProyecto();
      }
    },
    [idEDDProyEmp,reset]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
        <Modal.Title>Editar proyecto - empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="form-group">
              <label htmlFor="input_serv">Proyecto: </label>
              <select
                required
                className="form-control"
                name="input_Empleado"
                id="input_Empleado"
                placeholder="Seleccione el proyecto"
                value={idProyecto || ""}
                onChange={({ target }) => setidProyecto(target.value)}
              >
                {listProyecto.map((valor) => (
                  <option
                    selected={valor.idEDDProyecto === idProyecto ? "selected" : ""}
                    value={valor.idEDDProyecto}
                  >
                    {valor.nomProyecto}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input_serv">Empleado: </label>
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
              <label htmlFor="input_nombreDelcargo">Cargo en proyecto: </label>
              <select
                required
                className="form-control"
                name="input_nombreDelcargo"
                id="input_nombreDelcargo"
                onChange={({ target }) => setcargoEnProy(target.value)}
              >
                <option value="Referente" selected={cargoEnProy.toUpperCase() === 'REFERENTE' ? true : ""}>
                  REFERENTE
                </option>
                <option value="Colaborador" selected={cargoEnProy.toUpperCase() === 'COLABORADOR' ? true : ""}>
                  COLABORADOR
                </option>                
                
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

export default EditarEDDProyEmp;
