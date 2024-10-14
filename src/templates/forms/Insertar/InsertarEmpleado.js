import React, { useState, useEffect } from "react";

// import Select from "react-select";
import { NumericFormat } from "react-number-format";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../../templates/forms/Insertar.css";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import TopAlertsError from "../../alerts/TopAlerts";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InsertarEmpleado = ({ isActiveEmpleado, cambiarEstado, empleado }) => {
  // ----------------------CONSTANTES----------------------------
  const [nomEmpleado, setNomEmpleado] = useState("");
  const [correoEmpleado, setcorreoEmpleado] = useState("");
  const [idPais, setidPais] = useState("");
  const [idCargo, setidCargo] = useState("");
  const [idArea, setidArea] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [tipoUsuario, settipoUsuario] = useState("");
  const [nomRol, setnomRol] = useState("");
  const [valorHH, setValorHH] = useState("");
  const [telefonoEmpleado, settelefonoEmpleado] = useState("");
  const [idSubsistema, setidSubsistema] = useState("");
  const [listSubsistema, setlistSubsistema] = useState([""]);
  const [idCliente, setidCliente] = useState("");

  const [listCliente, setlistCliente] = useState([""]);
  const [listPais, setlistPais] = useState([""]);
  const [listCargo, setlistCargo] = useState([""]);
  const [listArea, setlistArea] = useState([""]);
  const [listNomRol, setlistNomRol] = useState([""]);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  const listEmpleado = empleado;

  const show = isActiveEmpleado;

  const handleClose = () => cambiarEstado(false);

  // ----------------------FUNCIONES----------------------------
  function obtenerCliente() {
    const url = "pages/auxiliares/listadoClienteForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCliente(response)
    );
  }
  function obtenerSubsistema() {
    const url = "pages/auxiliares/listadoSubsistemaForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistSubsistema(response)
    );
  }

  function obtenerPais() {
    const url = "pages/auxiliares/listadoPaisForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistPais(response));
  }
  function obtenerCargo() {
    const url = "pages/auxiliares/listadoCargoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistCargo(response)
    );
  }
  function obtenerArea() {
    const url = "pages/auxiliares/listadoAreaForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => setlistArea(response));
  }
  function obtenerNomRol() {
    const url = "pages/auxiliares/listadoRolForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) =>
      setlistNomRol(response)
    );
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  function validaciones() {
    const regexInvalidoNombre = /[^a-zA-Z\sáéíóúÁÉÍÓÚñÑ]/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

    const regexTelefono = /^\+?\d[\d +\-]*$/;
    const regexCorreo =
      /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;

    if (nomEmpleado.trim() === "") {
      TopAlertsError("01", "El nombre del colaborador no puede estar vacío");
      return true;
    }

    if (!passwordRegex.test(password)) {
      TopAlertsError(
        "13",
        "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial"
      );
      return true;
    }

    if (regexInvalidoNombre.test(nomEmpleado)) {
      TopAlertsError(
        "12",
        "El nombre del colaborador no puede contener números ni caracteres especiales"
      );
      return true;
    }

    if (correoEmpleado.trim() === "" && regexCorreo.test(correoEmpleado)) {
      TopAlertsError("02", "El correo del colaborador no puede estar vacío");
      return true;
    }

    // Validación del campo teléfono
    if (
      telefonoEmpleado.trim() !== "" &&
      !regexTelefono.test(telefonoEmpleado)
    ) {
      TopAlertsError(
        "14",
        "El teléfono solo puede contener números, el signo '+' y el signo '-'"
      );
      return true;
    }

    if (idPais < 0) {
      TopAlertsError("05", "El país del colaborador no debe estar vacío");
      return true;
    }

    if (idCargo < 0) {
      TopAlertsError("06", "El cargo del colaborador no debe estar vacío");
      return true;
    }

    if (idArea < 0) {
      TopAlertsError("07", "El área del colaborador no debe estar vacía");
      return true;
    }

    if (tipoUsuario.trim() === "") {
      TopAlertsError("08", "El tipo de usuario no debe estar vacío");
      return true;
    }

    if (nomRol < 0) {
      TopAlertsError("09", "El rol del colaborador no debe estar vacío");
      return true;
    }

    if (idCliente < 0) {
      TopAlertsError("10", "El cliente del colaborador no debe estar vacío");
      return true;
    }

    if (valorHH <= 0) {
      TopAlertsError("11", "El valor HH del colaborador debe ser mayor a cero");
      return true;
    }

    return false; // Si ninguna validación falla, se devuelve `false`
  }

  function SendData(e) {
    e.preventDefault();
    const errores = validaciones();
    if (!errores) {
      const url = "pages/insertar/insertarEmpleado.php";
      const operationUrl = "insertarEmpleado";
      var data = {
        usuarioCreacion: userData.usuario,
        nomEmpleado: nomEmpleado,
        correoEmpleado: correoEmpleado,
        idPais: idPais,
        idCargo: idCargo,
        idArea: idArea,
        idCliente: idCliente,
        valorHH: valorHH,
        usuario: usuario,
        password: password,
        tipoUsuario: tipoUsuario,
        nomRol: nomRol,
        telefonoEmpleado: telefonoEmpleado,
        idSubsistema: idSubsistema,
      };
      console.log(data);

      SendDataService(url, operationUrl, data).then((response) => {
        const { OUT_CODRESULT, OUT_MJERESULT } = response[0];
        TopAlertsError(OUT_CODRESULT, OUT_MJERESULT);
        actualizarEmpleados(empleado);
        cambiarEstado(false);
      });
    }
  }

  function actualizarEmpleados(response) {
    listEmpleado.push(response);
  }

  useEffect(function () {
    obtenerPais();
    obtenerCargo();
    obtenerArea();
    obtenerNomRol();
    obtenerCliente();
    obtenerSubsistema();
  }, []);

  // ----------------------RENDER----------------------------
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={true}
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Insertar Colaborador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={SendData}>
            <div className="izquierda" style={{ width: 220 }}>
              <div>
                <label htmlFor="input_nombreDelEmpleado">Nombre:</label>
                <input
                  style={{ textTransform: "uppercase" }}
                  placeholder="Escriba nombre completo del empleado"
                  type="text"
                  className="form-control"
                  name="input_nombreEmpleado"
                  id="input_nombreEmpleado"
                  maxLength="50"
                  // size='5'
                  onChange={({ target }) => setNomEmpleado(target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="input_Correo">Correo:</label>
                <input
                  style={{ textTransform: "uppercase" }}
                  placeholder="Escriba el correo del empleado"
                  type="email"
                  className="form-control"
                  name="input_correo"
                  id="input_correo"
                  maxLength="100"
                  onChange={({ target }) => setcorreoEmpleado(target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="input_Usuario">Usuario del colaborador:</label>
                <input
                  style={{ textTransform: "uppercase" }}
                  placeholder="Escriba el usuario del colaborador"
                  type="text"
                  className="form-control"
                  name="input_usuarioCustom"
                  id="input_usuarioCustom"
                  maxLength="20"
                  autoComplete="off"
                  onChange={({ target }) => setUsuario(target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="input_contraseña">Contraseña:</label>
                <div className="input-group">
                  <input
                    placeholder="Escriba la contraseña"
                    type={passwordVisible ? "text" : "password"}
                    className="form-control"
                    name="input_contraseña"
                    id="input_contraseña"
                    maxLength="50"
                    autoComplete="new-password"
                    onChange={({ target }) => setPassword(target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="input_telefono">Teléfono (opcional): </label>

                <input
                  placeholder="Escriba el teléfono"
                  type="tel"
                  className="form-control"
                  name="input_telefono"
                  id="input_telefono"
                  maxLength="15"
                  onChange={({ target }) => settelefonoEmpleado(target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="input_pais">País: </label>
                <select
                  required
                  className="form-control"
                  name="input_pais"
                  id="input_pais"
                  placeholder="Seleccione el pais"
                  onChange={({ target }) => setidPais(target.value)}
                >
                  <option hidden value="">
                    Desplegar lista
                  </option>
                  {listPais.map((valor) => (
                    <option value={valor.idPais}>{valor.nomPais}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="input_Cargo">Cargo: </label>
                <select
                  required
                  className="form-control"
                  name="input_Cargo"
                  id="input_Cargo"
                  placeholder="Seleccione el cargo"
                  onChange={({ target }) => setidCargo(target.value)}
                >
                  <option hidden value="">
                    Desplegar lista
                  </option>
                  {listCargo.map((valor) => (
                    <option value={valor.idCargo}>{valor.nomCargo}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="input_Area">Área: </label>
                <select
                  required
                  className="form-control"
                  name="input_Area"
                  id="input_Area"
                  placeholder="Seleccione el área"
                  onChange={({ target }) => setidArea(target.value)}
                >
                  <option hidden value="">
                    Desplegar lista
                  </option>
                  {listArea.map((valor) => (
                    <option value={valor.idArea}>{valor.nomArea}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="derecha" style={{ width: 235 }}>
              <div className="form-group">
                <label htmlFor="input_TipoDeUsuario">Tipo de usuario: </label>
                <select
                  required
                  className="form-control"
                  name="input_TipoDeUsuario"
                  id="input_TipoDeUsuario"
                  placeholder="Seleccione el tipo de usuario"
                  onChange={({ target }) => settipoUsuario(target.value)}
                >
                  <option hidden value="">
                    Desplegar lista
                  </option>
                  <option value="EMPLEADO">EMPLEADO</option>
                  <option value="ALUMNO">ALUMNO</option>
                  <option value="RELATOR">RELATOR</option>
                  <option value="PEOPLE">PEOPLE</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="input_RolUsuario">Rol de usuario: </label>
                <select
                  required
                  className="form-control"
                  name="input_RolUsuario"
                  id="input_RolUsuario"
                  placeholder="Seleccione el rol de usuario"
                  onChange={({ target }) => setnomRol(target.value)}
                >
                  <option hidden value="">
                    Desplegar lista
                  </option>

                  {listNomRol.map((valor) => (
                    <option value={valor.idRolUsuario}>{valor.nomRol}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="input_RolUsuario">Cliente: </label>
                <select
                  required
                  className="form-control"
                  name="input_RolUsuario"
                  id="input_RolUsuario"
                  placeholder="Seleccione el rol de usuario"
                  onChange={({ target }) => setidCliente(target.value)}
                >
                  <option hidden value="">
                    Desplegar lista
                  </option>

                  {listCliente.map((valor) => (
                    <option value={valor.idCliente}>{valor.nomCliente}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="input_Usuario">Valor HH:</label>

                <NumericFormat
                  placeholder="Escriba el valor hora del colaborador"
                  className="form-control"
                  name="input_valorHH"
                  id="input_valorHH"
                  thousandSeparator={"."}
                  prefix={"$"}
                  onValueChange={(values) => {
                    const { value } = values;
                    setValorHH(parseFloat(value));
                  }}
                  decimalSeparator=","
                  required
                  decimalScale={2}
                  fixedDecimalScale={true}
                />
              </div>

              {/* <div className="form-group" >
                <label htmlFor="input_RolUsuario">Activar subsistema : </label>
                <select
                  // isMulti
                  required
                  multiple
                  // options={listSubsistema}
                  // closeMenuOnSelect={false}
                  // className="basic-multi-select"
                  // classNamePrefix="select"
                  name="input_RolUsuario"
                  id="input_RolUsuario"
                  placeholder="Seleccione el subsistema"
                  onChange={({ target }) => setidSubsistema(target.value)}
                >
                   <option hidden value="">
                    Desplegar lista
                  </option>

                  {listSubsistema.map((valor) => (
                    <option value={valor.idSubsistema}>
                      {valor.nomSubsistema}
                    </option>
                  ))} 
                </select>
              </div> */}
            </div>

            <Button
              variant="secondary"
              type="submit"
              id="btn_registrar"
              value="Registrar"
              // className="registrarAbajo"
            >
              Registrar
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default InsertarEmpleado;
