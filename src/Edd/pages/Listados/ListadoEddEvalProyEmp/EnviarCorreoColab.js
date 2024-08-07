import React, { useState, useEffect } from "react";

import "../ListadoEddEvalProyEmp/Insertar.css";
import SendDataService from "../../../../services/SendDataService";
import getDataService from "../../../../services/GetDataService";
import Swal from "sweetalert2";
import TopAlerts from "../../../../templates/alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import TopAlertsError from "../../../../templates/alerts/TopAlerts";

const EnviarCorreoColab = ({
  isActiveEDDEnviarCorreoColab,
  cambiarEstado,
  EDDEnviarCorreoColab,
}) => {
  // ----------------------CONSTANTES----------------------------

  const listEDDEnviarCorreoColab = EDDEnviarCorreoColab;

  const [cicloEvaluacion, setcicloEvaluacion] = useState("");
  const [listcicloEvaluacion, setlistcicloEvaluacion] = useState([""]);

  const [idEDDProyecto, setidEDDProyecto] = useState("");
  const [listEDDProyecto, setlistEDDProyecto] = useState([""]);

  const show = isActiveEDDEnviarCorreoColab;

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------

  function ConfirmAlertEnvio() {
    Swal.fire({
      html: `
          <p>Los correos han sido enviados</p>
          `,
      icon: "success",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Continuar",
    }).then((result) => {
      if (result.isConfirmed) {
        <></>;
      }
    });
  }

  function SendDataEmail(e) {
    e.preventDefault();
    const url = "pages/scripts/eventCiclosEval_manual.php";
    const operationUrl = "eventCiclosEval_manual";
    var data = {
      idProyecto: idEDDProyecto,
      cargoEnProy: "Colaborador",
      tipoConfDato: "EMAIL",
      subTipoConfDato: "",
      listContactos: "",
      isActive: true,
    };
    handleClose();
    SendDataService(url, operationUrl, data).then((response) => {
      console.log(response);
      const { out_codResp, out_msjResp } = response[0];
      TopAlertsError(out_codResp, out_msjResp);

      out_codResp === "00" && ConfirmAlertEnvio();
    });
  }
  function obtenerCicloEvaluacion() {
    const url = "pages/auxiliares/listadoCiclosEval.php";
    const operationUrl = "listados";
    var data = {
      idProyecto: idEDDProyecto,
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setlistcicloEvaluacion(data);
    });
  }

  function obtenerProyecto() {
    const url = "pages/auxiliares/listadoProyectoForms.php";
    const operationUrl = "listados";
    var data = {
      idServicio: "",
    };
    SendDataService(url, operationUrl, data).then((data) => {
      setlistEDDProyecto(data);
    });
  }
  useEffect(
    function () {
      obtenerProyecto();
      obtenerCicloEvaluacion();
    },
    [idEDDProyecto]
  );

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>
            Envío correo de evaluaciones a <strong>Colaboradores</strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendDataEmail}>
            <div className="form-group">
              <label htmlFor="input_Evaluacion">Proyecto: </label>
              <select
                required
                className="form-control"
                name="input_Evaluacion"
                id="input_Evaluacion"
                placeholder="Seleccione la evaluación"
                onChange={({ target }) => setidEDDProyecto(target.value)}
              >
                <option hidden value="">
                  Desplegar lista
                </option>

                {listEDDProyecto.map((valor) => (
                  <option value={valor.idEDDProyecto}>
                    {valor.nomProyecto}
                  </option>
                ))}
              </select>
            </div>
            {/* <div className="form-group">
                        <label htmlFor="Ciclo">Ciclo de evaluación: </label>
                            <select
                                required
                                className="form-control"
                                name="Proyecto"
                                id="Proyecto"
                                placeholder="Seleccione el proyecto"
                                onChange={({ target }) => {
                                    setcicloEvaluacion(target.value);
                                }}
                            >
                                <option hidden value="">
                                    Desplegar lista
                                </option>

                                {
                                    listcicloEvaluacion.map((valor) => (
                                        <option
                                            value={valor.cicloEvaluacion}
                                        >
                                            {valor.cicloEvaluacion}
                                        </option>
                                    ))}
                            </select>
                        </div> */}
            <Button
              variant="secondary"
              type="submit"
              id="btn_registrar"
              value="Registrar"
            >
              Enviar
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default EnviarCorreoColab;
