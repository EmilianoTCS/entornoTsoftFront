import React, { useState, useEffect } from "react";
import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";
import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

const EditarEmpTipoPerfil = ({
  isActiveEditEmpTipoPerfil,
  cambiarEstado,
  idEmpTipoPerfil,
  EmpTipoPerfil,
  setEmpTipoPerfil,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [idTipoPerfil, setidTipoPerfil] = useState("");
  const [idEmpleado, setidEmpleado] = useState("");

  const [listEmpleado, setlistEmpleado] = useState([""]);

  const [listTipoPerfil, setlistTipoPerfil] = useState([""]);

  const [responseID, setResponseID] = useState([""]);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const listEmpTipoPerfil = EmpTipoPerfil;

  const show = isActiveEditEmpTipoPerfil;

  const handleClose = () => {
    cambiarEstado(false);
    setidTipoPerfil(responseID[0].idTipoPerfil);
    setidEmpleado(responseID[0].idEmpleado);
  };

  // ----------------------FUNCIONES----------------------------
  function obtenerEmpleado() {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistEmpleado(response)
    );
  }
  function obtenerTipoPerfil() {
    const url = "pages/auxiliares/listadoTipoPerfilForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
    setlistTipoPerfil(response)
    );
  }

  const getData = useCallback(() => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idEmpTipoPerfil, nombreTabla: nombreTabla};
    SendDataService(url, operationUrl, data).then((response) => {
      setResponseID(response);
      setidTipoPerfil(response[0].idTipoPerfil);
      setidEmpleado(response[0].idEmpleado);

    });
  }, [idEmpTipoPerfil]);

  function SendData(e) {
    e.preventDefault();
    var url = "pages/editar/editarEmpTipoPerfil.php";
    var operationUrl = "editarEmpTipoPerfil";
    var data = {
      usuarioModificacion: userData.usuario,
      idEmpTipoPerfil: idEmpTipoPerfil,
      idTipoPerfil: idTipoPerfil === "" ? responseID[0].idTipoPerfil : idTipoPerfil,
      idEmpleado: idEmpleado === "" ? responseID[0].idEmpleado : idEmpleado,
      isActive:true,
    };
console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
      const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
      TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
      actualizarEmpTipoPerfil(datos);
    });

    function actualizarEmpTipoPerfil(EmpTipoPerfil) {
      const nuevosEmpTipoPerfil = listEmpTipoPerfil.map((c) =>
        c.idEmpTipoPerfil === EmpTipoPerfil.idEmpTipoPerfil ? EmpTipoPerfil : c
      );
      setEmpTipoPerfil(nuevosEmpTipoPerfil);
    }
  }

  useEffect(
    function () {
      if (idEmpTipoPerfil !== null) {
        getData();
        obtenerEmpleado();
        obtenerTipoPerfil();
      }
    },
    [idEmpTipoPerfil]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
        <Modal.Title> Editar perfil de empleado</Modal.Title>
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
              <label htmlFor="input_tipPerf">Tipo perfil: </label>
              <select
                required
                className="form-control"
                name="input_tipPerf"
                id="input_tipPerf"
                placeholder="Seleccione el tipo perfil"
                onChange={({ target }) => setidTipoPerfil(target.value)}
              >
                {listTipoPerfil.map((valor) => (
                  <option
                    selected={valor.idTipoPerfil === idTipoPerfil ? "selected" : ""}
                    value={valor.idTipoPerfil}
                  >
                    {valor.nomTipoPerfil}
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

export default EditarEmpTipoPerfil;
