import React, { useState, useEffect } from "react";
import SendDataService from "../../../services/SendDataService";
import getDataService from "../../../services/GetDataService";
import Header from "../../../templates/Header/Header";
import { Button, Table } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import AuthorizationError from "../../../templates/alerts/AuthorizationErrorAlert";
import "./styles_res_ihh_colab.css";
import TopAlertsError from "../../../templates/alerts/TopAlerts";
import { MdCalendarMonth } from "react-icons/md";
import { AiFillProject } from "react-icons/ai";


export default function Resumen_ihh_colab() {
  const [listadoColaboradores, setListadoColaboradores] = useState([]);
  const [listadoProyectos, setListadoProyectos] = useState([]);
  const [listadoDatosResumen, setListadoDatosResumen] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [idColaborador, setIdColaborador] = useState(null);
  const [nombreColaborador, setNombreColaborador] = useState(null);
  const [idProyecto, setIdProyecto] = useState(null);
  const [nombreProyecto, setNombreProyecto] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData")) ?? null;

  function obtenerColaboradores() {
    const url = "pages/auxiliares/listadoEmpleadoForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      setListadoColaboradores(response);
    });
  }
  function obtenerProyectos() {
    const url = "pages/auxiliares/listadoProyectosActivosForms.php";
    const operationUrl = "listados";
    getDataService(url, operationUrl).then((response) => {
      setListadoProyectos(response);
    });
  }
  function validarFiltros(data) {
    let errores = false;
    if (!data.fechaInicio || !data.fechaFin) {
      errores = true;
      TopAlertsError(
        "01",
        "Las fechas de inicio y fin no pueden estar vacías."
      );
    } else if (new Date(data.fechaInicio) > new Date(data.fechaFin)) {
      errores = true;
      TopAlertsError(
        "02",
        "La fecha de inicio no puede ser mayor a la fecha de fin."
      );
    } else if (!data.idColaborador) {
      TopAlertsError("03", "El colaborador no puede estar vacío.");
      errores = true;
    }

    return errores;
  }
  function SendData() {
    const url = "pages/listados/ihh_listado_resumen_colab_proy.php";
    const operationUrl = "ihh_listado_resumen_colab_proy";
    const data = {
      idColaborador: idColaborador,
      idProyecto: idProyecto,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    };
    if (!validarFiltros(data)) {
      SendDataService(url, operationUrl, data).then((response) => {
        console.log(response);
        setListadoDatosResumen(response);
      });
    }
  }

  useEffect(function () {
    obtenerColaboradores();
    obtenerProyectos();
  }, []);

  return userData.statusConected || userData !== null ? (
    userData.nomRol === "administrador" ||
    userData.nomRol === "gerencia" ||
    userData.nomRol === "people" ? (
      <>
        <Header></Header>
        <br />
        <section className="containerTitulo_ihh_res_colab">
          <h2>Resumen de carga de horas por colaborador</h2>
          <h6 style={{ color: "gray" }}>
            Impugnación de Horas {"->"} Resumen de carga de horas por colaborador
          </h6>
        </section>
        <br />
        {/* Filtros */}
        <section>
          <div className="cl_container_filtros_res_ihh_colab">
            {/* colaboradores */}
            <div className="container_inputs_filtros">
              <label>Nombre colaborador</label>
              <input
                list="colaboradores"
                className="input_colaborador"
                placeholder="Busca un colaborador TSOFT"
                defaultValue={nombreColaborador || ""}
                onChange={(event) => {
                  const selectedNombre = event.target.value;
                  const selectedEmpleado = listadoColaboradores.find(
                    (item) => item.nomEmpleado === selectedNombre
                  );
                  if (selectedEmpleado) {
                    setNombreColaborador(selectedEmpleado.nomEmpleado);
                    setIdColaborador(selectedEmpleado.idEmpleado);
                  }
                }}
              ></input>
              <datalist id="colaboradores">
                {listadoColaboradores.map((item) => (
                  <option
                    key={item.idEmpleado}
                    value={item.nomEmpleado}
                  ></option>
                ))}
              </datalist>
            </div>
            {/* proyectos */}
            <div className="container_inputs_filtros">
              <label>Nombre proyecto (opcional)</label>
              <input
                list="listProyectosActivos"
                className="input_proyectos"
                defaultValue={nombreProyecto || ""}
                placeholder="Busca un proyecto"
                onChange={(event) => {
                  const selectedNombre = event.target.value;
                  if (selectedNombre === "Todos") {
                    setIdProyecto(null);
                  } else {
                    const selectedProyecto = listadoProyectos.find(
                      (item) => item.nomProyecto === selectedNombre
                    );
                    if (selectedProyecto) {
                      setIdProyecto(selectedProyecto.idEDDProyecto);
                      setNombreProyecto(selectedProyecto.nomProyecto);
                    }
                  }
                }}
              ></input>

              <datalist id="listProyectosActivos">
                <option key={null} value={"Todos"}></option>
                {listadoProyectos.map((item) => (
                  <option
                    key={item.idEDDProyecto}
                    value={item.nomProyecto}
                  ></option>
                ))}
              </datalist>
            </div>
            {/* fecha inicio */}
            <div>
              <label>Fecha inicio desde:</label>
              <input
                className="form-control"
                type="date"
                value={fechaInicio || ""}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            {/* fecha fin */}
            <div>
              <label>Fecha fin desde:</label>
              <input
                className="form-control"
                type="date"
                value={fechaFin || ""}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            {/* boton buscar */}
            <div className="container_btn_buscar">
              <Button
                className="btn_buscar"
                onClick={() => {
                  SendData();
                }}
              >
                Buscar
              </Button>
              <br />
            </div>
          </div>
        </section>
        <br></br>
        {/* {tabla} */}
        <section className="sctn_res_ihh_colab">
          <Table hover responsive className="tbl_res_ihh_colab">
            <thead>
              <th className="th_nomProyecto">Nombre proyecto</th>
              <th className="th_num">Cant HH acumuladas </th>
              <th className="th_num">Cant HHEE acumuladas</th>
              <th className="th_operaciones">Operaciones</th>
            </thead>
            <tbody>
              {listadoDatosResumen.map((item) => (
                <tr>
                  <td className="td_nomProyecto">{item.nomProyecto}</td>
                  <td className="td_num_right_text">{item.cantHH}</td>
                  <td className="td_num_right_text">{item.cantHHEE}</td>
                  <td className="td_operaciones">
                    <Link
                      to={`/ihh/Resumen_ihh_colab_mes/${idColaborador}/0/${fechaInicio}/${fechaFin}`}
                    >
                      <Button
                        data-title="Detalle mes a mes"
                        id="OperationBtns"
                        style={{ color: "black" }}
                      >
                        <MdCalendarMonth id="icons" />
                      </Button>
                    </Link>
                    <Link
                      to={`/ihh/Resumen_ihh_colab_proy/${idColaborador}/${item.idProyecto}/${fechaInicio}/${fechaFin}`}
                    >
                      <Button
                        data-title="Detalle de movimientos mensuales"
                        id="OperationBtns"
                        style={{ color: "black" }}
                      >
                        <AiFillProject id="icons" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <br />
        </section>
      </>
    ) : (
      <AuthorizationError />
    )
  ) : (
    <Navigate to="/login"></Navigate>
  );
}
