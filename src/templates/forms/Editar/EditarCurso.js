import React, { useState, useEffect } from "react";
import SendDataService from "../../../services/SendDataService";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import TopAlertsError from "../../alerts/TopAlerts";
const EditarCurso = ({
  isActiveEditCurso,
  cambiarEstado,
  idCurso,
  nombreTabla,
  setCurso,
  curso,
}) => {
  // ----------------------CONSTANTES----------------------------

  const [codCurso, setcodCurso] = useState([""]);
  const [nomCurso, setnomCurso] = useState([""]);
  const [tipoHH, settipoHH] = useState([""]);
  const [duracionCursoHH, setduracionCursoHH] = useState([""]);
  const [cantSesionesCurso, setcantSesionesCurso] = useState([""]);
  const [listTipoHHCurso, setListTipoHHCurso] = useState();

  const [responseID, setResponseID] = useState([""]);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const listCurso = curso;

  const show = isActiveEditCurso;

  const handleClose = () => {
    cambiarEstado(false);
    setcodCurso(responseID[0].codCurso);
    setnomCurso(responseID[0].nomCurso);
    settipoHH(responseID[0].tipoHH);
    setduracionCursoHH(responseID[0].duracionCursoHH);
    setcantSesionesCurso(responseID[0].cantSesionesCurso);
  };

  // ----------------------FUNCIONES----------------------------

  function getData() {
    const url = "pages/seleccionar/seleccionarDatos.php";
    const operationUrl = "seleccionarDatos";
    var data = { idRegistro: idCurso, nombreTabla: nombreTabla };
    SendDataService(url, operationUrl, data).then((response) => {
      response;
      setResponseID(response);
      setcodCurso(response[0].codCurso);
      setnomCurso(response[0].nomCurso);
      settipoHH(response[0].tipoHH);
      setduracionCursoHH(response[0].duracionCursoHH);
      setcantSesionesCurso(response[0].cantSesionesCurso);
    });
  }
  function obtenerTipoHH() {
    var url = "pages/listados/listadoConfigDatos.php";
    var operationUrl = "listadoConfigDatos";
    var data = {
      tipoConfDato: "AF",
      subTipoConfDato: "TIPO_CURSO_HH",
    };
    SendDataService(url, operationUrl, data).then((response) => {
      setListTipoHHCurso(response);
    });
  }
  function validaciones() {
    if (codCurso.trim() === "") {
      TopAlertsError("01", "El código del curso no debe estar vacío");
      return true;
    } else if (nomCurso.trim() === "") {
      TopAlertsError("02", "El nombre del curso no debe estar vacío");
      return true;
    } else if (tipoHH <= 0) {
      TopAlertsError("03", "El tipo de HH mayor a cero");
      return true;
    } else if (duracionCursoHH <= 0) {
      TopAlertsError("04", "La duración del curso debe ser mayor a cero");
      return true;
    } else if (cantSesionesCurso <= 0) {
      TopAlertsError(
        "05",
        "La cantidad de sesiones del curso debe ser mayor a cero"
      );
      return true;
    } else {
      return false;
    }
  }
  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/editar/editarCurso.php";
      const operationUrl = "editarCurso";
      const data = {
        usuarioModificacion: userData.usuario,
        idCurso: idCurso,
        codCurso: codCurso === "" ? responseID[0].codCurso : codCurso,
        nomCurso: nomCurso === "" ? responseID[0].nomCurso : nomCurso,
        tipoHH: tipoHH === "" ? responseID[0].tipoHH : tipoHH,
        duracionCursoHH:
          duracionCursoHH === ""
            ? responseID[0].duracionCursoHH
            : duracionCursoHH,
        cantSesionesCurso:
          cantSesionesCurso === ""
            ? responseID[0].cantSesionesCurso
            : cantSesionesCurso,
        isActive: true,
      };
      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarCurso(curso);
        cambiarEstado(false);
      });
    }
  }
  function actualizarCurso(curso) {
    const nuevosCursos = listCurso.map((c) =>
      c.idCurso === curso.idCurso ? curso : c
    );
    setCurso(nuevosCursos);
  }
  useEffect(
    function () {
      if (idCurso !== null) {
        getData();
        obtenerTipoHH();
      }
    },
    [idCurso]
  );

  // ----------------------RENDER----------------------------

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Editar curso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div>
              <label htmlFor="input_nombreDelCodigo">Código del curso:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba el código"
                value={codCurso || ""}
                type="text"
                className="form-control"
                name="input_nombreDelCodigo"
                id="input_nombreDelCodigo"
                maxLength="20"
                onChange={({ target }) => setcodCurso(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_nombreDelCurso">Nombre del curso:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba nombre del curso"
                value={nomCurso || ""}
                type="text"
                className="form-control"
                name="input_nombreDelCurso"
                id="input_nombreDelCurso"
                maxLength="50"
                onChange={({ target }) => setnomCurso(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_tipoDelRamohh">Tipo HH:</label>
              <select
                style={{ textTransform: "uppercase" }}
                value={tipoHH || ""}
                placeholder="Escriba tipo del ramo HH"
                className="form-control"
                name="input_tipoDelRamohh"
                id="input_tipoDelRamohh"
                onChange={({ target }) => settipoHH(target.value)}
                required
              >
                <option hidden value="">
                  Desplegar lista
                </option>
                {listTipoHHCurso &&
                  listTipoHHCurso.map((valor) => (
                    <option
                      value={valor.datoVisible}
                      selected={tipoHH === valor.datoVisible ? true : false}
                    >
                      {valor.datoVisible}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="input_DuracionHH">Duración curso HH:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba tipo HH"
                value={duracionCursoHH || ""}
                type="double"
                className="form-control"
                name="input_DuracionHH"
                id="input_DuracionHH"
                onChange={({ target }) => setduracionCursoHH(target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="input_cantSesionesCurso">Cant sesiones:</label>
              <input
                style={{ textTransform: "uppercase" }}
                placeholder="Escriba tipo HH"
                value={cantSesionesCurso || ""}
                type="number"
                className="form-control"
                name="input_cantSesionesCurso"
                id="input_cantSesionesCurso"
                maxLength="11"
                onChange={({ target }) => setcantSesionesCurso(target.value)}
                required
              />
            </div>

            <Button
              variant="secondary"
              type="submit"
              id="btn_registrar"
              value="Registrar"
              onClick={SendData}
            >
              Registrar
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditarCurso;
