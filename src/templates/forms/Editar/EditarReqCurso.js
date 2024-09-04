import React, { useState, useEffect } from "react";
import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import TopAlertsError from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

const EditarReqCurso = ({
  isActiveEditReqCurso,
  cambiarEstado,
  idReqCurso,
  reqCurso,
  setReqCurso,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [idCursoRequisito, setidCursoRequisito] = useState("");
  const [idCurso, setidCurso] = useState("");

  const [listCurso, setlistCurso] = useState([""]);

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const [responseID, setResponseID] = useState([""]);
  const listReqCurso = reqCurso;

  const show = isActiveEditReqCurso;

  const handleClose = () => {
    cambiarEstado(false);

    setidCursoRequisito(responseID[0].idCursoRequisito);
    setidCurso(responseID[0].idCurso);
  };
  // ----------------------FUNCIONES----------------------------
  function obtenerCurso() {
    const url = "pages/auxiliares/listadoCursoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCurso(response)
    );
  }

  const getData = useCallback(() => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idReqCurso, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      setResponseID(response);

      setidCurso(response[0].idCurso);
      setidCursoRequisito(response[0].requisitoCurso);
    });
  }, [idReqCurso]);

  function validaciones() {
    if (idCurso < 0) {
      TopAlertsError("01", "El nombre del curso no puede estar vacío");
      return true;
    } else if (idCursoRequisito < 0) {
      TopAlertsError("02", "El nombre del curso requisito no debe estar vacío");
      return true;
    } else if (idCurso === idCursoRequisito) {
      TopAlertsError("03", "Un curso no puede ser su propio requisito");
      return true;
    } else {
      return false;
    }
  }

  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/editar/editarReqCurso.php";
      const operationUrl = "editarReqCurso";

      var data = {
        usuarioModificacion: userData.usuario,
        idReqCurso: idReqCurso,
        idCursoRequisito:
          idCursoRequisito === ""
            ? responseID[0].idCursoRequisito
            : idCursoRequisito,
        idCurso: idCurso === "" ? responseID[0].idCurso : idCurso,
        isActive: true,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...reqCurso } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarReqCurso(reqCurso);
        cambiarEstado(false);
      });
    }
  }
  function actualizarReqCurso(reqCurso) {
    const nuevosReqCurso = listReqCurso.map((c) =>
      c.idReqCurso === reqCurso.idReqCurso ? reqCurso : c
    );
    setReqCurso(nuevosReqCurso);
  }
  useEffect(
    function () {
      if (idReqCurso !== null) {
        getData();
        obtenerCurso();
      }
    },
    [idReqCurso]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar requisito de curso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_Curso">Nombre del curso:</label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => setidCurso(target.value)}
              >
                {listCurso.map((valor) => (
                  <option
                    selected={valor.idCurso === idCurso ? "selected" : ""}
                    value={valor.idCurso}
                  >
                    {valor.nomCurso}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_Curso">Nombre del curso requisito:</label>
              <select
                required
                type="text"
                className="form-control"
                onChange={({ target }) => setidCursoRequisito(target.value)}
              >
                {listCurso.map((valor) => (
                  <option
                    selected={valor.idCurso === idCurso ? "selected" : ""}
                    value={valor.idCurso}
                  >
                    {valor.nomCurso}
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

export default EditarReqCurso;
