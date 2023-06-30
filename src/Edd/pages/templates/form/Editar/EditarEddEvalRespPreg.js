import React, { useState, useEffect } from "react";
import "../Insertar/Insertar.css";
import SendDataService from "../../../../../services/SendDataService";
import getDataService from "../../../../../services/GetDataService";
import TopAlerts from "../../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

const EditarEDDEvalRespPreg = ({
  isActiveEditEDDEvalRespPreg,
  cambiarEstado,
  idEDDEvalRespPreg,
  EDDEvalRespPreg,
  setEDDEvalRespPreg,
  nombreTabla,
}) => {
  // ----------------------CONSTANTES----------------------------
  const [nomRespPreg, setnomRespPreg] = useState("");
  const [ordenRespPreg, setordenRespPreg] = useState("");

  const [idEDDEvalPregunta, setidEDDEvalPregunta] = useState("");

  const [listEDDEvalPregunta, setlistEDDEvalPregunta] = useState([""]);

  const [responseID, setResponseID] = useState([""]);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;
  const listEDDEvalRespPreg = EDDEvalRespPreg;

  const show = isActiveEditEDDEvalRespPreg;

  const handleClose = () => {
    cambiarEstado(false);
    setnomRespPreg(responseID[0].nomRespPreg);
    setordenRespPreg(responseID[0].ordenRespPreg);
    setidEDDEvalPregunta(responseID[0].idEDDEvalPregunta);
  };

  // ----------------------FUNCIONES----------------------------
  function obtenerEvalPreg() {
    const url = "pages/auxiliares/listadoEddEvalPregunta.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
    setlistEDDEvalPregunta(response)
    );
  }

  const getData = useCallback(() => {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idEDDEvalRespPreg, nombreTabla: nombreTabla};
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      setResponseID(response);
      setnomRespPreg(response[0].nomRespPreg);
      setordenRespPreg(response[0].ordenRespPreg);
      setidEDDEvalPregunta(response[0].idEDDEvalPregunta);

    });
  }, [idEDDEvalRespPreg]);

  function SendData(e) {
    e.preventDefault();
    var url = "pages/editar/editarEddEvalRespPreg.php";
    var operationUrl = "editarEddEvalRespPreg";
    var data = {
      usuarioModificacion: userData.usuario,
      idEDDEvalRespPreg: idEDDEvalRespPreg,
      nomRespPreg: nomRespPreg === "" ? responseID[0].nomRespPreg : nomRespPreg,
      ordenRespPreg: ordenRespPreg === "" ? responseID[0].ordenRespPreg : ordenRespPreg,
      idEDDEvalPregunta: idEDDEvalPregunta === "" ? responseID[0].idEDDEvalPregunta : idEDDEvalPregunta,
      isActive:true,
    };
console.log(data);
    SendDataService(url, operationUrl, data).then((response) => {
      TopAlerts('successEdited');
      actualizarEDDEvalRespPreg(EDDEvalRespPreg);console.log(response);
    });

    function actualizarEDDEvalRespPreg(EDDEvalRespPreg) {
      const nuevosEDDEvalRespPreg = listEDDEvalRespPreg.map((c) =>
        c.idEDDEvalRespPreg === EDDEvalRespPreg.idEDDEvalRespPreg ? EDDEvalRespPreg : c
      );
      setEDDEvalRespPreg(nuevosEDDEvalRespPreg);
    }
  }

  useEffect(
    function () {
      if (idEDDEvalRespPreg !== null) {
        getData();
        obtenerEvalPreg();
      }
    },
    [idEDDEvalRespPreg]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar RespPreg</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
          <div>
              <label htmlFor="input_nombreDelEDDEvalRespPreg">RespPreg:</label>
              <input
               style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre RespPreg"
                type="text"
                className="form-control"
                name="input_nombreDelEDDEvalRespPreg"
                id="input_nombreDelEDDEvalRespPreg"
                value={nomRespPreg || ""}
                maxLength="50"
                onChange={({ target }) => setnomProyecto(target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="input_Orden">Orden:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Orden"
                type="number"
                className="form-control"
                name="input_Orden"
                id="input_Orden"
                value={ordenRespPreg || ""}
                maxLength="11"
                onChange={({ target }) => setfechaIni(target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="input_EvalPregunta">EvalPregunta: </label>
              <select
                required
                className="form-control"
                name="input_EvalPregunta"
                id="input_EvalPregunta"
                placeholder="Seleccione la EvalPreg"
                onChange={({ target }) => setidServicio(target.value)}
              >
                {listEDDEvalPregunta.map((valor) => (
                  <option
                    selected={valor.idEDDEvalPregunta === idEDDEvalPregunta ? "selected" : ""}
                    value={valor.idEDDEvalPregunta}
                  >
                    {valor.nomPregunta}
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

export default EditarEDDEvalRespPreg;
