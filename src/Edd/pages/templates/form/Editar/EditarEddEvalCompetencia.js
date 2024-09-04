import React, { useState, useEffect } from "react";
import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";
import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

const EditarEddEvalCompetencia = ({
  isActiveEditEddEvalCompetencia,
  cambiarEstado,
  idEDDEvalCompetencia,
  EddEvalCompetencia,
  setEddEvalCompetencia,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [nomCompetencia, setnomCompetencia] = useState("");

  const [responseID, setResponseID] = useState([""]);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const listEddEvalCompetencia = EddEvalCompetencia;

  const show = isActiveEditEddEvalCompetencia;

  const handleClose = () => {
    cambiarEstado(false);
    setnomCompetencia(responseID[0].nomCompetencia);
  };

  // ----------------------FUNCIONES----------------------------

  const getData = useCallback(() => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idEDDEvalCompetencia, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      setResponseID(response);
      setnomCompetencia(response[0].nomCompetencia);
    });
  }, [idEDDEvalCompetencia]);

  function validaciones() {
    if (nomCompetencia.trim() === "") {
      TopAlertsError("01", "El nombre de la competencia no debe estar vacío");
      return true;
    } else {
      return false;
    }
  }
  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      var url = "pages/editar/editarEddEvalCompetencia.php";
      var operationUrl = "editarEddEvalCompetencia";
      var data = {
        usuarioModificacion: userData.usuario,
        idEDDEvalCompetencia: idEDDEvalCompetencia,
        nomCompetencia:
          nomCompetencia === "" ? responseID[0].nomCompetencia : nomCompetencia,
        isActive: true,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT, ...datos } = response[0];
        TopAlerts(OUT_CODRESULT, OUT_MJERESULT);
        actualizarEddEvalCompetencia(datos);
      });
    }
  }
  function actualizarEddEvalCompetencia(EddEvalCompetencia) {
    const nuevosEddEvalCompetencia = listEddEvalCompetencia.map((c) =>
      c.idEddEvalCompetencia === EddEvalCompetencia.idEddEvalCompetencia
        ? EddEvalCompetencia
        : c
    );
    setEddEvalCompetencia(nuevosEddEvalCompetencia);
  }
  useEffect(
    function () {
      if (idEDDEvalCompetencia !== null) {
        getData();
      }
    },
    [idEDDEvalCompetencia]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Competencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreDelEddEvalCompetencia">
                Competencia:
              </label>
              <input
                value={nomCompetencia}
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre"
                type="text"
                className="form-control"
                name="input_nombreDelEddEvalCompetencia"
                id="input_nombreDelEddEvalCompetencia"
                maxLength="50"
                onChange={({ target }) => setnomCompetencia(target.value)}
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
};

export default EditarEddEvalCompetencia;
